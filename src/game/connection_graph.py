def play(self):

    print("\n--- CONNECTION GRAPH ---")
    print(self.puzzle_data["description"])

    print("\nAvailable entities:")

    print("1. Lena Hart")
    print("2. Daniel Cross")
    print("3. Maria Bell")
    print("4. Employment Transfer")
    print("5. Missing Information")

    connections = {
        ("2", "4"): "CONFIRMED",
        ("4", "2"): "CONFIRMED",

        ("2", "3"): "CONFIRMED",
        ("3", "2"): "CONFIRMED",

        ("1", "2"): "NOT_ESTABLISHED",
        ("2", "1"): "NOT_ESTABLISHED",

        ("1", "3"): "NOT_ESTABLISHED",
        ("3", "1"): "NOT_ESTABLISHED",

        ("2", "5"): "RELEVANT",
        ("5", "2"): "RELEVANT"
    }

    print("\nIdentify a connection between two entities.")

    first = input("First entity: ").strip()
    second = input("Second entity: ").strip()

    if not first or not second:
        print("\nNo connection entered.")
        return False, "", "", ""

    status = connections.get(
        (first, second),
        "UNKNOWN"
    )

    print("\nConnection recorded.")
    print("Connection status:", status)

    return True, first, second, status