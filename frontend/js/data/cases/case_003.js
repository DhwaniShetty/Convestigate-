export const CASE_003 = {
  case_id: "003",
  title: "THE MAN FROM THE BAR",
  image: "assets/cases/case_003.jpg",
  genre: "disappearance_mystery",
  status: "COLD CASE",
  difficulty: "HARD",
  synopsis: "Ronald 'Ronnie' Jack, his partner Doreen, and their two sons vanish after leaving their home with an unidentified man who offered forestry work at an urgent remote logging camp.",
  
  victim: {
    name: "Ronald Paul 'Ronnie' Jack & Family",
    age: 26,
    occupation: "Former Sawmill Worker",
    background: "Disappeared with Doreen (26), Russell (9), and Ryan (4). Struggling financially."
  },

  suspects: [
    {
      id: "S01",
      name: "The Unknown Man",
      age: 38,
      occupation: "Alleged Forestry Recruiter",
      relationship_to_victim: "Stranger",
      background: "Tall, heavyset Caucasian man in red checkered shirt, blue nylon jacket with Husqvarna logo.",
      alibi: "Identity unconfirmed; never traced by authorities."
    }
  ],

  timeline: [
    { time: "22:00, Aug 1", event: "Ronnie meets unidentified man at Prince George pub" },
    { time: "23:00, Aug 1", event: "Ronnie and man depart pub in dark 4x4 pickup for Jack residence" },
    { time: "23:16, Aug 1", event: "Ronnie phones brother discussing urgent logging camp job" },
    { time: "00:00, Aug 2", event: "Doreen's cousin visits; observes Doreen packing supplies" },
    { time: "01:21, Aug 2", event: "Final outbound phone call placed from Jack residence" },
    { time: "Early Aug 2", event: "The entire Jack family disappears without a trace" }
  ],

  evidence: [
    {
      id: "E01",
      name: "Pub Eyewitness Account",
      category: "witness",
      type: "Bartender Statement",
      description: "Witness confirms Ronnie speaking with heavyset bearded man wearing Husqvarna jacket.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Prince George Tavern Interview",
      clue: "Confirms meeting and departure in dark 4x4."
    },
    {
      id: "E02",
      name: "11:16 PM Phone Record",
      category: "records",
      type: "Telecom Toll Record",
      description: "Toll record proving Ronnie called his brother to inform him of camp departure.",
      reliability: "HIGH",
      status: "unlocked",
      source: "BC Tel Archives",
      clue: "Shows Ronnie believed the offer was genuine."
    }
  ],

  puzzles: [
    { id: "P01", name: "Night Timeline", type: "timeline", description: "Reconstruct the sequence from the pub to departure.", unlocks: [] },
    { id: "P02", name: "Witness Description", type: "record_check", description: "Assemble the suspect's physical profile.", unlocks: [] },
    { id: "P03", name: "Logging Camp Audit", type: "relationship_mapping", description: "Cross-reference legitimate regional camps.", unlocks: [] },
    { id: "P04", name: "False Found-Report Contradiction", type: "statement_analysis", description: "Audit erroneous police communication.", unlocks: [] },
    { id: "P05", name: "Final Uncertainty Report", type: "investigation_gap", critical: true, description: "Identify what can be proven vs unresolved.", unlocks: [] }
  ],

  hypotheses: [
    { id: "H1", statement: "The job offer was fabricated and the family was deliberately lured away." },
    { id: "H2", statement: "The family suffered an accidental event travelling to a remote site." },
    { id: "H3", statement: "Evidence is insufficient to establish the unknown man's identity or fate." }
  ]
};
