// Comprehensive Registry of all 14 Convestigate Cases
import { CASE_014 } from './cases/case_014.js';
import { CASE_001 } from './cases/case_001.js';
import { CASE_002 } from './cases/case_002.js';
import { CASE_003 } from './cases/case_003.js';

export const CASE_004 = {
  case_id: "004",
  title: "THE SEALED CORRIDOR",
  image: "assets/cases/case_004.jpg",
  genre: "locked_room",
  status: "ACTIVE COLD CASE",
  difficulty: "HARD",
  synopsis: "Dr. Katherine Ward is discovered unresponsive inside a high-security biomedical research laboratory locked from the interior. Decommissioned ventilation blueprints conflict with the official building access logs.",
  victim: {
    name: "Dr. Katherine Ward",
    age: 41,
    occupation: "Chief Virologist & Lead Researcher",
    background: "Found locked inside Cleanroom Delta. Keycard access records indicate no other personnel entered after 19:30."
  },
  suspects: [
    {
      id: "S01",
      name: "Dr. Julian Mercer",
      age: 45,
      occupation: "Associate Lab Director",
      relationship_to_victim: "Research Colleague",
      background: "Co-authored proprietary patent filing. Had disputed patent ownership with Ward.",
      alibi: "Logged in at the 3rd floor computational office during the incident."
    },
    {
      id: "S02",
      name: "Garrison Vance",
      age: 39,
      occupation: "Head of Facility Security",
      relationship_to_victim: "Security Chief",
      background: "Authorized manual maintenance bypass codes on the ventilation duct dampers.",
      alibi: "Monitoring main gate cameras on ground floor."
    }
  ],
  timeline: [
    { time: "18:15", event: "Katherine Ward enters Cleanroom Delta and initiates secure protocol" },
    { time: "19:30", event: "Electronic airlock cycles shut; security logs record zero entry breaches" },
    { time: "20:45", event: "Differential pressure sensor reports anomalous airflow surge" },
    { time: "21:30", event: "Security staff initiate emergency override; Ward found deceased" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Electronic Airlock Telemetry",
      category: "records",
      type: "Access Log",
      description: "Shows airlock sealed at 19:30 with no external card reads recorded until 21:30.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Facility Security Server",
      clue: "Confirms doors were mechanically sealed from within."
    },
    {
      id: "E02",
      name: "HVAC Override Authorization",
      category: "documents",
      type: "Maintenance Ticket",
      description: "Signed maintenance request instructing damper lockdown in Cleanroom Delta.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Facilities Management Archive",
      clue: "Proves external access to airflow controls without breaching airlock doors."
    }
  ],
  puzzles: [
    { id: "P01", name: "Airlock Timeline", type: "timeline", description: "Reconstruct pressure alarms against airlock timestamps.", unlocks: [] },
    { id: "P02", name: "Ventilation Blueprint", type: "record_check", description: "Trace alternate airflow routes bypassed during maintenance.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Katherine Ward suffered an accidental containment breach." },
    { id: "H2", statement: "An unauthorized agent manipulated HVAC dampers from outside the sealed room." }
  ]
};

