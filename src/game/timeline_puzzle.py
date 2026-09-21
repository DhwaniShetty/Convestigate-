import time 
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
     start_time = time.time()
     mistakes = 0

     while True : 
        player_input = input("\nYour answer: ")
        player_order =[
           value.strip()
           for value in player_input.split(",")
        ]

        if self.check_answer(player_order):
           solve_time=time.time() - start_time
           print("Correct! Timeline reconstructed.")
           print(f"Time taken: {solve_time:.2f} seconds")
           print(f"Mistakes: {mistakes}")
           return True, solve_time,mistakes
        else :
              mistakes += 1
              print("Incorrect order. Try again.")
    def get_unlocked_evidence(self):
        return self.unlocks