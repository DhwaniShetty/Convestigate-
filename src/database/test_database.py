from db import get_connection
from player_session import create_player, create_game_session, add_player_to_session
from action_logger import log_player_action
from puzzle_logger import log_puzzle_attempt
from behaviour import calculate_player_behaviour


print("\n=== CONVESTIGATE DATABASE TEST ===")

# 1. Create test player
player_id = create_player("TestPlayer2")
print("Player created:", player_id)

# 2. Create session for Case 014
session_id = create_game_session("014")
print("Session created:", session_id)

# 3. Add player to session
add_player_to_session(session_id, player_id)
print("Player added to session")

# 4. Log player action
log_player_action(
    session_id=session_id,
    player_id=player_id,
    action_type="inspect_evidence",
    target_id="E01",
    stage=1,
    time_taken=10.5,
    result="success"
)
print("Player action logged")

# 5. Log puzzle attempt
log_puzzle_attempt(
    session_id=session_id,
    player_id=player_id,
    puzzle_id="P01",
    attempt_number=1,
    result="success",
    time_taken=40.0
)
print("Puzzle attempt logged")

# 6. Calculate behaviour
calculate_player_behaviour(
    session_id=session_id,
    player_id=player_id
)

# 7. Display final stored behaviour
connection = get_connection()
cursor = connection.cursor()

cursor.execute("""
    SELECT
        player_id,
        session_id,
        accuracy,
        average_time,
        hints_used,
        puzzles_attempted,
        puzzles_solved
    FROM player_behaviour
    WHERE player_id = ?
    AND session_id = ?
""", (player_id, session_id))

behaviour = cursor.fetchone()

print("\nFinal Behaviour Record:")
print(behaviour)

connection.close()

print("\n=== TEST COMPLETED ===")