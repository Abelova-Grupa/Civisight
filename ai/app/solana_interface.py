# solana_interface.py

import os
import asyncio
import json
from pathlib import Path

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient

from anchorpy import Program, Provider, Wallet, Context, Idl
from dotenv import load_dotenv


# Učitaj .env konfiguraciju
load_dotenv("../solana.env")

NETWORK = os.getenv("NETWORK")
PROGRAM_ID_STR = os.getenv("PROGRAM_ID")

if NETWORK is None or PROGRAM_ID_STR is None:
    raise RuntimeError("NETWORK ili PROGRAM_ID nisu definisani u .env fajlu.")

# Program ID kao solders.Pubkey
PROGRAM_ID = Pubkey.from_string(PROGRAM_ID_STR)

# Putanja do IDL fajla
IDL_PATH = Path("../../solana/target/idl/infrastructure_reports.json")

# System program & rent sysvar kao Pubkey instance
SYS_PROGRAM_ID = Pubkey.from_string("11111111111111111111111111111111")
RENT_SYSVAR_ID = Pubkey.from_string("SysvarRent111111111111111111111111111111111")


def _normalize_idl(raw_idl: dict) -> dict:
    """
    Anchor 0.30+ generiše IDL u novom formatu (sa address, metadata.name, metadata.version,
    discriminator, writable/signers, itd.). AnchorPy još uvek očekuje stari format:
      - root: {version, name, instructions, accounts, types, errors, metadata?}
      - instructions[*].accounts: {name, isMut, isSigner}
      - accounts[*]: {name, type:{kind, fields}}
    Ova funkcija mapira novi format u kompatibilan format za AnchorPy.
    """

    # Ako IDL već ima version/name na root nivou, pretpostavimo da je kompatibilan
    if "version" in raw_idl and "name" in raw_idl:
        return raw_idl

    metadata = raw_idl.get("metadata", {})
    types_list = raw_idl.get("types", [])
    type_map = {t["name"]: t["type"] for t in types_list}

    # Mapiranje accounts -> {name, type}
    account_names = {a["name"] for a in raw_idl.get("accounts", [])}
    accounts = []
    for acc in raw_idl.get("accounts", []):
        name = acc["name"]
        acc_type = type_map.get(name)
        if acc_type is None:
            raise ValueError(f"Nije pronađen type za account '{name}' u IDL-u.")
        accounts.append({"name": name, "type": acc_type})

    # Izbaci account tipove iz types (AnchorPy očekuje da su account tipovi pod "accounts")
    remaining_types = [t for t in types_list if t["name"] not in account_names]

    # Mapiranje instructions: ukloni discriminator, mapiraj writable/signer -> isMut/isSigner
    instructions = []
    for ix in raw_idl.get("instructions", []):
        ix_copy = {
            k: v
            for k, v in ix.items()
            if k not in ("discriminator", "accounts")
        }
        new_accounts = []
        for acc in ix.get("accounts", []):
            new_accounts.append(
                {
                    "name": acc["name"],
                    "isMut": acc.get("writable", False),
                    "isSigner": acc.get("signer", False),
                }
            )
        ix_copy["accounts"] = new_accounts
        instructions.append(ix_copy)

    normalized = {
        "version": metadata.get("version", "0.1.0"),
        "name": metadata.get("name", "infrastructure_reports"),
        "instructions": instructions,
        "accounts": accounts,
        "types": remaining_types,
        "errors": raw_idl.get("errors", []),
        "metadata": {
            "address": raw_idl.get("address"),
            "spec": metadata.get("spec"),
            "description": metadata.get("description"),
        },
    }
    return normalized


