class Case013NarrativeSynthesisPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.unlocks = puzzle_data.get("unlocks", [])

        self.required_reconstruction = {
            "concealed_private_life": True,
            "public_and_private_timelines_overlap": True,
            "private_life_alone_proves_murder": False
        }

    def check_answer(self, answer):
        if not isinstance(answer, dict):
            return False

        concealed_private_life = answer.get(
            "concealed_private_life"
        )

        public_and_private_timelines_overlap = answer.get(
            "public_and_private_timelines_overlap"
        )

        private_life_alone_proves_murder = answer.get(
            "private_life_alone_proves_murder"
        )

        if not isinstance(concealed_private_life, bool):
            return False

        if not isinstance(public_and_private_timelines_overlap, bool):
            return False

        if not isinstance(private_life_alone_proves_murder, bool):
            return False

        return (
            concealed_private_life
            == self.required_reconstruction[
                "concealed_private_life"
            ]
            and public_and_private_timelines_overlap
            == self.required_reconstruction[
                "public_and_private_timelines_overlap"
            ]
            and private_life_alone_proves_murder
            == self.required_reconstruction[
                "private_life_alone_proves_murder"
            ]
        )

    def get_unlocked_evidence(self):
        return self.unlocks