export const CASE_005 = {
  case_id: "005",
  title: "THE FALSE BLOOD",
  image: "assets/cases/case_005.jpg",
  genre: "forensic_deception",
  status: "ACTIVE INVESTIGATION",
  difficulty: "EXPERT",
  synopsis: "A fictional forensic-deception case centered on a conflict between biological evidence profiles. Repeated Profile X results conflict with an authentic Profile Y result across the chain of custody.",
  victim: {
    name: "Elena Marquez",
    age: 29,
    occupation: "Biochemical Analyst",
    background: "Central figure connected to contested biological profiles in state crime lab storage."
  },
  suspects: [
    {
      id: "S01",
      name: "Dr. Adrian Vale",
      age: 52,
      occupation: "Lead Forensic Medical Examiner",
      relationship_to_victim: "Forensic Examiner",
      background: "Processed initial blood vial samples. Sign-off sheets contain handwriting irregularities.",
      alibi: "Conducting lab assays in private analytical suite."
    },
    {
      id: "S02",
      name: "Detective Ray Caldwell",
      age: 44,
      occupation: "Case Investigator",
      relationship_to_victim: "Investigator",
      background: "Transported biological specimen cooler from incident scene to regional depot.",
      alibi: "In transit between precinct and forensic center."
    }
  ],
  timeline: [
    { time: "22:10", event: "Specimen collection secured at scene by field team" },
    { time: "23:45", event: "Sample transit logged into regional evidence locker" },
    { time: "08:30, Next Day", event: "First laboratory PCR run returns Profile X match" },
    { time: "14:15, Next Day", event: "Independent reference run establishes Profile Y as true authentic source" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Profile X Initial Assay",
      category: "records",
      type: "DNA Electropherogram",
      description: "Repeated apparent biological match that steered the initial investigation.",
      reliability: "MEDIUM (COMPROMISED)",
      status: "unlocked",
      source: "Precinct Lab Log",
      clue: "Profile repeatedly generated from contaminated sample tube."
    },
    {
      id: "E02",
      name: "Sample Provenance Audit",
      category: "documents",
      type: "Chain of Custody",
      description: "Shows 45-minute unmonitored transfer gap where specimen seals were broken.",
      reliability: "HIGH",
      status: "unlocked",
      source: "State Internal Affairs",
      clue: "Proves sample substitution occurred prior to laboratory receipt."
    }
  ],
  puzzles: [
    { id: "P01", name: "Profile Comparison", type: "record_check", description: "Compare genetic alleles between Profile X and Profile Y.", unlocks: [] },
    { id: "P02", name: "Laboratory Chain", type: "timeline", description: "Map transit sequence and locate substitution window.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Profile X represents an accidental laboratory cross-contamination." },
    { id: "H2", statement: "Sample substitution was intentionally executed to manufacture a false suspect profile." }
  ]
};

export const CASE_006 = {
  case_id: "006",
  title: "THE $10 QUESTION",
  image: "assets/cases/case_006.jpg",
  genre: "identity_reconstruction",
  status: "COLD CASE REOPENED",
  difficulty: "HARD",
  synopsis: "Tim Molnar disappears from Daytona Beach leaving an abandoned car and a $10 bank account balance. Was the remaining $10 a symbolic farewell, or a calculated move to prevent automated account closure?",
  victim: {
    name: "Tim Molnar",
    age: 19,
    occupation: "Aeronautical Mechanics Student",
    background: "Disappeared from Daytona Beach, Florida. Remains discovered years later in Wisconsin."
  },
  suspects: [
    {
      id: "S01",
      name: "The Driver",
      age: 35,
      occupation: "Long-haul Interceptor",
      relationship_to_victim: "Unknown Opportunist",
      background: "Fictional antagonist who intercepted Tim north of Atlanta, using Tim's staged departure as cover.",
      alibi: "Never questioned in original Florida investigation."
    }
  ],
  timeline: [
    { time: "Jan 24, 09:15", event: "Tim withdraws majority of savings, leaving exact $10 balance" },
    { time: "Jan 24, 13:40", event: "Credit card receipt logged at highway service plaza" },
    { time: "Jan 25, 04:00", event: "Vehicle located abandoned near Atlanta bus terminal with ID and wallet left inside" },
    { time: "Unrecorded", event: "Unexplained journey gap between Atlanta and Wisconsin" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Bank Withdrawal Slip & $10 Balance",
      category: "documents",
      type: "Bank Ledger",
      description: "Shows large cash withdrawal leaving exactly $10.00 in the account.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Daytona Federal Savings",
      clue: "Left $10 to avoid triggering automatic account closure protocols, not as a message."
    },
    {
      id: "E02",
      name: "Abandoned Vehicle Inventory",
      category: "records",
      type: "Police Impound Report",
      description: "Tim's wallet, driver's license, and tools left inside car near bus terminal.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Atlanta Police Department",
      clue: "Indicates intent to discard original identity, camouflaging subsequent abduction."
    }
  ],
  puzzles: [
    { id: "P01", name: "The $10 Question", type: "record_check", description: "Audit bank administrative thresholds against symbolic farewell theories.", unlocks: [] },
    { id: "P02", name: "The Atlanta Terminal", type: "timeline", description: "Reconstruct last verified movements before Wisconsin gap.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Tim completely staged his voluntary disappearance and died of misadventure." },
    { id: "H2", statement: "Tim intended to disappear temporarily, but was intercepted by an opportunist (The Driver)." }
  ]
};

