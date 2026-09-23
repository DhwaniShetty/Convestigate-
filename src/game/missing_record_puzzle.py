class MissingRecordPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.missing_record = puzzle_data.get("missing_record", {})
        self.unlocks = puzzle_data.get("unlocks", [])

    def play(self):
        print("\n--- MISSING RECORD ---")
        print(self.puzzle_data["description"])

        print("\nInvestigation Gap:")
        print(
            self.missing_record.get(
                "description",
                "A critical record is missing."
            )
        )

        print("\nWhat do you think is missing?")
        answer = input("Your answer: ").strip()

        if not answer:
            print("\nNo answer entered.")
            return False, ""

        print("\nInvestigation answer recorded.")
        return True, answer

    def check_answer(self, answer):
        """
        Validate the player's understanding of the missing record
        and the credential access evidence.
        """

        if not isinstance(answer, dict):
            return False

        missing_record = answer.get("missing_record")
        location = answer.get("location")
        credential_use = answer.get("credential_use")
        avoids_direct_accusation = answer.get(
            "avoids_direct_accusation"
        )

        return (
            missing_record == "Case Assignment Log"
            and location == "weekly assignment ledger"
            and credential_use is True
            and avoids_direct_accusation is True
        )

    def get_unlocked_evidence(self):
        return self.unlocks