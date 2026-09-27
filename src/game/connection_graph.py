class ConnectionGraphPuzzle:
    def __init__(self, puzzle_data):
        self.puzzle_data = puzzle_data
        self.connections = puzzle_data.get("connections", [])
        self.unlocks = puzzle_data.get("unlocks", [])
    def play(self):
        print("\n--- CONNECTION GRAPH ---")
        print(self.puzzle_data["description"])

        print("\nAvailable entities:")

        for entity in self.puzzle_data.get("entities", []):
            print(f'{entity["id"]}: {entity["name"]}')

        print("\nIdentify a connection between two entities.")

        first = input("First entity: ").strip()
        second = input("Second entity: ").strip()

        if not first or not second:
            print("\nNo connection entered.")
            return False, "", "", ""

        status = "UNKNOWN"
        reasoning = ""
        is_misleading = False
        evidence_supporting = []


        for connection in self.connections:
            if (
                connection["from"] == first
                and connection["to"] == second
            ):
                status = connection["status"]
                reasoning = connection.get("reasoning", "")
                is_misleading = connection.get("is_misleading_trail", False)
                evidence_supporting = connection.get("evidence_supporting", [])
                break

        print("\nConnection recorded.")
        print("Connection status:", status)
        print("Is misleading trail:", is_misleading)
        print("Supporting evidence:", evidence_supporting)
        print("Reasoning:", reasoning)

        return True, first, second, status, reasoning , is_misleading , evidence_supporting
    
   