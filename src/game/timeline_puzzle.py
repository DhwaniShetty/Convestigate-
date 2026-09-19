class TimelinePuzzle:
    def __init__(self, timeline, evidence, puzzle_data):
        self.timeline = timeline
        self.evidence = evidence
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data["unlocks"]

    def check_answer(self, player_order):
        correct_order = [event["time"] for event in self.timeline]
        return player_order == correct_order

    def play(self):
        print("\nArrange the events in chronological order.")
        print("Enter the times separated by commas.")

        player_input = input("Your answer: ")

        player_order = [time.strip() for time in player_input.split(",")]

        if self.check_answer(player_order):
            print("Correct! Timeline reconstructed.")
            return True
        else:
            print("Incorrect. Try again.")
            return False

    def get_unlocked_evidence(self):
        return self.unlocks