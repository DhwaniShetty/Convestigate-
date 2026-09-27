export const CASE_014 = {
  case_id: "014",
  title: "THE MAN WHO MOVED",
  image: "assets/cases/case_014.jpg",
  genre: "crime_mystery",
  status: "ACTIVE INVESTIGATION",
  difficulty: "MEDIUM",
  synopsis: "Lena Hart's murder appears connected to government benefits administrator Daniel Cross and an earlier death involving Maria Bell. Someone is using Daniel's history to construct a false pattern.",
  
  victim: {
    name: "Lena Hart",
    age: 19,
    occupation: "University Student",
    background: "Found dead near Northbridge Park. Her phone abruptly went dark at 22:18."
  },

  suspects: [
    {
      id: "501",
      name: "Daniel Cross",
      age: 42,
      occupation: "Government Benefits Administrator",
      relationship_to_victim: "Unknown / Administrative",
      background: "Transferred to Northbridge branch the same month. Handled prior case for Maria Bell.",
      alibi: "Claims he was dropping off case files at the main administrative branch before 22:00."
    },
    {
      id: "502",
      name: "Marcus Reed",
      age: 24,
      occupation: "University Student",
      relationship_to_victim: "Friend",
      background: "Last confirmed person to speak with Lena at the library exit around 21:47.",
      alibi: "Remained studying at the library until midnight, verified by access logs."
    },
    {
      id: "503",
      name: "Elena Hart",
      age: 47,
      occupation: "Teacher",
      relationship_to_victim: "Mother",
      background: "Spoke with Lena at 22:15 on the phone. Lena sounded normal and said she was nearly home.",
      alibi: "Was at home awaiting Lena's return."
    }
  ],

  related_persons: [
    {
      id: "601",
      name: "Maria Bell",
      role: "Prior Case Subject",
      description: "Daniel Cross handled her hardship benefits case one year prior. No evidence connects her to Lena."
    }
  ],

  timeline: [
    { time: "21:47", event: "Lena leaves the university library alone" },
    { time: "22:03", event: "Anonymous jogger claims seeing woman near Northbridge Park" },
    { time: "22:15", event: "Lena calls her mother, stating she is almost home" },
    { time: "22:18", event: "Lena's cell phone tower signal abruptly ceases" },
    { time: "22:41", event: "Emergency services discover Lena's body" }
  ],

  evidence: [
    {
      id: "E01",
      name: "Library Exit Record",
      category: "records",
      type: "Digital Access Log",
      description: "A timestamped access-card log showing Lena leaving the university library at 21:47.",
      reliability: "HIGH",
      status: "unlocked",
      source: "University Security System",
      clue: "Confirms Lena departed alone at 21:47."
    },
    {
      id: "E02",
      name: "Park Witness Statement",
      category: "witness",
      type: "Witness Interview",
      description: "Jogger claims seeing a woman matching Lena's profile inside the park at 22:10 with an unknown man.",
      reliability: "MEDIUM (QUESTIONABLE)",
      status: "unlocked",
      source: "Park Jogger Interview",
      clue: "Directly conflicts with phone tower movements at 22:10."
    },
    {
      id: "E03",
      name: "Daniel Cross Employment Record",
      category: "documents",
      type: "HR Transfer File",
      description: "Confirms Daniel Cross's transfer to Northbridge branch. Effective the same month as Lena's death.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P02",
      source: "Government HR Archive",
      clue: "Proves transfer, but proves no personal contact with Lena."
    },
    {
      id: "E04",
      name: "Phone Tower Location Log",
      category: "records",
      type: "Cell Tower Triangulation",
      description: "Pings Lena's phone along the residential avenue, away from Northbridge Park between 22:05 and 22:18.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P04",
      source: "Mobile Network Provider",
      clue: "Refutes the jogger's claim that Lena entered the park at 22:10."
    },
    {
      id: "E05",
      name: "Maria Bell Case File",
      category: "documents",
      type: "Benefits Docket",
      description: "Daniel Cross's handling of Maria Bell's hardship case one year prior. No connection to Lena.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P03",
      source: "Department Records",
      clue: "Demonstrates an administrative link to Maria, not Lena."
    },
    {
      id: "E06",
      name: "Employment Transfer Order",
      category: "documents",
      type: "Administrative Order",
      description: "Internal government order authorizing Daniel's reassignment to the branch office.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P03",
      source: "Civil Service Records",
      clue: "Official paperwork showing standard procedure."
    },
    {
      id: "E07",
      name: "Case Assignment Log (Redacted)",
      category: "records",
      type: "Archival Ledger",
      description: "The digital ledger for Lena Hart's application was mysteriously excised for the week of her death.",
      reliability: "MEDIUM (COMPROMISED)",
      status: "locked",
      unlocked_by: "P05",
      source: "Benefits Digital Archive",
      clue: "Intentional omission indicates an insider tampering with files."
    },
    {
      id: "E08",
      name: "Credential Access Log",
      category: "records",
      type: "IT Security Audit",
      description: "Lena's file was accessed under Daniel Cross's credentials at 21:52 while other evidence places him elsewhere.",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P05",
      source: "IT Security Audit Trail",
      clue: "Proves credential spoofing / framed identity."
    }
  ],

  puzzles: [
    {
      id: "P01",
      name: "Timeline Reconstruction",
      type: "timeline",
      description: "Reconstruct the chronological timeline from the library departure to discovery.",
      unlocks: ["E01", "E02"]
    },
    {
      id: "P02",
      name: "Employment Pattern Audit",
      type: "record_check",
      description: "Verify Daniel Cross's employment history and transfer timing against the case timeline.",
      unlocks: ["E03"]
    },
    {
      id: "P03",
      name: "Connection Graph",
      type: "relationship_mapping",
      description: "Map relationships between entities and identify which connections are confirmed vs unestablished.",
      unlocks: ["E05", "E06"],
      entities: [
        { id: "N01", name: "Lena Hart", node_type: "victim", x: 200, y: 120 },
        { id: "N02", name: "Daniel Cross", node_type: "suspect", x: 100, y: 300 },
        { id: "N03", name: "Maria Bell", node_type: "related_person", x: 300, y: 300 },
        { id: "N04", name: "Employment Transfer", node_type: "event_document", x: 100, y: 440 },
        { id: "N05", name: "Missing Information", node_type: "investigative_gap", x: 240, y: 440 }
      ],
      connections: [
        { from: "N02", to: "N01", connection: "Daniel Cross to Lena Hart", status: "NOT_ESTABLISHED" },
        { from: "N02", to: "N04", connection: "Daniel Cross to Employment Transfer", status: "CONFIRMED" },
        { from: "N04", to: "N05", connection: "Employment Transfer to Missing Info", status: "RELEVANT" },
        { from: "N02", to: "N03", connection: "Daniel Cross to Maria Bell", status: "CONFIRMED" },
        { from: "N03", to: "N01", connection: "Maria Bell to Lena Hart", status: "UNKNOWN" },
        { from: "N05", to: "N01", connection: "Missing Information to Lena Hart", status: "RELEVANT" }
      ]
    },
    {
      id: "P04",
      name: "Contradictory Witnesses",
      type: "statement_analysis",
      description: "Compare witness statements and determine which account conflicts with the verifiable timeline.",
      unlocks: ["E04"]
    },
    {
      id: "P05",
      name: "Missing Record Audit",
      type: "investigation_gap",
      critical: true,
      description: "Examine the erased ledger and recover the credential access log.",
      unlocks: ["E07", "E08"]
    }
  ],

  hypotheses: [
    { id: "H1", statement: "Daniel Cross killed Lena Hart." },
    { id: "H2", statement: "Daniel knew Lena but did not kill her." },
    { id: "H3", statement: "Maria Bell and Lena Hart's cases are completely unrelated." },
    { id: "H4", statement: "Someone deliberately created a false pattern to implicate Daniel Cross." },
    { id: "H5", statement: "Daniel's credentials were used by a third party, and Lena's killer remains unconfirmed." }
  ]
};
