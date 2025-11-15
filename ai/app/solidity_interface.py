# solidity_interface.py
from dotenv import load_dotenv
from web3 import Web3
import os
import json
from typing import List, Dict, Any

load_dotenv("../solidity.env")

# ENV VARS
WEB3_PROVIDER_URI = os.getenv("WEB3_PROVIDER_URI")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

print("[solidity_interface] WEB3_PROVIDER_URI:", WEB3_PROVIDER_URI)
print("[solidity_interface] CONTRACT_ADDRESS:", CONTRACT_ADDRESS)
print("[solidity_interface] PRIVATE_KEY set?:", PRIVATE_KEY is not None)

if WEB3_PROVIDER_URI is None:
    raise RuntimeError("WEB3_PROVIDER_URI is not set in environment")
if CONTRACT_ADDRESS is None:
    raise RuntimeError("CONTRACT_ADDRESS is not set in environment")
if PRIVATE_KEY is None:
    raise RuntimeError("PRIVATE_KEY is not set in environment")

# WEB3
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URI))
print("[solidity_interface] Web3 connected?", w3.is_connected())

account = w3.eth.account.from_key(PRIVATE_KEY)
print("[solidity_interface] Using account:", account.address)

# ABI → copy/paste ABI array from InfraStorage.json
ABI_JSON = """
[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int32",
          "name": "latE6",
          "type": "int32"
        },
        {
          "indexed": false,
          "internalType": "int32",
          "name": "lonE6",
          "type": "int32"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "priority",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "reporter",
          "type": "address"
        }
      ],
      "name": "ReportCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "int32",
          "name": "latE6",
          "type": "int32"
        },
        {
          "internalType": "int32",
          "name": "lonE6",
          "type": "int32"
        },
        {
          "internalType": "uint8",
          "name": "priority",
          "type": "uint8"
        }
      ],
      "name": "createReport",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getReports",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int32",
              "name": "latE6",
              "type": "int32"
            },
            {
              "internalType": "int32",
              "name": "lonE6",
              "type": "int32"
            },
            {
              "internalType": "uint8",
              "name": "priority",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "reporter",
              "type": "address"
            }
          ],
          "internalType": "struct InfraStorage.Report[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getReportsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reports",
      "outputs": [
        {
          "internalType": "int32",
          "name": "latE6",
          "type": "int32"
        },
        {
          "internalType": "int32",
          "name": "lonE6",
          "type": "int32"
        },
        {
          "internalType": "uint8",
          "name": "priority",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "reporter",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]"""


ABI = json.loads(ABI_JSON)

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=ABI,
)


def create_report_on_chain(lat: float, lon: float, priority: int) -> Dict[str, Any]:
    latE6 = int(lat * 1_000_000)
    lonE6 = int(lon * 1_000_000)

    print(f"[solidity_interface] create_report_on_chain lat={lat}, lon={lon}, priority={priority}")
    print(f"[solidity_interface] scaled latE6={latE6}, lonE6={lonE6}")

    nonce = w3.eth.get_transaction_count(account.address)
    print("[solidity_interface] nonce:", nonce)

    tx = contract.functions.createReport(
        latE6, lonE6, int(priority)
    ).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 200000,
        "gasPrice": w3.to_wei("1", "gwei"),
    })

    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print("[solidity_interface] tx_hash:", tx_hash.hex())
    print("[solidity_interface] blockNumber:", receipt.blockNumber)

    return {
        "tx_hash": tx_hash.hex(),
        "blockNumber": receipt.blockNumber,
    }


def get_reports_from_chain() -> List[Dict[str, Any]]:
    print("[solidity_interface] get_reports_from_chain called")
    data = contract.functions.getReports().call()

    results: List[Dict[str, Any]] = []
    for latE6, lonE6, priority, createdAt, reporter in data:
        results.append(
            {
                "lat": latE6 / 1_000_000,
                "lon": lonE6 / 1_000_000,
                "priority": int(priority),
                "createdAt": int(createdAt),
                "reporter": reporter,
            }
        )
    print(f"[solidity_interface] Returning {len(results)} reports")
    return results
