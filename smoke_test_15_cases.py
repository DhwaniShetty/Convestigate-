from fastapi.testclient import TestClient
from src.api.main import app
from src.case.case_loader import load_case
import uuid

client = TestClient(app)

CASE_IDS = [f"{i:03d}" for i in range(1, 16)]

print("=" * 80)
print("CONVESTIGATE - 15 CASE RUNTIME SMOKE TEST")
print("=" * 80)

passed = []
failed = []

for case_id in CASE_IDS:
    print()
    print(f"CASE {case_id}")
    print("-" * 60)

    try:
        # ---------------------------------------------------------
        # 1. Load case JSON
        # ---------------------------------------------------------
        case_file = f"data/case_{case_id}.json"
        case = load_case(case_file)

        print(f"Title: {case.title}")
        print(f"Puzzles: {len(case.puzzles)}")

        if len(case.puzzles) != 5:
            raise RuntimeError(
                f"Expected 5 puzzles, found {len(case.puzzles)}"
            )

        print("Case JSON loads correctly")

        # ---------------------------------------------------------
        # 2. Test case endpoint
        # ---------------------------------------------------------
        response = client.get(f"/cases/{case_id}")

        if response.status_code != 200:
            raise RuntimeError(
                f"GET /cases/{case_id} failed: "
                f"{response.status_code} - {response.text}"
            )

        print(f"GET /cases/{case_id}: 200")
        print("Case endpoint works")

        # ---------------------------------------------------------
        # 3. Create a UNIQUE username
        # ---------------------------------------------------------
        username = f"smoke_{case_id}_{uuid.uuid4().hex[:8]}"

        response = client.post(
            "/sessions",
            json={
                "username": username,
                "case_id": case_id
            }
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"POST /sessions failed: "
                f"{response.status_code} - {response.text}"
            )

        session_data = response.json()

        session_id = (
            session_data.get("session_id")
            or session_data.get("id")
        )

        if not session_id:
            raise RuntimeError(
                f"No session ID returned: {session_data}"
            )

        print("POST /sessions: 200")
        print("Session created")
        print(f"Session ID: {session_id}")

        # ---------------------------------------------------------
        # 4. Retrieve session
        # ---------------------------------------------------------
        response = client.get(
            f"/sessions/{session_id}"
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"GET /sessions/{session_id} failed: "
                f"{response.status_code} - {response.text}"
            )

        print("GET /sessions/{id}: 200")
        print("Session retrieval works")

        # ---------------------------------------------------------
        # CASE PASSED
        # ---------------------------------------------------------
        passed.append(case_id)

    except Exception as e:
        failed.append(case_id)

        print(f"CASE {case_id} FAILED")
        print(f"ERROR: {type(e).__name__}: {e}")

print()
print("=" * 80)
print("FINAL RESULT")
print("=" * 80)

print(f"Passed: {len(passed)}/15")
print(f"Failed: {len(failed)}/15")

if passed:
    print()
    print("PASSED:")
    for case_id in passed:
        print(f"CASE {case_id}")

if failed:
    print()
    print("FAILED:")
    for case_id in failed:
        print(f"CASE {case_id}")

print("=" * 80)

if len(failed) == 0:
    print("ALL 15 CASES PASSED BASIC RUNTIME SMOKE TEST")
else:
    print("SOME CASES FAILED - DO NOT FINALIZE YET")

print("=" * 80)