class SolanaInterface:
    def __init__(self, keypair_path: str = "../id.json") -> None:
        """
        U "normalnom" režimu koristi keypair iz fajla.
        Ako fajl ne postoji (npr. tokom testiranja), generiše se
        privremeni random keypair umesto da baca FileNotFoundError.
        """
        keypair_path = Path(keypair_path)

        if keypair_path.exists():
            self.keypair = Keypair.from_json(keypair_path.read_text())
        else:
            # Ovo je vrlo korisno za test okruženje:
            # nemaš keypair fajl, ali ne želiš da import pukne.
            print(
                f"Upozorenje: nije pronađen keypair fajl {keypair_path}, "
                f"generišem privremeni keypair (verovatno test okruženje)."
            )
            self.keypair = Keypair()  # random keypair

        print("Backend wallet public key:", self.keypair.pubkey())
        self.wallet = Wallet(self.keypair)


    async def _load_program(self):
        """
        Kreira AsyncClient, Provider i Program instancu iz IDL-a.
        Pravi i konverziju novog Anchor IDL formata (pubkey, writable, signer, ...)
        u format koji AnchorPy očekuje.
        """
        client = AsyncClient(NETWORK)
        provider = Provider(client, self.wallet)

        if not IDL_PATH.exists():
            raise FileNotFoundError(f"Nije pronađen IDL fajl: {IDL_PATH}")

        # 1) Učitamo IDL sa diska kao dict
        raw_idl = json.loads(IDL_PATH.read_text())

        # 2) Normalizujemo novi Anchor 0.30+ format u stari
        idl_json = _normalize_idl(raw_idl)

        # 3) Pretvorimo u JSON string i zamenimo "pubkey" -> "publicKey"
        #    jer AnchorPy stari format koristi "publicKey" kao naziv tipa.
        idl_str = json.dumps(idl_json).replace('"pubkey"', '"publicKey"')

        # 4) AnchorPy Idl loader
        idl = Idl.from_json(idl_str)

        # 5) Program instance
        program = Program(idl, PROGRAM_ID, provider)

        return program, provider


    async def create_report(self, report_seed: str) -> str:
        """
        Poziv Anchor instrukcije `create_report(report_seed: String)`.

        PDA u Rust-u:
            let (pda, bump) = Pubkey::find_program_address(
                &[b"report", report_seed.as_bytes()],
                program_id,
            );
        """
        program, provider = await self._load_program()

        # Derivacija PDA preko solders.Pubkey
        report_pda, bump = Pubkey.find_program_address(
            [b"report", report_seed.encode()],
            program.program_id,
        )

        tx_sig = await program.rpc["create_report"](
            report_seed,
            ctx=Context(
                accounts={
                    "report_account": report_pda,
                    "user": provider.wallet.public_key,
                    "system_program": SYS_PROGRAM_ID,
                    "rent": RENT_SYSVAR_ID,
                }
            ),
        )
        return str(tx_sig)

    async def vote(self, report_id: str, vote_type: int) -> str:
        """
        Poziv Anchor instrukcije `vote(vote_type: u8)`.

        U IDL-u VoteRecord PDA:
            seeds = [b"vote", user, report_account]

        Ovde se kao `user` koristi backend wallet (provider.wallet.public_key).
        """
        program, provider = await self._load_program()

        # Derive report PDA
        report_pda, _ = Pubkey.find_program_address(
            [b"report", report_id.encode()],
            program.program_id,
        )

        # Derive VoteRecord PDA
        vote_pda, _ = Pubkey.find_program_address(
            [b"vote", bytes(provider.wallet.public_key), bytes(report_pda)],
            program.program_id,
        )

        tx_sig = await program.rpc["vote"](
            vote_type,
            ctx=Context(
                accounts={
                    "report_account": report_pda,
                    "vote_record": vote_pda,
                    "user": provider.wallet.public_key,
                    "system_program": SYS_PROGRAM_ID,
                    "rent": RENT_SYSVAR_ID,
                }
            ),
        )

        return str(tx_sig)

    async def get_report(self, report_id: str) -> dict:
        """
        Čita Report account sa PDA derivacijom:
            seeds = [b"report", report_id.as_bytes()]
        """
        program, _ = await self._load_program()

        report_pda, _ = Pubkey.find_program_address(
            [b"report", report_id.encode()],
            program.program_id,
        )

        data = await program.account["Report"].fetch(report_pda)
        # Polja: creator: Pubkey, upvotes: u64, downvotes: u64, bump: u8
        return {
            "creator": str(data.creator),
            "upvotes": int(data.upvotes),
            "downvotes": int(data.downvotes),
        }


# Synchronous wrapperi koje koristi FastAPI

solana = SolanaInterface()


def create_report_sync(report_seed: str) -> str:
    return asyncio.run(solana.create_report(report_seed))


def vote_sync(report_id: str, vote_type: int) -> str:
    return asyncio.run(solana.vote(report_id, vote_type))


def get_report_sync(report_id: str) -> dict:
    return asyncio.run(solana.get_report(report_id))