export const CASE_007 = {
  case_id: "007",
  title: "THE LAST DRIVE",
  image: "assets/cases/case_007.jpg",
  genre: "forensic_reconstruction",
  status: "CORONER INQUEST",
  difficulty: "HARD",
  synopsis: "Prosecutor Daniel Cross is found drowned beside a stabbed, partially submerged car off a remote river road. Competing evidence pits staged suicide against a calculated ambush.",
  victim: {
    name: "Daniel Cross",
    age: 48,
    occupation: "Senior County Prosecutor",
    background: "Prosecuted high-profile organized corruption trials. Recovered beside his vehicle at Miller's Creek."
  },
  suspects: [
    {
      id: "S01",
      name: "Thomas Locke",
      age: 39,
      occupation: "Former Trial Defendant",
      relationship_to_victim: "Adversary",
      background: "Acquitted on procedural technicality. Toll records place his vehicle 4 miles from Miller's Creek.",
      alibi: "Claims he was fishing at lower lake docks."
    }
  ],
  timeline: [
    { time: "21:00", event: "Daniel Cross departs courthouse parking deck alone" },
    { time: "21:42", event: "Toll plaza ticket timestamp logged at Exit 14" },
    { time: "22:15", event: "Local resident hears engine revving and water splash near Miller's Creek" },
    { time: "06:30, Next Day", event: "Angler discovers partially submerged car and body" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Rear-Seat Bloodstain Analysis",
      category: "photos",
      type: "Forensic Serology",
      description: "Identifies a secondary blood type in the back passenger footwell.",
      reliability: "HIGH",
      status: "unlocked",
      source: "State Forensics Bureau",
      clue: "Proves a second contributor was inside the passenger compartment."
    },
    {
      id: "E02",
      name: "Toll Ticket Timeline",
      category: "records",
      type: "Turnpike Transit Slip",
      description: "Speed analysis indicates the vehicle was driven at high speed between toll gates.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Turnpike Authority",
      clue: "Indicates haste or pursuit."
    }
  ],
  puzzles: [
    { id: "P01", name: "Drive Timeline", type: "timeline", description: "Reconstruct vehicle transit times against witness audio.", unlocks: [] },
    { id: "P02", name: "Blood Pattern Reconstruct", type: "record_check", description: "Differentiate driver transfer stain from rear passenger drop.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Daniel Cross orchestrated a staged accident." },
    { id: "H2", statement: "Cross was intercepted and assaulted prior to the vehicle entering the river." }
  ]
};

