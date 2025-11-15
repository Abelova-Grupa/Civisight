# app/test_solana.py

import asyncio
from solders.pubkey import Pubkey

import solana_interface as si


# --- FAKE KOMPONENTE ZA TESTIRANJE BEZ MREŽE I IDL-A ---

class FakeWallet:
    def __init__(self, pubkey: Pubkey):
        self.public_key = pubkey


class FakeProvider:
    def __init__(self, pubkey: Pubkey):
        self.wallet = FakeWallet(pubkey)


class FakeReportAccountClient:
    """
    Emulira: program.account["Report"].fetch(pda)
    """

    async def fetch(self, pda: Pubkey):
        class Data:
            pass

        d = Data()
        d.creator = Pubkey.from_string("11111111111111111111111111111111")
        d.upvotes = 5
        d.downvotes = 2
        d.bump = 255
        return d


class FakeAccountRoot:
    """
    Omogućava: program.account["Report"]
    """

    def __init__(self):
        self._map = {"Report": FakeReportAccountClient()}

    def __getitem__(self, key: str):
        return self._map[key]


class FakeProgram:
    """
    Minimalni fake Anchor Program:
    - beleži pozive na rpc["create_report"] i rpc["vote"]
    - ima .account["Report"].fetch(...)
    """

    def __init__(self, program_id: Pubkey):
        self.program_id = program_id
        self._rpc_calls = {"create_report": [], "vote": []}
        self._rpc = {
            "create_report": self._create_report,
            "vote": self._vote,
        }
        self.account = FakeAccountRoot()

    @property
    def rpc(self):
        return self._rpc

    async def _create_report(self, report_seed: str, ctx):
        self._rpc_calls["create_report"].append(
            {
                "report_seed": report_seed,
                "ctx": ctx,
            }
        )
        return "tx_sig_create"

    async def _vote(self, vote_type: int, ctx):
        self._rpc_calls["vote"].append(
            {
                "vote_type": vote_type,
                "ctx": ctx,
            }
        )
        return "tx_sig_vote"

    def get_calls(self, name: str):
        return self._rpc_calls[name]


async def main():
    # 1) Napravi fake program i provider (bez mreže, bez pravog IDL-a)
    fake_program = FakeProgram(si.PROGRAM_ID)

    # ⬇⬇⬇ KLJUČNA IZMJENA: koristimo već postojeći Pubkey umesto izmišljene "2222..."
    fake_provider = FakeProvider(si.PROGRAM_ID)

    # 2) Monkeypatch-uj _load_program tako da NE koristi AsyncClient/IDL,
    #    već da vrati naš fake_program i fake_provider.
    async def fake_load_program(self):
        return fake_program, fake_provider

    # Patchujemo metodu klase, sve instance će koristiti ovu verziju
    si.SolanaInterface._load_program = fake_load_program

    # 3) Napravi instancu SolanaInterface
    iface = si.SolanaInterface()

    print("\n--- TEST: create_report ---")
    report_seed = "test-report-seed-123"
    tx1 = await iface.create_report(report_seed)
    print("create_report tx:", tx1)

    create_calls = fake_program.get_calls("create_report")
    print("zabeleženi RPC pozivi za create_report:", create_calls)

    assert tx1 == "tx_sig_create", "Neočekivan tx odgovor iz create_report"
    assert len(create_calls) == 1, "Treba da postoji tačno 1 poziv create_report"
    assert create_calls[0]["report_seed"] == report_seed

    print("✅ create_report test prošao")

    print("\n--- TEST: vote ---")
    vote_type = 1
    tx2 = await iface.vote("456", vote_type)
    print("vote tx:", tx2)

    vote_calls = fake_program.get_calls("vote")
    print("zabeleženi RPC pozivi za vote:", vote_calls)

    assert tx2 == "tx_sig_vote", "Neočekivan tx odgovor iz vote"
    assert len(vote_calls) == 1, "Treba da postoji tačno 1 poziv vote"
    assert vote_calls[0]["vote_type"] == vote_type

    print("✅ vote test prošao")

    print("\n--- TEST: get_report ---")
    rep = await iface.get_report(report_seed)
    print("get_report rezultat:", rep)

    assert isinstance(rep, dict), "get_report treba da vrati dict"
    assert rep["creator"] == "11111111111111111111111111111111"
    assert rep["upvotes"] == 5
    assert rep["downvotes"] == 2

    print("✅ get_report test prošao")

    print("\n✅ SVI MANUALNI TESTOVI SU PROŠLI.")


if __name__ == "__main__":
    asyncio.run(main())
