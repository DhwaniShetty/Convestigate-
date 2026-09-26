class AdaptiveAI:

    def decide(self, behavior_profile, game_state):

        if behavior_profile == "STRUGGLING":
            game_state.ai_trust += 1
            return "HELP"

        if behavior_profile == "HINT_DEPENDENT":
            game_state.ai_trust -= 1
            game_state.ai_threat += 1
            return "REDUCE_HELP"

        if behavior_profile == "FAST_AND_ACCURATE":
            game_state.ai_thrill += 2
            game_state.ai_threat += 1
            return "CHALLENGE"

        if behavior_profile == "FAST_BUT_RECKLESS":
            game_state.ai_thrill += 1
            return "MISLEAD"

        return "NORMAL"


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


    def react_to_puzzle(self, puzzle_id, game_state):

        if puzzle_id == "P01":
            return "CALM"

        if puzzle_id == "P02":
            game_state.ai_thrill += 1
            return "CURIOUS"

        if puzzle_id == "P03":
            game_state.ai_thrill += 1
            game_state.ai_threat += 1
            return "EXCITED"

        if puzzle_id == "P04":
            game_state.ai_threat += 1
            return "DEFENSIVE"

        if puzzle_id == "P05":
            game_state.ai_threat += 2
            return "THREATENED"

        return "CALM"

    def choose_action(self, game_state):

        state = self.get_state(game_state)

        if state == "CALM":
            return "PROVIDE_NORMAL_GUIDANCE"

        if state == "COMFORTABLE":
            return "PROVIDE_HELPFUL_CLUE"

        if state == "CURIOUS":
            return "ENCOURAGE_INVESTIGATION"

        if state == "EXCITED":
            return "PUSH_PATTERN_RECOGNITION"

        if state == "DEFENSIVE":
            return "REDIRECT_ATTENTION"

        if state == "THREATENED":
            return "WITHHOLD_INFORMATION"

        if state == "PANIC":
            return "CREATE_CONFUSION"

        return "NO_ACTION"
    def trigger_vanish(self, game_state):

        if game_state.ai_threat >= 5:

            game_state.ai_vanished = True
            game_state.countdown_active = True

            return "AI_VANISHED"

        return "AI_REMAINS"

    def react_to_final_reasoning(self, hypothesis_result, game_state):

        if hypothesis_result == "SUPPORTED":
            game_state.ai_threat += 1

        elif hypothesis_result == "CONTRADICTED":
            game_state.ai_threat += 1

        elif hypothesis_result == "NOT_ESTABLISHED":
            game_state.ai_threat += 0

        return self.get_state(game_state)