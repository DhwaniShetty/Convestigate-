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