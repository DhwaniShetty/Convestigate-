class Case:
  def __init__(self, case_id, title, victim, suspects, timeline,
               evidence, puzzles, hypotheses=None, related_persons=None, metadata=None):
    self.metadata = metadata or {}
    self.case_id = case_id
    self.title = title
    self.victim = victim
    self.suspects = suspects
    self.timeline = timeline
    self.evidence = evidence
    self.puzzles = puzzles
    self.hypotheses = hypotheses or []
    self.related_persons = related_persons or []
