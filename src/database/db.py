import sqlite3

DATABASE_NAME = "convestigate.db"


def get_connection():
    return sqlite3.connect(DATABASE_NAME)


def add_column_if_missing(cursor, table, column, definition):
    try:
        cursor.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} {definition}"
        )
    except sqlite3.OperationalError:
        pass


def create_database():
    connection = get_connection()
    cursor = connection.cursor()

    # =========================
    # CASES
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            case_id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            difficulty TEXT
        )
    """)

    # Add fields required by the case JSON
    add_column_if_missing(cursor, "cases", "genre", "TEXT")
    add_column_if_missing(cursor, "cases", "status", "TEXT")
    add_column_if_missing(cursor, "cases", "victim_name", "TEXT")
    add_column_if_missing(cursor, "cases", "victim_age", "TEXT")
    add_column_if_missing(cursor, "cases", "victim_occupation", "TEXT")


    # =========================
    # SUSPECTS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS suspects (
            suspect_id TEXT PRIMARY KEY,
            case_id TEXT NOT NULL,
            name TEXT NOT NULL,
            age TEXT,
            occupation TEXT,
            relationship_to_victim TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
    """)


    # =========================
    # TIMELINE EVENTS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS timeline_events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT NOT NULL,
            event_order INTEGER NOT NULL,
            event_time TEXT,
            event_description TEXT NOT NULL,
            FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
    """)


    # =========================
    # EVIDENCE
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS evidence (
            evidence_id TEXT PRIMARY KEY,
            case_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT,
            description TEXT,
            reliability TEXT,
            status TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
    """)


    # =========================
    # PUZZLES
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS puzzles (
            puzzle_id TEXT PRIMARY KEY,
            case_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT,
            description TEXT,
            FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
    """)


    # =========================
    # PUZZLE UNLOCKS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS puzzle_unlocks (
            puzzle_id TEXT NOT NULL,
            evidence_id TEXT NOT NULL,
            PRIMARY KEY (puzzle_id, evidence_id),
            FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id),
            FOREIGN KEY (evidence_id) REFERENCES evidence(evidence_id)
        )
    """)


    # =========================
    # PLAYERS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS players (
            player_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


    # =========================
    # GAME SESSIONS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_sessions (
            session_id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT NOT NULL,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP,
            current_stage INTEGER DEFAULT 1,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (case_id) REFERENCES cases(case_id)
        )
    """)


    # =========================
    # SESSION PLAYERS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS session_players (
            session_id INTEGER,
            player_id INTEGER,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (session_id, player_id),
            FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
            FOREIGN KEY (player_id) REFERENCES players(player_id)
        )
    """)


    # =========================
    # PLAYER ACTIONS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS player_actions (
            action_id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            player_id INTEGER NOT NULL,
            action_type TEXT NOT NULL,
            target_id TEXT,
            stage INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            time_taken REAL,
            result TEXT,
            FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
            FOREIGN KEY (player_id) REFERENCES players(player_id)
        )
    """)


    # =========================
    # PUZZLE LOGS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS puzzle_logs (
            puzzle_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            player_id INTEGER NOT NULL,
            puzzle_id TEXT NOT NULL,
            attempt_number INTEGER,
            result TEXT,
            time_taken REAL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
            FOREIGN KEY (player_id) REFERENCES players(player_id)
        )
    """)


    # =========================
    # PLAYER BEHAVIOUR
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS player_behaviour (
            behaviour_id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            player_id INTEGER NOT NULL,
            accuracy REAL DEFAULT 0,
            average_time REAL DEFAULT 0,
            hints_used INTEGER DEFAULT 0,
            puzzles_attempted INTEGER DEFAULT 0,
            puzzles_solved INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
            FOREIGN KEY (player_id) REFERENCES players(player_id)
        )
    """)


    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_database()
    print("Database created successfully!")