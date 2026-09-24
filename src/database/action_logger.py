from src.database.db import get_connection

def log_player_action(
    session_id,
    player_id,
    action_type,
    target_id=None,
    stage=None,
    time_taken=None,
    result=None
):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO player_actions
        (
            session_id,
            player_id,
            action_type,
            target_id,
            stage,
            time_taken,
            result
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        session_id,
        player_id,
        action_type,
        target_id,
        stage,
        time_taken,
        result
    ))

    connection.commit()
    connection.close()


if __name__ == "__main__":

    log_player_action(
        session_id=1,
        player_id=1,
        action_type="inspect_evidence",
        target_id="E01",
        stage=1,
        time_taken=12.5,
        result="success"
    )

    print("Player action logged successfully!")