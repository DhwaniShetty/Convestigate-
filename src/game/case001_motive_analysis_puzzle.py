class Case001MotiveAnalysisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_analysis = {
            "financial_motive_supported": True,
            "estate_change_relevant": True,
            "account_access_links_adrian": True,
            "family_history_proves_motive": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        financial_motive_supported = answer.get(
            "financial_motive_supported"
        )
        estate_change_relevant = answer.get(
            "estate_change_relevant"
        )
        account_access_links_adrian = answer.get(
            "account_access_links_adrian"
        )
        family_history_proves_motive = answer.get(
            "family_history_proves_motive"
        )

        if not isinstance(financial_motive_supported, bool):
            return False

        if not isinstance(estate_change_relevant, bool):
            return False

        if not isinstance(account_access_links_adrian, bool):
            return False

        if not isinstance(family_history_proves_motive, bool):
            return False

        return (
            financial_motive_supported
            == self.required_analysis["financial_motive_supported"]
            and estate_change_relevant
            == self.required_analysis["estate_change_relevant"]
            and account_access_links_adrian
            == self.required_analysis["account_access_links_adrian"]
            and family_history_proves_motive
            == self.required_analysis[
                "family_history_proves_motive"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks