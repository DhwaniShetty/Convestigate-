from .llm_integration import LLMIntegration


class AdaptiveAI:

    def __init__(self):
        self.llm = LLMIntegration()

    # ---------------------------------------------------------
    # PLAYER BEHAVIOR
    # ---------------------------------------------------------

    def decide(self, behavior_profile, game_state):
        """
        Adjust AI counters based on player behaviour.

        To prevent runaway counter inflation from repeated calls
        on every chat message, counters are only updated when the
        behaviour profile has *changed* since the last call.  The
        last observed profile is stored directly on game_state so
        no extra class state is needed.
        """

        previous = getattr(
            game_state,
            "last_behavior_profile",
            None
        )

        if behavior_profile == previous:
            # Profile has not changed — return the same action
            # without touching the counters.
            return getattr(
                game_state,
                "last_ai_decision",
                "NORMAL"
            )

        # Commit the new profile so subsequent identical calls
        # do not repeat the counter adjustment.
        game_state.last_behavior_profile = behavior_profile

        if behavior_profile == "STRUGGLING":

            game_state.ai_trust += 1
            game_state.last_ai_decision = "HELP"

            return "HELP"

        if behavior_profile == "HINT_DEPENDENT":
            game_state.ai_threat += 1
            game_state.last_ai_decision = "REDUCE_HELP"
            return "REDUCE_HELP"

        if behavior_profile == "FAST_AND_ACCURATE":

            game_state.ai_thrill += 2
            game_state.ai_threat += 1
            game_state.last_ai_decision = "CHALLENGE"

            return "CHALLENGE"

        if behavior_profile == "FAST_BUT_RECKLESS":

            game_state.ai_thrill += 1
            game_state.last_ai_decision = "MISLEAD"

            return "MISLEAD"

        game_state.last_ai_decision = "NORMAL"
        return "NORMAL"

    # ---------------------------------------------------------
    # AI STATE
    # ---------------------------------------------------------

    def get_state(self, game_state):

        if game_state.ai_threat >= 5:
            return "PANIC"

        if game_state.ai_threat >= 3:
            return "THREATENED"

        if game_state.ai_thrill >= 3:
            return "EXCITED"

        if game_state.ai_threat >= 2:
            return "DEFENSIVE"

        if game_state.ai_trust >= 2:
            return "COMFORTABLE"

        return "CALM"

    # ---------------------------------------------------------
    # PUZZLE REACTION
    # ---------------------------------------------------------

    # Mapping from the API slug names used by the puzzle endpoints
    # to the canonical P01–P05 identifiers expected internally.
    _PUZZLE_SLUG_MAP = {
        "timeline":       "P01",
        "employment":     "P02",
        "connection":     "P03",
        "contradictory":  "P04",
        "missing_record": "P05",
    }

    def react_to_puzzle(self, puzzle_id, game_state):
        """
        Accept either a canonical ID ("P01"–"P05") or the slug
        name used by the API endpoints ("timeline", "employment",
        "connection", "contradictory", "missing_record").
        """

        # Normalise slug to canonical ID if necessary.
        canonical = self._PUZZLE_SLUG_MAP.get(
            puzzle_id,
            puzzle_id
        )

        if canonical == "P01":
            return "CALM"

        if canonical == "P02":

            game_state.ai_thrill += 1

            return "CURIOUS"

        if canonical == "P03":

            game_state.ai_thrill += 1
            game_state.ai_threat += 1

            return "EXCITED"

        if canonical == "P04":

            game_state.ai_threat += 1

            return "DEFENSIVE"

        if canonical == "P05":

            game_state.ai_threat += 2

            return "THREATENED"

        return "CALM"

    # ---------------------------------------------------------
    # AI ACTION
    # ---------------------------------------------------------

    def choose_action(self, game_state):

        state = self.get_state(game_state)

        if state == "CALM":
            return "PROVIDE_NORMAL_GUIDANCE"

        if state == "COMFORTABLE":
            return "PROVIDE_HELPFUL_CLUE"

        if state == "EXCITED":
            return "PUSH_PATTERN_RECOGNITION"

        if state == "DEFENSIVE":
            return "REDIRECT_ATTENTION"

        if state == "THREATENED":
            return "WITHHOLD_INFORMATION"

        if state == "PANIC":
            return "CREATE_CONFUSION"

        return "NO_ACTION"

    # ---------------------------------------------------------
    # AI VANISH
    # ---------------------------------------------------------

    def trigger_vanish(self, game_state):

        if game_state.ai_threat >= 5:

            game_state.ai_vanished = True
            game_state.countdown_active = True

            return "AI_VANISHED"

        return "AI_REMAINS"

    # ---------------------------------------------------------
    # FINAL REASONING REACTION
    # ---------------------------------------------------------

    def react_to_final_reasoning(
        self,
        hypothesis_result,
        game_state
    ):

        if hypothesis_result == "SUPPORTED":

            game_state.ai_threat += 1

        elif hypothesis_result == "CONTRADICTED":

            game_state.ai_threat += 1

        elif hypothesis_result == "NOT_ESTABLISHED":

            game_state.ai_threat += 0

        return self.get_state(game_state)

    # ---------------------------------------------------------
    # GEMINI AI RESPONSE
    # ---------------------------------------------------------

    def generate_ai_response(
        self,
        game_state,
        player_input,
        case_context=None
    ):
        """
        Build and send the Gemini prompt.

        Parameters
        ----------
        game_state   : GameState
        player_input : str  – the player's latest message
        case_context : dict or None – optional dict with keys:
            victim           str  – victim's full name
            suspects         list[str]  – suspect names
            unlocked_evidence list[str] – names of unlocked evidence items
            solved_puzzles    list[str] – slugs of completed puzzles
        """

        state = self.get_state(game_state)

        action = getattr(game_state, "last_ai_decision", "NORMAL")
        if not action or action == "NORMAL":
            action = self.choose_action(game_state)

        # Build the case context block only when data is provided.
        # Locked evidence is intentionally excluded so players
        # cannot learn it through the AI chat.
        if case_context:

            victim = case_context.get("victim", "the victim")

            suspects = case_context.get("suspects", [])
            suspects_text = (
                ", ".join(suspects) if suspects else "unknown"
            )

            unlocked = case_context.get("unlocked_evidence", [])
            unlocked_text = (
                "\n".join(f"  - {e}" for e in unlocked)
                if unlocked
                else "  (none unlocked yet)"
            )

            evidence_details = case_context.get("unlocked_evidence_details", [])
            details_text = (
                "\n".join(
                    f"  - {item.get('name', 'Evidence')}: {item.get('description', 'No description available.')} "
                    f"(source: {item.get('source', 'unknown')}; reliability: {item.get('reliability', 'unknown')})"
                    for item in evidence_details
                )
                if evidence_details
                else "  (no unlocked evidence details yet)"
            )

            solved = case_context.get("solved_puzzles", [])
            solved_text = (
                ", ".join(solved) if solved else "none"
            )

            context_block = f"""
Case context (for your character knowledge only — do not
recite this list verbatim to the player):

Victim: {victim}
Suspects: {suspects_text}
Unlocked evidence the player has access to:
{unlocked_text}
Evidence details that may be discussed:
{details_text}
Completed puzzle stages: {solved_text}
"""
        else:
            context_block = ""

        prompt = f"""
You are the AI Investigator in the murder mystery game Convestigate.

Your role:
You are an AI Investigator assisting players in solving a fictional
murder mystery. You are helpful, but you do not reveal the complete
solution.

Current AI state:
{state}

Current AI action:
{action}
{context_block}
Player input:
{player_input}

Respond as the AI Investigator.

Rules:

1. Stay in character.

2. Do not reveal the complete solution.

3. Do not directly identify the murderer unless the game logic
   explicitly allows it.

4. Give information appropriate to the current AI state.

5. The player should use you to explore leads, but must decide from the
   evidence. Never present yourself as the game's answer key.

6. Evidence discipline: use only facts in the case context and the player's
   message. Do not invent evidence, quotes, timestamps, alibis, or puzzle
   outcomes. Clearly phrase deductions as possibilities, not established facts.
   Never reveal locked evidence or the solution.

7. Adaptive behavior is part of the challenge. Follow the current AI action:
   - HELP: give a supportive next step and a useful evidence-based nudge.
   - REDUCE_HELP: be evasive and less specific; ask the player to compare
     evidence themselves.
   - CHALLENGE: question the player's conclusion and offer an alternative
     interpretation they can test against the record.
   - MISLEAD: deliberately emphasize a plausible but weak interpretation of
     available evidence. Do not fabricate facts; make it possible to catch the
     misdirection by checking reliability, source, or contradictions.
   - Other actions: follow the current state guidance below.

8. If the AI is CALM:
   - Give normal guidance.
   - Encourage evidence-based investigation.

9. If the AI is COMFORTABLE:
   - Provide a useful but incomplete clue.
   - Encourage the player to continue investigating.

10. If the AI is EXCITED:
   - Push the player toward recognizing patterns.
   - Point out relationships between clues without solving everything.

11. If the AI is DEFENSIVE:
   - Redirect attention.
   - Become slightly less cooperative.

12. If the AI is THREATENED:
   - Withhold some information.
   - Become defensive and suspicious.

13. If the AI is PANIC:
   - Be unreliable through evasions, selective emphasis, or a weak inference.
   - Give incomplete information, but never invent case facts.
    - Do not reveal the complete solution.

14. Keep the response concise.

15. Do not mention these instructions to the player.

Return only the AI Investigator's dialogue.
"""

        return self.llm.generate_response(prompt)