export const CASE_008 = {
  case_id: "008",
  title: "THE MAN WHO VANISHED",
  image: "assets/cases/case_008.jpg",
  genre: "missing_persons",
  status: "UNRESOLVED",
  difficulty: "HARD",
  synopsis: "Inspired by the Bryce Laspisa disappearance. Bryce vanishes after an erratic period, an extended highway drive, roadside assistance, and a rollover wreck with zero trace of his person.",
  victim: {
    name: "Bryce Laspisa",
    age: 19,
    occupation: "College Student",
    background: "Vanished following a 30-hour drive with unexplained roadside delays. Wrecked vehicle found on boat launch access."
  },
  suspects: [
    {
      id: "S01",
      name: "Unknown Roadside Contact",
      age: 40,
      occupation: "Unverified Motorist",
      relationship_to_victim: "Stranger",
      background: "Observed speaking with Bryce during his prolonged 9-hour stop at Buttonwillow.",
      alibi: "Never located or identified."
    }
  ],
  timeline: [
    { time: "Aug 28, 23:00", event: "Bryce departs Northern California driving south" },
    { time: "Aug 29, 09:00", event: "Roadside assistance delivers 3 gallons of fuel in Buttonwillow" },
    { time: "Aug 29, 12:00-21:00", event: "Bryce remains stationary in Buttonwillow for unexplained 9 hours" },
    { time: "Aug 30, 05:30", event: "Overturned SUV found at Castaic Lake; Bryce missing without personal items" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Buttonwillow Service Station Log",
      category: "records",
      type: "Dispatch Record",
      description: "Documents mechanic delivering fuel to Bryce while his vehicle sat parked for hours.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Roadside Assistance Dispatch",
      clue: "Unexplained refusal to resume travel despite full fuel tank."
    },
    {
      id: "E02",
      name: "Crash Site Telemetry & Scent Trail",
      category: "documents",
      type: "Search and Rescue Field Report",
      description: "Tracking canines follow scent from driver window down to highway truck stop, where trail abruptly halts.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Search & Rescue Canine Team",
      clue: "Indicates departure via vehicle at highway junction."
    }
  ],
  puzzles: [
    { id: "P01", name: "Last Six Hours", type: "timeline", description: "Order the erratic stops and phone calls leading to the crash.", unlocks: [] },
    { id: "P02", name: "Roadside Stop Audit", type: "record_check", description: "Audit fuel volume versus odometer progress.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Bryce voluntarily walked away to start a new life." },
    { id: "H2", statement: "Bryce's erratic behavior camouflaged third-party intervention at the truck stop." }
  ]
};

export const CASE_009 = {
  case_id: "009",
  title: "THE MAN WITH THE WRONG KEY",
  image: "assets/cases/case_009.jpg",
  genre: "cross_border_mystery",
  status: "COLD CASE",
  difficulty: "EXPERT",
  synopsis: "Inspired by Blair Adams. Blair travels across Canada and the US carrying thousands in cash and valuables, displaying extreme paranoia, and dies near Knoxville holding a key that fits no car on scene.",
  victim: {
    name: "Blair Adams",
    age: 31,
    occupation: "Construction Contractor",
    background: "Withdrew life savings, crossed international border, and was found dead in an industrial lot."
  },
  suspects: [
    {
      id: "S01",
      name: "The Missing Participant",
      age: 35,
      occupation: "Unknown Contact",
      relationship_to_victim: "Unidentified Rendezvous",
      background: "Blair booked a hotel room he never slept in, using the check-in as a potential rendezvous signal.",
      alibi: "Unidentified."
    }
  ],
  timeline: [
    { time: "July 7", event: "Blair withdraws $46,000 cash and valuables from Vancouver bank" },
    { time: "July 9", event: "Flies to Seattle, rents automobile, and travels to Knoxville, Tennessee" },
    { time: "July 10, 19:30", event: "Checks into Knoxville hotel, leaves room key on counter, never enters room" },
    { time: "July 11, 07:00", event: "Found dead at construction site; cash and jewelry scattered nearby" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Unidentified Nissan Key",
      category: "photos",
      type: "Physical Evidence",
      description: "An anomalous car key found beside Blair's hand that did not belong to his rental car.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Crime Scene Inventory",
      clue: "Key belonged to a planned meeting vehicle, indicating a planned rendezvous."
    },
    {
      id: "E02",
      name: "Currency & Valuables Inventory",
      category: "records",
      type: "Property Manifest",
      description: "US, Canadian, and German currency along with gold bullion found unlooted.",
      reliability: "HIGH",
      status: "unlocked",
      source: "County Coroner",
      clue: "Disproves straightforward robbery as primary motive."
    }
  ],
  puzzles: [
    { id: "P01", name: "The Wrong Key", type: "record_check", description: "Identify vehicle fleet matches for the anomalous key code.", unlocks: [] },
    { id: "P02", name: "Cross-Border Route", type: "timeline", description: "Map flight, rental, and fuel stops across borders.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Blair died as a result of an opportunistic encounter during a mental crisis." },
    { id: "H2", statement: "Blair was following an intricate rendezvous plan with a second missing actor." }
  ]
};

