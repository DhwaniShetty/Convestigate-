class Case001HypothesisManagementPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "adrian_is_supported_suspect": True,
            "revised_statement_contradicts_original": True,
            "h3_is_best_supported_hypothesis": True,
            "exact_death_mechanism_unresolved": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        adrian_is_supported_suspect = answer.get(
            "adrian_is_supported_suspect"
        )

        revised_statement_contradicts_original = answer.get(
            "revised_statement_contradicts_original"
        )

        h3_is_best_supported_hypothesis = answer.get(
            "h3_is_best_supported_hypothesis"
        )

        exact_death_mechanism_unresolved = answer.get(
            "exact_death_mechanism_unresolved"
        )

        if not isinstance(adrian_is_supported_suspect, bool):
            return False

        if not isinstance(
            revised_statement_contradicts_original,
            bool
        ):
            return False

        if not isinstance(h3_is_best_supported_hypothesis, bool):
            return False

        if not isinstance(exact_death_mechanism_unresolved, bool):
            return False

        return (
            adrian_is_supported_suspect
            == self.required_analysis[
                "adrian_is_supported_suspect"
            ]
            and
            revised_statement_contradicts_original
            ==
            self.required_analysis[
                "revised_statement_contradicts_original"
            ]
            and
            h3_is_best_supported_hypothesis
            ==
            self.required_analysis[
                "h3_is_best_supported_hypothesis"
            ]
            and
            exact_death_mechanism_unresolved
            ==
            self.required_analysis[
                "exact_death_mechanism_unresolved"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks