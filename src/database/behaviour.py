from src.database.db import get_connection


def calculate_player_behaviour(session_id, player_id):
    connection = get_connection()
    cursor = connection.cursor()

    # -----------------------------
    # Puzzle statistics
    # -----------------------------

    cursor.execute("""
        SELECT
            COUNT(*),
            SUM(CASE WHEN result = 'success' THEN 1 ELSE 0 END),
            AVG(time_taken)
        FROM puzzle_logs
        WHERE session_id = ?
        AND player_id = ?
    """, (session_id, player_id))

    puzzle_stats = cursor.fetchone()

    puzzles_attempted = puzzle_stats[0] or 0
    puzzles_solved = puzzle_stats[1] or 0
    average_time = puzzle_stats[2] or 0

    # -----------------------------
    # Calculate accuracy
    # -----------------------------

    if puzzles_attempted > 0:
        accuracy = (puzzles_solved / puzzles_attempted) * 100
    else:
        accuracy = 0

    # -----------------------------
    # Count hints
    # -----------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM player_actions
        WHERE session_id = ?
        AND player_id = ?
        AND action_type = 'hint'
    """, (session_id, player_id))

    hints_used = cursor.fetchone()[0]

    # -----------------------------
    # Store behaviour
    # -----------------------------

    cursor.execute("""
        SELECT behaviour_id
        FROM player_behaviour
        WHERE session_id = ?
        AND player_id = ?
    """, (session_id, player_id))

    existing = cursor.fetchone()

    if existing:

        cursor.execute("""
            UPDATE player_behaviour
            SET
                accuracy = ?,
                average_time = ?,
                hints_used = ?,
                puzzles_attempted = ?,
                puzzles_solved = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE behaviour_id = ?
        """, (
            accuracy,
            average_time,
            hints_used,
            puzzles_attempted,
            puzzles_solved,
            existing[0]
        ))

    else:

        cursor.execute("""
            INSERT INTO player_behaviour
            (
                session_id,
                player_id,
                accuracy,
                average_time,
                hints_used,
                puzzles_attempted,
                puzzles_solved
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            player_id,
            accuracy,
            average_time,
            hints_used,
            puzzles_attempted,
            puzzles_solved
        ))

    connection.commit()

    print("Player behaviour calculated successfully!")
    print("Accuracy:", round(accuracy, 2), "%")
    print("Average puzzle time:", round(average_time, 2), "seconds")
    print("Hints used:", hints_used)
    print("Puzzles attempted:", puzzles_attempted)
    print("Puzzles solved:", puzzles_solved)

    connection.close()


if __name__ == "__main__":
    calculate_player_behaviour(
        session_id=1,
        player_id=1
    )