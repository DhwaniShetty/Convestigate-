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

        if game_state.ai_threat >= 3:
            return "THREATENED"

        if game_state.ai_thrill >= 3:
            return "EXCITED"

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