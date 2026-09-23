class WitnessPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.witnesses = puzzle_data.get("witnesses", [])
        self.unlocks = puzzle_data.get("unlocks", [])

    def play(self):

        print("\n--- CONTRADICTORY WITNESSES ---")
        print(self.puzzle_data["description"])

        print("\nWitness Statements:")

        for witness in self.witnesses:
            print(f"\n{witness['id']}: {witness['name']}")
            print("Statement:", witness["statement"])

        print("\nWhich witnesses contain the key contradiction?")

        first = input("First witness: ").strip()
        second = input("Second witness: ").strip()

        if not first or not second:
            print("\nNo witnesses selected.")
            return False, "", "", False

        actual_contradiction = self.puzzle_data.get(
            "actual_contradiction",
            {}
        )

        expected_first = actual_contradiction.get("witness_1")
        expected_second = actual_contradiction.get("witness_2")

        correct = (
            (first == expected_first and second == expected_second)
            or
            (first == expected_second and second == expected_first)
        )

        if correct:
            print("\nContradiction identified.")
            return True, first, second, True

        print("\nThat contradiction is not the key contradiction.")
        return True, first, second, False