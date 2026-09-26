from db import get_connection


def create_player(username):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO players (username)
        VALUES (?)
    """, (username,))

    connection.commit()

    player_id = cursor.lastrowid

    connection.close()

    return player_id


def create_game_session(case_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO game_sessions (case_id)
        VALUES (?)
    """, (case_id,))

    connection.commit()

    session_id = cursor.lastrowid

    connection.close()

    return session_id


def add_player_to_session(session_id, player_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO session_players
        (session_id, player_id)
        VALUES (?, ?)
    """, (session_id, player_id))

    connection.commit()
    connection.close()

def get_game_session(session_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT session_id, case_id, started_at, ended_at, current_stage, status
        FROM game_sessions
        WHERE session_id = ?
    """, (session_id,))

    session = cursor.fetchone()
    connection.close()

    return session


if __name__ == "__main__":

    player_id = create_player("TestPlayer")

    session_id = create_game_session("014")

    add_player_to_session(session_id, player_id)

    print("Player created:", player_id)
    print("Game session created:", session_id)
    print("Player added to session")