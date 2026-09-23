import json
from db import get_connection


def load_case_to_database(json_file):
    # Read JSON file
    with open(json_file, "r", encoding="utf-8") as file:
        case_data = json.load(file)

    connection = get_connection()
    cursor = connection.cursor()

    case_id = case_data["case_id"]

    # ---------------------------------
    # Remove old data for this case
    # ---------------------------------

    cursor.execute("""
        DELETE FROM puzzle_unlocks
        WHERE puzzle_id IN (
            SELECT puzzle_id FROM puzzles WHERE case_id = ?
        )
    """, (case_id,))

    cursor.execute("""
        DELETE FROM puzzles
        WHERE case_id = ?
    """, (case_id,))

    cursor.execute("""
        DELETE FROM evidence
        WHERE case_id = ?
    """, (case_id,))

    cursor.execute("""
        DELETE FROM timeline_events
        WHERE case_id = ?
    """, (case_id,))

    cursor.execute("""
        DELETE FROM suspects
        WHERE case_id = ?
    """, (case_id,))

    # ---------------------------------
    # Insert case
    # ---------------------------------

    victim = case_data.get("victim", {})

    cursor.execute("""
        INSERT OR REPLACE INTO cases
        (
            case_id,
            title,
            description,
            difficulty,
            genre,
            status,
            victim_name,
            victim_age,
            victim_occupation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_id,
        case_data.get("title", ""),
        case_data.get("description", ""),
        case_data.get("difficulty", ""),
        case_data.get("genre", ""),
        case_data.get("status", ""),
        victim.get("name", ""),
        str(victim.get("age", "")),
        victim.get("occupation", "")
    ))

    # ---------------------------------
    # Insert suspects
    # ---------------------------------

    for suspect in case_data.get("suspects", []):
        cursor.execute("""
            INSERT INTO suspects
            (
                suspect_id,
                case_id,
                name,
                age,
                occupation,
                relationship_to_victim
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            str(suspect["id"]),
            case_id,
            suspect.get("name", ""),
            str(suspect.get("age", "")),
            suspect.get("occupation", ""),
            suspect.get("relationship_to_victim", "")
        ))

    # ---------------------------------
    # Insert timeline
    # ---------------------------------

    for order, event in enumerate(case_data.get("timeline", []), start=1):
        cursor.execute("""
            INSERT INTO timeline_events
            (
                case_id,
                event_order,
                event_time,
                event_description
            )
            VALUES (?, ?, ?, ?)
        """, (
            case_id,
            order,
            event.get("time", ""),
            event.get("event", "")
        ))

    # ---------------------------------
    # Insert evidence
    # ---------------------------------

    for evidence in case_data.get("evidence", []):
        cursor.execute("""
            INSERT INTO evidence
            (
                evidence_id,
                case_id,
                name,
                type,
                description,
                reliability,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            evidence["id"],
            case_id,
            evidence.get("name", ""),
            evidence.get("type", ""),
            evidence.get("description", ""),
            evidence.get("reliability", ""),
            evidence.get("status", "")
        ))

    # ---------------------------------
    # Insert puzzles
    # ---------------------------------

    for puzzle in case_data.get("puzzles", []):
        puzzle_id = puzzle["id"]

        cursor.execute("""
            INSERT INTO puzzles
            (
                puzzle_id,
                case_id,
                name,
                type,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            puzzle_id,
            case_id,
            puzzle.get("name", ""),
            puzzle.get("type", ""),
            puzzle.get("description", "")
        ))

        # ---------------------------------
        # Insert puzzle unlocks
        # ---------------------------------

        for evidence_id in puzzle.get("unlocks", []):
            cursor.execute("""
                INSERT INTO puzzle_unlocks
                (
                    puzzle_id,
                    evidence_id
                )
                VALUES (?, ?)
            """, (
                puzzle_id,
                evidence_id
            ))

    connection.commit()
    connection.close()

    print("Case loaded successfully:", case_id)


if __name__ == "__main__":
    load_case_to_database("data/case_014.json")