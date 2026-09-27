from src.ai.adaptive_ai import AdaptiveAI


class GameState:

    def __init__(self):
        self.ai_trust = 0
        self.ai_threat = 0
        self.ai_thrill = 0
        self.ai_vanished = False
        self.countdown_active = False


def print_state(ai, game_state, label):

    print(f"\n--- {label} ---")

    print("AI Trust:", game_state.ai_trust)
    print("AI Threat:", game_state.ai_threat)
    print("AI Thrill:", game_state.ai_thrill)

    print(
        "AI State:",
        ai.get_state(game_state)
    )

    print(
        "AI Action:",
        ai.choose_action(game_state)
    )


def main():

    print("=== Convestigate Adaptive AI Test ===")

    ai = AdaptiveAI()
    game_state = GameState()

    # ---------------------------------------------------------
    # STATE 1: CALM
    # ---------------------------------------------------------

    print_state(
        ai,
        game_state,
        "STATE 1: CALM"
    )

    # ---------------------------------------------------------
    # STATE 2: STRUGGLING PLAYER
    # ---------------------------------------------------------

    action = ai.decide(
        "STRUGGLING",
        game_state
    )

    print(
        "\nPlayer behavior: STRUGGLING"
    )

    print(
        "AI Decision:",
        action
    )

    print_state(
        ai,
        game_state,
        "STATE 2: AFTER STRUGGLING"
    )

    # ---------------------------------------------------------
    # STATE 3: HINT DEPENDENT
    # ---------------------------------------------------------

    action = ai.decide(
        "HINT_DEPENDENT",
        game_state
    )

    print(
        "\nPlayer behavior: HINT_DEPENDENT"
    )

    print(
        "AI Decision:",
        action
    )

    print_state(
        ai,
        game_state,
        "STATE 3: AFTER HINT DEPENDENT"
    )

    # ---------------------------------------------------------
    # STATE 4: FAST AND ACCURATE
    # ---------------------------------------------------------

    action = ai.decide(
        "FAST_AND_ACCURATE",
        game_state
    )

    print(
        "\nPlayer behavior: FAST_AND_ACCURATE"
    )

    print(
        "AI Decision:",
        action
    )

    print_state(
        ai,
        game_state,
        "STATE 4: AFTER FAST AND ACCURATE"
    )

    # ---------------------------------------------------------
    # PUZZLE REACTION
    # ---------------------------------------------------------

    puzzle_state = ai.react_to_puzzle(
        "P03",
        game_state
    )

    print(
        "\nPuzzle P03 reaction:",
        puzzle_state
    )

    print_state(
        ai,
        game_state,
        "STATE 5: AFTER PUZZLE P03"
    )

    # ---------------------------------------------------------
    # FINAL REASONING
    # ---------------------------------------------------------

    final_state = ai.react_to_final_reasoning(
        "SUPPORTED",
        game_state
    )

    print(
        "\nFinal reasoning result: SUPPORTED"
    )

    print(
        "AI State:",
        final_state
    )

    # ---------------------------------------------------------
    # VANISH TEST
    # ---------------------------------------------------------

    game_state.ai_threat = 5

    vanish_result = ai.trigger_vanish(
        game_state
    )

    print(
        "\nVanish result:",
        vanish_result
    )

    print(
        "AI Vanished:",
        game_state.ai_vanished
    )

    print(
        "Countdown Active:",
        game_state.countdown_active
    )

    # ---------------------------------------------------------
    # GEMINI TEST
    # ---------------------------------------------------------

    print(
        "\n=== GEMINI RESPONSE TEST ==="
    )

    game_state.ai_threat = 0
    game_state.ai_thrill = 0
    game_state.ai_trust = 0

    response = ai.generate_ai_response(
        game_state,
        "I found an important clue near the victim."
    )

    print(
        "\nAI Response:"
    )

    print(response)


if __name__ == "__main__":
    main()