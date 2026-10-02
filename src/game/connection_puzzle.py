class ConnectionPuzzle:

    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.connections = puzzle_data.get("connections", [])
        self.unlocks = puzzle_data.get("unlocks", [])

    def check_answer(self, player_connections):
        """
        Check whether the player's relationship classifications
        match the expected connection statuses from the case.
        """

        if not isinstance(player_connections, list):
            return False

        if len(player_connections) != len(self.connections):
            return False

        expected = {}

        for connection in self.connections:
            key = (
                connection["from"],
                connection["to"]
            )
            expected[key] = connection["status"]

        for player_connection in player_connections:
            if not isinstance(player_connection, dict):
                return False

            from_node = player_connection.get("from")
            to_node = player_connection.get("to")
            status = player_connection.get("status")

            key = (from_node, to_node)

            if key not in expected:
                return False

            if status != expected[key]:
                return False

        return True

    def get_unlocked_evidence(self):
        return self.unlocks