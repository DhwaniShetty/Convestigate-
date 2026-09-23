class FinalReasoningEvaluator:

    def __init__(self, hypotheses, game_state):
        self.hypotheses = hypotheses
        self.game_state = game_state

    def show_hypotheses(self):

        print("\n--- FINAL HYPOTHESES ---")

        for hypothesis in self.hypotheses:
            print(
                f'{hypothesis["id"]}: '
                f'{hypothesis["description"]}'
            )

    def evaluate(self):

        self.show_hypotheses()

        print("\nWhich hypothesis best explains the evidence?")
        answer = input("Enter hypothesis ID: ").strip()

        selected = None

        for hypothesis in self.hypotheses:
            if hypothesis["id"] == answer:
                selected = hypothesis
                break

        if selected is None:
            print("\nInvalid hypothesis.")
            return False, None, ""

        print("\nExplain your reasoning.")
        reasoning = input("Your reasoning: ").strip()

        if not reasoning:
            print("\nNo reasoning provided.")
            return False, selected, ""

        return True, selected, reasoning

    def evaluate_evidence_usage(self, selected):

        inspected = self.game_state.inspected_evidence

        print("\n--- EVIDENCE USAGE ---")
        print("Evidence inspected:", inspected)

        if len(inspected) == 0:
            return "INSUFFICIENT_EVIDENCE"

        if len(inspected) <= 2:
            return "LIMITED_EVIDENCE"

        return "EVIDENCE_BASED"

    def evaluate_hypothesis(self, selected):

        print("\n--- HYPOTHESIS EVALUATION ---")

        hypothesis_status = selected.get("final_status", "UNKNOWN")

        if hypothesis_status == "supported":
            result = "SUPPORTED"

        elif hypothesis_status == "contradicted":
            result = "CONTRADICTED"

        else:
            result = "NOT_ESTABLISHED"

        print("Hypothesis:", selected["id"])
        print("Evaluation:", result)

        return result