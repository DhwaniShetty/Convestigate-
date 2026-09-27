export const CASE_001 = {
  case_id: "001",
  title: "THE LAST VOYAGE",
  image: "assets/cases/case_001.jpg",
  genre: "maritime_mystery",
  status: "OPEN INQUIRY",
  difficulty: "EASY",
  synopsis: "Eleanor Voss disappears during a private offshore trip with her son Adrian. While initially declared an accidental sinking, boat maintenance contradictions suggest deliberate sabotage.",
  
  victim: {
    name: "Eleanor Voss",
    age: 58,
    occupation: "Wealthy Businesswoman & Investor",
    background: "Disappeared at sea. Had prepared estate changes reducing her son's inheritance."
  },

  suspects: [
    {
      id: "S01",
      name: "Adrian Voss",
      age: 31,
      occupation: "Heir / Estate Beneficiary",
      relationship_to_victim: "Son",
      background: "Sole survivor found in life raft. Struggling with undisclosed personal debts.",
      alibi: "Claims unexpected engine room fire forced him into life raft before he could reach Eleanor."
    },
    {
      id: "S02",
      name: "Marcus Voss",
      age: 62,
      occupation: "Real Estate Developer",
      relationship_to_victim: "Brother",
      background: "Had contentious disputes with Eleanor over family trust distributions.",
      alibi: "Was at his marina office at the time of radio distress."
    },
    {
      id: "S03",
      name: "Daniel Mercer",
      age: 46,
      occupation: "Marine Mechanic",
      relationship_to_victim: "Contractor",
      background: "Serviced the vessel prior to departure. Discrepancies found on bilge pump invoice.",
      alibi: "Was working in the boatyard dry dock."
    }
  ],

  timeline: [
    { time: "08:10", event: "Eleanor and Adrian depart harbor on private yacht" },
    { time: "11:40", event: "Weather report notes deteriorating swells" },
    { time: "13:15", event: "Adrian logs mild engine performance issues" },
    { time: "14:02", event: "Mayday distress signal transmitted to coast guard" },
    { time: "14:20", event: "Adrian deploys solitary life raft" },
    { time: "15:05", event: "Coast guard rescue vessel recovers Adrian; Eleanor missing" }
  ],

  evidence: [
    {
      id: "E01",
      name: "Harbor Departure Log",
      category: "records",
      type: "Port Authority Log",
      description: "Confirms vessel cleared customs and departed harbor at 08:10.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Port Authority",
      clue: "Only Adrian and Eleanor were aboard."
    },
    {
      id: "E02",
      name: "Coast Guard Weather Analysis",
      category: "documents",
      type: "Meteorological Report",
      description: "Shows moderate swells at 11:40 but not severe enough to breach hull.",
      reliability: "HIGH",
      status: "unlocked",
      source: "National Oceanic Service",
      clue: "Weather alone could not sink a modern twin-engine cruiser."
    },
    {
      id: "E03",
      name: "Adrian's Rescue Statement",
      category: "witness",
      type: "Sworn Statement",
      description: "Adrian states the sea cock failed suddenly and Eleanor was trapped below deck.",
      reliability: "MEDIUM (DECEPTIVE)",
      status: "locked",
      unlocked_by: "P01",
      source: "Coast Guard Interview",
      clue: "Timing of mayday call contradicts his timeline of water intake."
    },
    {
      id: "E04",
      name: "Bilge Pump Repair Invoice",
      category: "documents",
      type: "Maintenance Record",
      description: "Invoice showing bilge pump replacement 48 hours prior, billed to Adrian's card.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P02",
      source: "Marina Dock Records",
      clue: "Shows mechanic was instructed to bypass the automatic float switch."
    }
  ],

  puzzles: [
    {
      id: "P01",
      name: "Voyage Timeline",
      type: "timeline",
      description: "Reconstruct the chronological timeline from harbor departure to rescue.",
      unlocks: ["E03"]
    },
    {
      id: "P02",
      name: "Mechanical Sabotage Audit",
      type: "record_check",
      description: "Audit bilge pump work orders against the emergency call log.",
      unlocks: ["E04"]
    },
    {
      id: "P03",
      name: "Financial Motive Graph",
      type: "relationship_mapping",
      description: "Trace estate inheritance documents and account debits.",
      unlocks: []
    },
    {
      id: "P04",
      name: "Emergency Signal Contradiction",
      type: "statement_analysis",
      description: "Contrast the radio telemetry time with Adrian's survival raft timeline.",
      unlocks: []
    },
    {
      id: "P05",
      name: "Missing Hull Inspection",
      type: "investigation_gap",
      critical: true,
      description: "Identify what remaining physical evidence is missing due to the lost hull.",
      unlocks: []
    }
  ],

  hypotheses: [
    { id: "H1", statement: "The boat suffered an unavoidable mechanical accident." },
    { id: "H2", statement: "Adrian Voss deliberately sabotaged the vessel for inheritance." },
    { id: "H3", statement: "The mechanic made an accidental repair error." }
  ]
};
