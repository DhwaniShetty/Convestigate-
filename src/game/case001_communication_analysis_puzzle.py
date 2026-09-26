class Case001CommunicationAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "communication_timing_contradicts_adrian": True,
            "eleanor_suspected_adrian_financial_irregularities": True
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        communication_timing_contradicts_adrian = answer.get(
            "communication_timing_contradicts_adrian"
        )

        eleanor_suspected_adrian_financial_irregularities = answer.get(
            "eleanor_suspected_adrian_financial_irregularities"
        )

        if not isinstance(communication_timing_contradicts_adrian, bool):
            return False

        if not isinstance(
            eleanor_suspected_adrian_financial_irregularities,
            bool
        ):
            return False

        return (
            communication_timing_contradicts_adrian
            == self.required_analysis[
                "communication_timing_contradicts_adrian"
            ]
            and
            eleanor_suspected_adrian_financial_irregularities
            ==
            self.required_analysis[
                "eleanor_suspected_adrian_financial_irregularities"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks