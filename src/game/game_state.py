class GameState:

    def __init__(self, case_id):
        self.case_id = case_id

        self.current_puzzle = None

        self.solved_puzzles = []
        self.unlocked_evidence = []
        self.inspected_evidence = []

        self.hints_used = 0
        self.mistakes = 0

        self.ai_trust = 0
        self.ai_thrill = 0
        self.ai_threat = 0

        self.game_over = False
        self.player_observations = []