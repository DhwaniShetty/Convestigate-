from db import get_connection


def log_puzzle_attempt(
    session_id,
    player_id,
    puzzle_id,
    attempt_number,
    result,
    time_taken
):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO puzzle_logs
        (
            session_id,
            player_id,
            puzzle_id,
            attempt_number,
            result,
            time_taken
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        session_id,
        player_id,
        puzzle_id,
        attempt_number,
        result,
        time_taken
    ))

    connection.commit()
    connection.close()


if __name__ == "__main__":

    log_puzzle_attempt(
        session_id=1,
        player_id=1,
        puzzle_id="P01",
        attempt_number=1,
        result="success",
        time_taken=45.5
    )

    print("Puzzle attempt logged successfully!")

def get_puzzle_attempt_count(session_id, player_id, puzzle_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM puzzle_logs
        WHERE session_id = ?
        AND player_id = ?
        AND puzzle_id = ?
    """, (session_id, player_id, puzzle_id))

    count = cursor.fetchone()[0]
    connection.close()

    return count