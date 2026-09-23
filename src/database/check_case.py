from db import get_connection


connection = get_connection()
cursor = connection.cursor()

print("\nCASES:")
for row in cursor.execute(
    "SELECT case_id, title, difficulty FROM cases"
):
    print(row)

print("\nSUSPECTS:")
for row in cursor.execute(
    "SELECT suspect_id, name, case_id FROM suspects"
):
    print(row)

print("\nTIMELINE:")
for row in cursor.execute(
    "SELECT event_order, event_time, event_description FROM timeline_events"
):
    print(row)

print("\nEVIDENCE:")
for row in cursor.execute(
    "SELECT evidence_id, name, case_id FROM evidence"
):
    print(row)

print("\nPUZZLES:")
for row in cursor.execute(
    "SELECT puzzle_id, name, case_id FROM puzzles"
):
    print(row)

print("\nPUZZLE UNLOCKS:")
for row in cursor.execute(
    "SELECT puzzle_id, evidence_id FROM puzzle_unlocks"
):
    print(row)

connection.close()