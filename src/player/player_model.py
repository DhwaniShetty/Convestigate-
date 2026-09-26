class PlayerModel:

    def __init__(self):
        self.solve_times = []
        self.mistakes = 0
        self.hints_used = 0
        self.evidence_inspected = 0
        self.correct_connections = 0
        self.unsupported_connections = 0

    def record_solve_time(self, seconds):
        self.solve_times.append(seconds)

    def record_mistake(self):
        self.mistakes += 1

    def record_hint(self):
        self.hints_used += 1

    def record_evidence_inspection(self):
        self.evidence_inspected += 1

    def get_skill_level(self):

        if self.mistakes >= 3 or self.hints_used >= 2:
            return "STRUGGLING"

        if self.mistakes == 0 and self.hints_used == 0:
            return "SKILLED"

        return "NORMAL"
    def get_behavior_profile(self):

     if not self.solve_times:
        return "UNKNOWN"

     average_time = sum(self.solve_times) / len(self.solve_times)

     if self.mistakes == 0 and average_time < 15:
        return "FAST_AND_ACCURATE"

     if self.mistakes >= 2 and average_time < 15:
        return "FAST_BUT_RECKLESS"

     if self.mistakes >= 2:
        return "STRUGGLING"

     if self.hints_used >= 2:
        return "HINT_DEPENDENT"

     return "NORMAL"

    def record_correct_connection(self):
       self.correct_connections += 1


    def record_unsupported_connection(self):
      self.unsupported_connections += 1