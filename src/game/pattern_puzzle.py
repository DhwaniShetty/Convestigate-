class PatternPuzzle:

    def __init__(self, puzzle_data, evidence):
        self.puzzle_data = puzzle_data
        self.evidence = evidence
        self.unlocks = puzzle_data["unlocks"]

    def play(self):

        print("\n--- EMPLOYMENT RECORDS ---")
        print(self.puzzle_data["description"])

        print("\nDaniel Cross's employment history:")
        print("2018 - Government Benefits Office")
        print("2019 - Regional Transfer")
        print("2020 - Employment gap")
        print("2021 - Government Benefits Office")
        print("2022 - Regional Transfer")

        print("\nWhat do you notice about the pattern?")

        answer = input("Your observation: ")

        if answer.strip():
            print("\nObservation recorded.")
            return True, answer.strip()
        

        print("\nNo observation entered.")
        return False

    def get_unlocked_evidence(self):
        return self.unlocks