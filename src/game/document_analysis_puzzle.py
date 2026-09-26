class DocumentAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_hypotheses = {
            "supported": ["H1"],
            "contradicted": ["H2"]
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        supported = answer.get("supported", [])
        contradicted = answer.get("contradicted", [])

        if not isinstance(supported, list):
            return False

        if not isinstance(contradicted, list):
            return False

        return (
            set(supported) == set(self.required_hypotheses["supported"])
            and set(contradicted) == set(self.required_hypotheses["contradicted"])
        )

    def get_unlocked_evidence(self):
        return self.unlocks
