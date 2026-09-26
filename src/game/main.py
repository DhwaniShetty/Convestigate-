from src.game.evidence_system import EvidenceSystem
from src.case.case_loader import case
from src.game.timeline_puzzle import TimelinePuzzle
from src.game.game_state import GameState
from src.player.player_model import PlayerModel
from src.ai.adaptive_ai import AdaptiveAI
from src.game.pattern_puzzle import PatternPuzzle
from src.game.connection_graph import ConnectionGraphPuzzle
from src.game.witness_puzzle import WitnessPuzzle
from src.game.missing_record_puzzle import MissingRecordPuzzle
from src.game.final_reasoning import FinalReasoningEvaluator


# -------------------------
# GAME SETUP
# -------------------------

puzzle = TimelinePuzzle(
    case.timeline,
    case.evidence,
    case.puzzles[0]
)

game_state = GameState(case.case_id)

player = PlayerModel()
evidence_system = EvidenceSystem(case.evidence)
adaptive_ai = AdaptiveAI()


# -------------------------
# P01 - TIMELINE
# -------------------------

solved, solve_time, mistakes = puzzle.play()

if solved:

    player.record_solve_time(solve_time)

    for _ in range(mistakes):
        player.record_mistake()

    game_state.current_puzzle = "P01"
    game_state.solved_puzzles.append("P01")

    ai_reaction = adaptive_ai.react_to_puzzle(
        "P01",
        game_state
    )

    print("AI reaction:", ai_reaction)

    unlocked = puzzle.get_unlocked_evidence()

    evidence_system.unlock_evidence(unlocked)

    for evidence_id in unlocked:
        if evidence_id not in game_state.unlocked_evidence:
            game_state.unlocked_evidence.append(evidence_id)

    print("\nEvidence unlocked!")

    evidence_system.show_evidence()

    inspected = evidence_system.inspect_evidence()

    if inspected:
        game_state.inspected_evidence.append(inspected)
        player.record_evidence_inspection()


    # -------------------------
    # PLAYER MODEL
    # -------------------------

    print("\n--- GAME STATE ---")
    print("Case:", game_state.case_id)
    print("Solved puzzles:", game_state.solved_puzzles)
    print("Unlocked evidence:", game_state.unlocked_evidence)
    print("Inspected evidence:", game_state.inspected_evidence)

    print("\n--- PLAYER MODEL ---")
    print("Evidence inspected:", player.evidence_inspected)
    print("Mistakes:", player.mistakes)
    print("Hints used:", player.hints_used)
    print("Solve times:", player.solve_times)

    behavior = player.get_behavior_profile()

    print("Behavior profile:", behavior)

    ai_action = adaptive_ai.decide(
        behavior,
        game_state
    )

    ai_state = adaptive_ai.get_state(game_state)

    print("AI action:", ai_action)
    print("AI trust:", game_state.ai_trust)
    print("AI state:", ai_state)
    print("AI thrill:", game_state.ai_thrill)
    print("AI threat:", game_state.ai_threat)


    # -------------------------
    # P02 - EMPLOYMENT RECORDS
    # -------------------------

    p02 = PatternPuzzle(
        case.puzzles[1],
        case.evidence
    )

    print("\n==============================")
    print("PUZZLE P02")
    print("==============================")

    p02_solved, observation = p02.play()

    if p02_solved:

        game_state.current_puzzle = "P02"
        game_state.solved_puzzles.append("P02")

        game_state.player_observations.append(observation)

        ai_reaction = adaptive_ai.react_to_puzzle(
            "P02",
            game_state
        )

        unlocked = p02.unlocks

        evidence_system.unlock_evidence(unlocked)

        for evidence_id in unlocked:
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        print("\nEvidence unlocked from P02!")

        evidence_system.show_evidence()

        print("\n--- P02 STATE ---")
        print("Observation:", observation)
        print("Solved puzzles:", game_state.solved_puzzles)
        print("AI reaction:", ai_reaction)
        print("AI thrill:", game_state.ai_thrill)
        print("AI threat:", game_state.ai_threat)
        print("AI state:", adaptive_ai.get_state(game_state))


        # -------------------------
        # P03 - CONNECTION GRAPH
        # -------------------------

        p03 = ConnectionGraphPuzzle(
            case.puzzles[2]
        )

        print("\n==============================")
        print("PUZZLE P03")
        print("==============================")

        (
            p03_solved,
            first,
            second,
            status,
            reasoning,
            is_misleading,
            evidence_supporting
        ) = p03.play()

        if p03_solved:

            game_state.current_puzzle = "P03"
            game_state.solved_puzzles.append("P03")

            # -------------------------
            # RECORD CONNECTION
            # -------------------------

            if status == "CONFIRMED":
                player.record_correct_connection()

            elif status == "NOT_ESTABLISHED":
                player.record_unsupported_connection()

            # -------------------------
            # UNLOCK P03 EVIDENCE
            # -------------------------

            unlocked = p03.unlocks

            evidence_system.unlock_evidence(unlocked)

            for evidence_id in unlocked:
                if evidence_id not in game_state.unlocked_evidence:
                    game_state.unlocked_evidence.append(evidence_id)

            print("\nEvidence unlocked from P03!")

            evidence_system.show_evidence()

            # -------------------------
            # P03 STATE
            # -------------------------

            print("\n--- P03 STATE ---")
            print("First entity:", first)
            print("Second entity:", second)
            print("Connection status:", status)
            print("Reasoning:", reasoning)
            print("Is misleading trail:", is_misleading)
            print("Supporting evidence:", evidence_supporting)
            print("Correct connections:", player.correct_connections)
            print(
                "Unsupported connections:",
                player.unsupported_connections
            )
            print(
                "Solved puzzles:",
                game_state.solved_puzzles
            )


        # -------------------------
        # P04 - CONTRADICTORY WITNESSES
        # -------------------------

        p04 = WitnessPuzzle(
            case.puzzles[3]
        )

        print("\n==============================")
        print("PUZZLE P04")
        print("==============================")

        (
            p04_solved,
            first_witness,
            second_witness,
            contradiction_found
        ) = p04.play()

        if p04_solved:

            game_state.current_puzzle = "P04"
            game_state.solved_puzzles.append("P04")

            # -------------------------
            # AI REACTION
            # -------------------------

            ai_reaction = adaptive_ai.react_to_puzzle(
                "P04",
                game_state
            )

            # -------------------------
            # UNLOCK P04 EVIDENCE
            # -------------------------

            if contradiction_found:

                unlocked = p04.unlocks

                evidence_system.unlock_evidence(unlocked)

                for evidence_id in unlocked:
                    if evidence_id not in game_state.unlocked_evidence:
                        game_state.unlocked_evidence.append(evidence_id)

                print("\nEvidence unlocked from P04!")

                evidence_system.show_evidence()

            # -------------------------
            # P04 STATE
            # -------------------------

            print("\n--- P04 STATE ---")
            print("First witness:", first_witness)
            print("Second witness:", second_witness)
            print(
                "Contradiction found:",
                contradiction_found
            )
            print("AI reaction:", ai_reaction)
            print(
                "AI state:",
                adaptive_ai.get_state(game_state)
            )
            print("AI thrill:", game_state.ai_thrill)
            print("AI threat:", game_state.ai_threat)
            print(
                "Solved puzzles:",
                game_state.solved_puzzles
            )
            print(
                "Unlocked evidence:",
                game_state.unlocked_evidence
            )


        # -------------------------
        # P05 - MISSING RECORD
        # -------------------------

        p05 = MissingRecordPuzzle(
            case.puzzles[4]
        )

        print("\n==============================")
        print("PUZZLE P05")
        print("==============================")

        p05_solved, answer = p05.play()

        if p05_solved:

            game_state.current_puzzle = "P05"
            game_state.solved_puzzles.append("P05")

            game_state.player_observations.append(answer)

            # -------------------------
            # AI REACTION
            # -------------------------

            ai_reaction = adaptive_ai.react_to_puzzle(
                "P05",
                game_state
            )

            # -------------------------
            # UNLOCK P05 EVIDENCE
            # -------------------------

            unlocked = p05.unlocks

            evidence_system.unlock_evidence(unlocked)

            for evidence_id in unlocked:
                if evidence_id not in game_state.unlocked_evidence:
                    game_state.unlocked_evidence.append(evidence_id)

            print("\nEvidence unlocked from P05!")

            evidence_system.show_evidence()

            # -------------------------
            # P05 STATE
            # -------------------------

            print("\n--- P05 STATE ---")
            print("Player answer:", answer)
            print("AI reaction:", ai_reaction)
            print(
                "AI state:",
                adaptive_ai.get_state(game_state)
            )
            print("AI thrill:", game_state.ai_thrill)
            print("AI threat:", game_state.ai_threat)
            print(
                "Solved puzzles:",
                game_state.solved_puzzles
            )
            print(
                "Unlocked evidence:",
                game_state.unlocked_evidence
            )


            # -------------------------
            # FINAL REASONING
            # -------------------------

            evaluator = FinalReasoningEvaluator(
                case.hypotheses,
                game_state
            )

            print("\n==============================")
            print("FINAL REASONING")
            print("==============================")

            (
                reasoning_completed,
                selected_hypothesis,
                player_reasoning
            ) = evaluator.evaluate()

            if reasoning_completed:

                # -------------------------
                # EVIDENCE USAGE
                # -------------------------

                evidence_quality = evaluator.evaluate_evidence_usage(
                    selected_hypothesis
                )

                # -------------------------
                # HYPOTHESIS EVALUATION
                # -------------------------

                hypothesis_result = evaluator.evaluate_hypothesis(
                    selected_hypothesis
                )

                # -------------------------
                # AI REACTION TO FINAL REASONING
                # -------------------------

                ai_final_state = adaptive_ai.react_to_final_reasoning(
                    hypothesis_result,
                    game_state
                )

                game_state.current_puzzle = "FINAL"

                print("\n--- FINAL RESULT ---")

                print(
                    "Selected hypothesis:",
                    selected_hypothesis["id"]
                )

                print(
                    "Player reasoning:",
                    player_reasoning
                )

                print(
                    "Evidence usage:",
                    evidence_quality
                )

                print(
                    "Hypothesis evaluation:",
                    hypothesis_result
                )

                print("\n--- AI FINAL STATE ---")

                print(
                    "AI threat:",
                    game_state.ai_threat
                )

                print(
                    "AI state:",
                    ai_final_state
                )

                print(
                    "Solved puzzles:",
                    game_state.solved_puzzles
                )

                # -------------------------
                # AI RESPONSE
                # -------------------------

                ai_response = adaptive_ai.choose_action(
                    game_state
                )

                print("\n--- AI RESPONSE ---")
                print("AI action:", ai_response)

                # -------------------------
                # AI VANISH
                # -------------------------

                vanish_result = adaptive_ai.trigger_vanish(
                    game_state
                )

                if vanish_result == "AI_VANISHED":

                    print("\n==============================")
                    print("AI CONNECTION LOST")
                    print("==============================")

                    print(
                        "The AI has disappeared."
                    )

                    print(
                        "You are on your own now."
                    )

                    print(
                        "Countdown activated."
                    )

                else:

                    print(
                        "\nThe AI remains connected."
                    )