import json
import sys
import os

sys.path.append(r'c:\Users\Dhwani Shetty\OneDrive\Attachments\Convestigate\src')

from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def load_schemas():
    path = r'c:\Users\Dhwani Shetty\OneDrive\Attachments\Convestigate\frontend\js\utils\puzzle_schemas.js'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read().replace('export const CASE_SCHEMAS = ', '').strip().rstrip(';')
        return json.loads(text)

def generate_payload(schema_info, case_timeline):
    schema = schema_info.get("schema", {})
    stype = schema.get("type")
    
    def build_fields(schema_obj):
        payload = {}
        for k, v in schema_obj.get("fields", {}).items():
            if v["type"] == "dict":
                payload[k] = build_fields(v)
            elif v["type"] == "list":
                # values could be list or empty
                payload[k] = v.get("value", [])
            else:
                payload[k] = v.get("value")
        return payload

    if stype == "compound" or stype == "dict":
        return build_fields(schema)
    elif stype == "list":
        return {schema.get("key", "hypotheses"): schema.get("values", [])}
    elif stype == "generic":
        comp = schema.get("component")
        if comp == "p01Timeline":
            return {"order": [t["time"] for t in case_timeline]}
        elif comp == "p02Employment":
            if schema_info.get("type") == "behavior_comparison":
                return {
                    "directly_observed": ["Bryce was upright, ambulatory, and verbally responsive", "Bryce declined further roadside assistance"],
                    "narrative_added_afterward": ["That Bryce was 'clearly suicidal'", "That the encounter proves intent to disappear"]
                }
            return {"employment_verified": True, "transfer_verified": True}
        elif comp == "p03Connection":
            if schema_info.get("type") == "forensic_analysis":
                return {"establishes": "crash_mechanics", "does_not_establish": "what_happened_to_bryce_afterward"}
            return {"connections": [{"from": c["from"], "to": c["to"], "status": c["status"]} for c in schema_info.get("original_data", {}).get("connections", [])]}
        elif comp == "p04Witness":
            if schema_info.get("type") == "field_evidence_analysis":
                return {"significance": "scent_trail_ends_near_roadway", "limitation": "does_not_prove_what_happened_to_bryce"}
            return {"unreliable_witness": "W02"}
        elif comp == "p05Missing":
            if schema_info.get("type") == "hypothesis_management":
                return {"hypotheses": ["voluntary_disappearance", "undiscovered_self_harm", "third_party_intervention"]}
            # MissingRecord requires missing_record, location, etc.
            original = schema_info.get("original_data", {}).get("missing_record", {})
            return {
                "missing_record": "Case Assignment Log", # hardcoded for 014 for now if not found
                "location": "weekly assignment ledger",
                "credential_use": True,
                "avoids_direct_accusation": True
            }
    return {}

def test_all_puzzles():
    schemas = load_schemas()
    
    total_passed = 0
    total_failed = 0
    
    for case_idx in range(1, 16):
        case_id_str = f"{case_idx:03d}"
        print(f"\n==================== CASE {case_id_str} ====================")
        
        resp = client.post("/sessions", json={
            "case_id": case_id_str,
            "player_count": 1,
            "username": "tester"
        })
        
        if resp.status_code != 200:
            print(f"FAILED to create session: {resp.text}")
            total_failed += 5
            continue
            
        session_id = resp.json()["session_id"]
        case_resp = client.get(f"/cases/{case_id_str}")
        case_timeline = case_resp.json().get("timeline", [])
        
        case_schemas = schemas.get(case_id_str, {})
        for p in case_resp.json().get("puzzles", []):
            if p.get("id") in case_schemas:
                case_schemas[p["id"]]["original_data"] = p
        
        for p_idx in range(1, 6):
            p_id = f"P0{p_idx}"
            schema_info = case_schemas.get(p_id)
            if not schema_info:
                print(f"{p_id} - FAILED: No schema found in puzzle_schemas.js")
                total_failed += 1
                continue
                
            endpoint = schema_info.get("endpoint")
            payload = generate_payload(schema_info, case_timeline)
            
            if isinstance(payload, dict):
                payload["case_id"] = case_id_str
                
            submit_url = f"/sessions/{session_id}/puzzles/{endpoint}"
            resp = client.post(submit_url, json=payload)
                
            if resp.status_code == 200:
                result = resp.json()
                if result.get("correct"):
                    print(f"{p_id} - PASS ({endpoint})")
                    total_passed += 1
                else:
                    print(f"{p_id} - FAILED ({endpoint}): Backend evaluated as incorrect! Payload: {payload}")
                    total_failed += 1
            else:
                print(f"{p_id} - FAILED ({endpoint}): HTTP {resp.status_code} - {resp.text}")
                total_failed += 1
                
    print("\n==================================================")
    print(f"Total Passed: {total_passed}/75")
    print(f"Total Failed: {total_failed}/75")
    print("==================================================")

if __name__ == "__main__":
    test_all_puzzles()