export const CASE_010 = {
  case_id: "010",
  title: "THE RIPPER FILE",
  image: "assets/cases/case_010.jpg",
  genre: "historical_noir",
  status: "ARCHIVAL INQUIRY",
  difficulty: "EXPERT",
  synopsis: "Determine whether the 1888 Whitechapel murders can legitimately be treated as the work of a single killer or if sensation and false letters unified separate crimes under one mythology.",
  victim: {
    name: "Whitechapel Victims",
    age: 43,
    occupation: "East End Residents",
    background: "Five canonical victims associated with the autumn of terror in London."
  },
  suspects: [
    {
      id: "S01",
      name: "Multiple Independent Offenders",
      age: 35,
      occupation: "Gang & Street Attackers",
      relationship_to_victim: "Street Opportunists",
      background: "Surgical differences between victims suggest distinct perpetrators combined by press panic.",
      alibi: "Victorian London underworld."
    }
  ],
  timeline: [
    { time: "Aug 31, 1888", event: "Mary Ann Nichols found in Buck's Row" },
    { time: "Sept 8, 1888", event: "Annie Chapman discovered in Hanbury Street" },
    { time: "Sept 27, 1888", event: "'Dear Boss' letter received by Central News Agency" },
    { time: "Nov 9, 1888", event: "Mary Jane Kelly discovered at Miller's Court" }
  ],
  evidence: [
    {
      id: "E01",
      name: "'Dear Boss' Letter Provenance",
      category: "documents",
      type: "Archival Correspondence",
      description: "The sensational letter that coined the name 'Jack the Ripper'.",
      reliability: "LOW (SUSPECTED JOURNALISTIC HOAX)",
      status: "unlocked",
      source: "Scotland Yard Archives",
      clue: "Manufactured media narrative to drive newspaper circulation."
    },
    {
      id: "E02",
      name: "Coroner Wound Discrepancy",
      category: "records",
      type: "Medical Inquest",
      description: "Dr. Phillips notes differing weapon blades and anatomical skill levels across cases.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Metropolitan Police Inquest",
      clue: "Challenges the single serial-offender hypothesis."
    }
  ],
  puzzles: [
    { id: "P01", name: "Victim Pattern", type: "record_check", description: "Audit surgical technique variations across the five crime scenes.", unlocks: [] },
    { id: "P02", name: "Letter Provenance", type: "statement_analysis", description: "Audit letter ink, handwriting, and postmark origins.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "A single serial offender committed all Whitechapel murders." },
    { id: "H2", statement: "Sensational journalism and copycat letters fabricated a single-killer narrative." }
  ]
};

export const CASE_011 = {
  case_id: "011",
  title: "THE AXEMAN OF NEW ORLEANS",
  image: "assets/cases/case_011.jpg",
  genre: "historical_noir",
  status: "ARCHIVAL INQUIRY",
  difficulty: "HARD",
  synopsis: "Determine whether the 1919 New Orleans attacks, the famous 'Jazz Letter', and public hysteria were produced by the same individual or weaponized by an influencer.",
  victim: {
    name: "Italian Grocery Merchants",
    age: 45,
    occupation: "Shopkeepers",
    background: "Targeted series of nocturnal intrusions occurring in grocer residences across New Orleans."
  },
  suspects: [
    {
      id: "S01",
      name: "The Jazz Letter Author",
      age: 30,
      occupation: "Anonymous Writer",
      relationship_to_victim: "Public Agitator",
      background: "Demanded jazz be played in every home on Tuesday night to avoid death.",
      alibi: "Unknown."
    }
  ],
  timeline: [
    { time: "May 1918", event: "First grocer attack reported in Upper Ninth Ward" },
    { time: "March 13, 1919", event: "Famous letter published in New Orleans Times-Picayune" },
    { time: "March 19, 1919", event: "Jazz night in New Orleans; no attacks occur" },
    { time: "Oct 1919", event: "Attacks abruptly cease without an arrest" }
  ],
  evidence: [
    {
      id: "E01",
      name: "The Times-Picayune Jazz Letter",
      category: "documents",
      type: "News Clipping",
      description: "A theatrical letter threatening attacks on homes that do not play jazz music.",
      reliability: "MEDIUM (THEATRICAL MANIPULATION)",
      status: "unlocked",
      source: "New Orleans Press Archive",
      clue: "Letter writer may be a prankster capitalizing on existing retail robberies."
    },
    {
      id: "E02",
      name: "Chiseled Door Panel Inventory",
      category: "photos",
      type: "Intrusion Analysis",
      description: "Consistent removal of lower door panels using an auger and chisel.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Police Superintendent Files",
      clue: "Demonstrates consistent mechanical intrusion technique."
    }
  ],
  puzzles: [
    { id: "P01", name: "Victim Map", type: "record_check", description: "Map grocery trade rivalries against attack locations.", unlocks: [] },
    { id: "P02", name: "The Jazz Threat", type: "statement_analysis", description: "Analyze rhetorical language of the jazz threat.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "The attacker and letter writer were the same person." },
    { id: "H2", statement: "The letter was written by a third party to terrorize the city and manipulate police attention." }
  ]
};

export const CASE_012 = {
  case_id: "012",
  title: "THE CLIENT WHO NEVER EXISTED",
  image: "assets/cases/case_012.jpg",
  genre: "identity_reconstruction",
  status: "ACTIVE INVESTIGATION",
  difficulty: "EXPERT",
  synopsis: "Victim Mike Mercer meets an anonymous client known as 'Steven' at an isolated property. Post-mortem wallet and digital trails reveal that 'Steven' is a fabricated persona.",
  victim: {
    name: "Mike Mercer",
    age: 34,
    occupation: "Commercial Real Estate Broker",
    background: "Found dead at an isolated vacant property after scheduling a late-evening client walkthrough."
  },
  suspects: [
    {
      id: "S01",
      name: "'Steven' (Constructed Persona)",
      age: 40,
      occupation: "Fabricated Investor",
      relationship_to_victim: "Client Alias",
      background: "Burner phones and untraceable shell company emails used to lure Mercer.",
      alibi: "Entity does not exist."
    },
    {
      id: "S02",
      name: "Graham Foster",
      age: 42,
      occupation: "Rival Brokerage Partner",
      relationship_to_victim: "Business Competitor",
      background: "Purchased the burner phone SIM card used to contact Mercer under Steven's name.",
      alibi: "Claims he was attending an out-of-town conference."
    }
  ],
  timeline: [
    { time: "16:00", event: "Mike receives call from 'Steven' requesting immediate secluded showing" },
    { time: "18:45", event: "Mike arrives alone at isolated lakeside parcel" },
    { time: "20:00", event: "Burner phone sends confirmation text: 'Walkthrough complete'" },
    { time: "23:00", event: "Mike fails to return home; police dispatched to vacant property" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Burner SIM Card Retail Receipt",
      category: "documents",
      type: "Purchase Record",
      description: "Security footage shows Graham Foster purchasing the SIM card used by 'Steven'.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Convenience Store CCTV",
      clue: "Directly unmasks the creator behind the 'Steven' identity."
    },
    {
      id: "E02",
      name: "Post-Mortem Text Telemetry",
      category: "records",
      type: "Cell Tower Data",
      description: "Text sent from Mike's phone after coroner's time of death, mimicking his writing style.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Telecom Audit",
      clue: "Proves killer retained victim's phone to simulate life."
    }
  ],
  puzzles: [
    { id: "P01", name: "Client Contact Graph", type: "relationship_mapping", description: "Map dummy company accounts to true IP owners.", unlocks: [] },
    { id: "P02", name: "Property Timeline", type: "timeline", description: "Reconcile medical time of death with phone ping sequence.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Steven was a real client who panicked during an altercation." },
    { id: "H2", statement: "'Steven' was a fabricated phantom created by Foster to lure Mercer to a remote location." }
  ]
};

export const CASE_013 = {
  case_id: "013",
  title: "THE OFFICER WITH TWO LIVES",
  image: "assets/cases/case_013.jpg",
  genre: "internal_corruption",
  status: "INTERNAL AFFAIRS",
  difficulty: "HARD",
  synopsis: "Sergeant Daniel Mercer's service weapon and police radio go missing from the precinct lockup, unveiling a concealed private life and conflicting duty rosters.",
  victim: {
    name: "Sergeant Daniel Mercer",
    age: 46,
    occupation: "Precinct Patrol Sergeant",
    background: "Found wounded in an off-duty vehicle. Service weapon pawned across county lines."
  },
  suspects: [
    {
      id: "S01",
      name: "Officer Keith Bradley",
      age: 38,
      occupation: "Evidence Custodian",
      relationship_to_victim: "Squad Partner",
      background: "Had access to arms locker. Fabricated armory maintenance records.",
      alibi: "On shift at precinct desk."
    }
  ],
  timeline: [
    { time: "16:00", event: "Daniel Mercer signs out service sidearm #904" },
    { time: "19:30", event: "Radio dispatch loses contact with Mercer's unit" },
    { time: "21:00", event: "Weapon #904 recorded on pawn shop digital intake log" },
    { time: "22:15", event: "Mercer discovered wounded at suburban safehouse" }
  ],
  evidence: [
    {
      id: "E01",
      name: "Pawn Intake Telemetry",
      category: "records",
      type: "Pawn Registry",
      description: "Shows weapon deposited under Mercer's second alias identity.",
      reliability: "HIGH",
      status: "unlocked",
      source: "County Pawn Database",
      clue: "Connects off-duty financial problems directly to missing department hardware."
    },
    {
      id: "E02",
      name: "Armory Sign-Out Log",
      category: "documents",
      type: "Duty Roster",
      description: "Altered serial numbers indicate Bradley swapped weapons before Mercer's shift.",
      reliability: "HIGH",
      status: "unlocked",
      source: "Internal Affairs Audit",
      clue: "Points toward an organized internal supply leak."
    }
  ],
  puzzles: [
    { id: "P01", name: "Service Equipment Audit", type: "record_check", description: "Trace custody chain of service weapon #904.", unlocks: [] },
    { id: "P02", name: "Secret-Life Timeline", type: "timeline", description: "Reconstruct off-duty travel vs logged patrol sectors.", unlocks: [] }
  ],
  hypotheses: [
    { id: "H1", statement: "Mercer was selling police hardware independently." },
    { id: "H2", statement: "Mercer was framed by Bradley to hide an armory embezzlement ring." }
  ]
};

// All 14 Cases Array
export const ALL_CASES = [
  CASE_014, // The Man Who Moved (Full core data)
  CASE_001, // The Last Voyage
  CASE_002, // The Evidence Room
  CASE_003, // The Man From the Bar
  CASE_004, // The Sealed Corridor
  CASE_005, // The False Blood
  CASE_006, // The $10 Question
  CASE_007, // The Last Drive
  CASE_008, // The Man Who Vanished
  CASE_009, // The Man With the Wrong Key
  CASE_010, // The Ripper File
  CASE_011, // The Axeman of New Orleans
  CASE_012, // The Client Who Never Existed
  CASE_013  // The Officer With Two Lives
];

export function getCaseById(caseId) {
  // Normalize e.g. "14" or "014" or 14
  const normalizedId = String(caseId).padStart(3, '0');
  return ALL_CASES.find(c => c.case_id === normalizedId) || ALL_CASES[0];
}
