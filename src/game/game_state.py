class GameState:

    def __init__(self, case_id):
        self.case_id = case_id

        # Current investigation stage
        self.current_puzzle = "timeline"

        # Puzzle progression
        self.solved_puzzles = []

        # Evidence progression
        self.unlocked_evidence = []
        self.inspected_evidence = []

        # Player performance
        self.hints_used = 0
        self.mistakes = 0

        # AI Mentor state
        self.ai_trust = 0
        self.ai_thrill = 0
        self.ai_threat = 0
        self.ai_vanished = False

        # Game progression
        self.countdown_active = False
        self.game_over = False

        # Player observations
        self.player_observations = []