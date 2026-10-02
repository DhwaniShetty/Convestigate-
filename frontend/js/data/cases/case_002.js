export const CASE_002 = {
  case_id: "002",
  title: "THE EVIDENCE ROOM",
  image: "assets/cases/case_002.jpg",
  genre: "forensic_corruption",
  status: "INTERNAL AUDIT",
  difficulty: "HARD",
  synopsis: "Maya Rao is murdered in her home while her infant daughter survives. The early investigation blamed Maya's brother Arjun, but evidence tampering in the evidence room points to a deliberate cover-up.",
  
  victim: {
    name: "Maya Rao",
    age: 22,
    occupation: "Law Student & Single Mother",
    background: "Found murdered in home. Infant daughter found safe in adjoining crib."
  },

  suspects: [
    {
      id: "S01",
      name: "Arjun Rao",
      age: 25,
      occupation: "Freelance Designer",
      relationship_to_victim: "Brother",
      background: "Implicated in initial police report. Physical evidence chain has major breaches.",
      alibi: "Was at a nearby internet café until 23:00."
    },
    {
      id: "S02",
      name: "Daniel Mehta",
      age: 28,
      occupation: "Investment Analyst",
      relationship_to_victim: "Child's Father",
      background: "In bitter custody dispute with Maya. Stated movements contain timeline conflicts.",
      alibi: "Claims he was dining across town, but credit slip timestamp doesn't match."
    },
    {
      id: "S03",
      name: "Vikram Sethi",
      age: 48,
      occupation: "Senior Investigating Officer",
      relationship_to_victim: "Lead Detective",
      background: "Had unrestricted access to evidence storage. Log entries missing his signature.",
      alibi: "Directing initial crime scene response."
    }
  ],

  timeline: [
    { time: "20:30", event: "Maya returns home with infant daughter" },
    { time: "21:45", event: "Neighbor reports arguing voices" },
    { time: "22:15", event: "Unidentified vehicle seen leaving driveway" },
    { time: "23:00", event: "Arjun discovers scene and calls emergency dispatch" },
    { time: "23:20", event: "Officer Vikram Sethi arrives and secures perimeter" }
  ],

  evidence: [
    {
      id: "E01",
      name: "Original Scene Photos",
      category: "photos",
      type: "Crime Scene Photography",
      description: "First responder photos showing position of physical items before official tagging.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Patrol Officer Bodycam",
      clue: "Shows a key item on the table that later disappeared from the evidence lockup."
    },
    {
      id: "E02",
      name: "Evidence Room Access Log",
      category: "records",
      type: "Keycard Telemetry",
      description: "Log showing Officer Vikram entered the evidence locker at 02:14 AM without authorization.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Station IT Security",
      clue: "Proves internal access to physical evidence prior to lab transfer."
    },
    {
      id: "E03",
      name: "Weapon Trajectory Analysis",
      category: "documents",
      type: "Forensic Ballistics",
      description: "Angle of impact demonstrates attacker was over 6 feet tall, excluding Arjun Rao (5'7\").",
      reliability: "HIGH",
      status: "locked",
      unlocked_by: "P01",
      source: "State Crime Lab",
      clue: "Exonerates Arjun physically."
    }
  ],

  puzzles: [
    {
      id: "P01",
      name: "Crime Scene Reconstruction",
      type: "timeline",
      description: "Sequence the timeline from entry to first responder arrival.",
      unlocks: ["E03"]
    },
    {
      id: "P02",
      name: "Chain of Custody Audit",
      type: "record_check",
      description: "Detect discrepancies in evidence storage locker sign-outs.",
      unlocks: []
    },
    {
      id: "P03",
      name: "Investigator Access Graph",
      type: "relationship_mapping",
      description: "Map Vikram's relationships to the suspects and evidence chain.",
      unlocks: []
    },
    {
      id: "P04",
      name: "Contradictory Police Reports",
      type: "statement_analysis",
      description: "Identify altered paragraphs between draft and final precinct reports.",
      unlocks: []
    },
    {
      id: "P05",
      name: "Storage Unit Discovery",
      type: "investigation_gap",
      critical: true,
      description: "Examine undeclared personal effects recovered from an off-site locker.",
      unlocks: []
    }
  ],

  hypotheses: [
    { id: "H1", statement: "Arjun Rao killed Maya in an argument." },
    { id: "H2", statement: "Daniel Mehta committed the murder, and Vikram Sethi facilitated a cover-up." },
    { id: "H3", statement: "Multiple attackers were involved, and the evidence room was corrupted." }
  ]
};
