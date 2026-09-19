from src.game.evidence_system import EvidenceSystem
from src.case.case_loader import case
from src.game.timeline_puzzle import TimelinePuzzle 

puzzle = TimelinePuzzle(
    case.timeline,
    case.evidence,
    case.puzzles[0]
)
evidence_system=EvidenceSystem(case.evidence)
solved = puzzle.play()
if solved:
    unlocked = puzzle.get_unlocked_evidence()
    evidence_system.unlock_evidence(unlocked)
    print("\n Evidence unlocked!")
    evidence_system.show_evidence()
    evidence_system.inspect_evidence()
  