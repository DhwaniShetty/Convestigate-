/**
 * GameState - Central Single Source of Truth
 * Keeps shared reactive state for the investigation.
 */
import { eventBus, EVENTS } from './eventBus.js';

class GameState {
  constructor() {
    this.state = {
      currentCaseId: '014',
      currentCase: null,
      currentScreen: 'LANDING', // LANDING, LOBBY, BRIEFING, DASHBOARD, EVIDENCE, SUSPECTS, BOARD, PUZZLES, FINAL_INVESTIGATION, FINAL_ANSWER, RESULTS
      activeDashboardTab: 'overview',
      
      // Multiplayer Lobby Mock State
      lobby: {
        gameId: 'CONV-8492',
        playerName: 'Detective Cross',
        isHost: true,
        players: [
          { name: 'Detective Cross', status: 'Ready', isHost: true },
          { name: 'Investigator Miller', status: 'Ready', isHost: false }
        ]
      },

      // Evidence tracking: id -> { ...data, status: 'locked'|'unlocked'|'investigated' }
      evidenceMap: {},
      
      // Suspects list
      suspects: [],
      
      // Timeline events
      timeline: [],
      
      // User connections: array of { from, to, status, custom: boolean }
      connections: [],
      
      // Puzzle completion tracking: { P01: false, P02: false, P03: false, P04: false, P05: false }
      puzzleProgress: {
        P01: false,
        P02: false,
        P03: false,
        P04: false,
        P05: false
      },
      
      // AI Interaction State
      ai: {
        state: 'CALM', // CALM, EXCITED, DEFENSIVE, THREATENED, PANIC, VANISHED
        messages: [
          { sender: 'assistant', text: 'Welcome to the case files. Review the initial docket and begin examining the evidence chain.' }
        ],
        hintsRemaining: 3,
        countdownSeconds: 1799, // 29:59 countdown
        timerInterval: null
      },
      
      // Persistent Investigation Notes
      notes: [
        { id: 1, text: 'Initial note: Review timeline consistency between jogger and phone tower records.', timestamp: 'Just now' }
      ],
      
      // Final Verdict
      finalAnswer: {
        suspectId: null,
        hypothesisId: null,
        selectedEvidenceIds: [],
        reasoningText: ''
      },

      // Results
      results: null
    };

    this.subscribers = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    });
  }

  setScreen(screen) {
    this.state.currentScreen = screen;
    eventBus.emit(EVENTS.SCREEN_CHANGED, { screen });
    this.notify();
  }

  loadCase(caseData) {
    this.state.currentCaseId = caseData.case_id;
    this.state.currentCase = caseData;
    
    // Setup evidence map
    const evidenceMap = {};
    (caseData.evidence || []).forEach(ev => {
      evidenceMap[ev.id] = {
        ...ev,
        status: ev.status || (ev.unlocked_by ? 'locked' : 'unlocked')
      };
    });
    this.state.evidenceMap = evidenceMap;
    this.state.suspects = caseData.suspects || [];
    this.state.timeline = (caseData.timeline || []).map((t, idx) => ({ ...t, originalIndex: idx }));
    this.state.connections = (caseData.puzzles?.find(p => p.type === 'relationship_mapping')?.connections || []).map(c => ({
      ...c,
      id: `${c.from}-${c.to}`
    }));

    // Reset puzzle progress for new case
    this.state.puzzleProgress = {
      P01: false,
      P02: false,
      P03: false,
      P04: false,
      P05: false
    };

    // Reset AI
    this.setAIState('CALM');
    this.state.ai.messages = [
      { sender: 'assistant', text: `Case docket loaded: "${caseData.title}". Let me know when you are ready to evaluate the first clue.` }
    ];

    eventBus.emit(EVENTS.CASE_STARTED, { caseId: caseData.case_id, title: caseData.title });
    this.notify();
  }

  unlockEvidence(evidenceId) {
    if (this.state.evidenceMap[evidenceId]) {
      this.state.evidenceMap[evidenceId].status = 'unlocked';
      eventBus.emit(EVENTS.EVIDENCE_DISCOVERED, { evidenceId });
      this.notify();
    }
  }

  openEvidence(evidenceId) {
    if (this.state.evidenceMap[evidenceId]) {
      if (this.state.evidenceMap[evidenceId].status !== 'investigated') {
        this.state.evidenceMap[evidenceId].status = 'investigated';
      }
      eventBus.emit(EVENTS.EVIDENCE_OPENED, { evidenceId });
      this.notify();
    }
  }

  setAIState(newState) {
    const validStates = ['CALM', 'EXCITED', 'DEFENSIVE', 'THREATENED', 'PANIC', 'VANISHED'];
    if (!validStates.includes(newState)) return;

    this.state.ai.state = newState;
    eventBus.emit(EVENTS.AI_STATE_CHANGED, { newState });

    if (newState === 'PANIC') {
      eventBus.emit(EVENTS.AI_PANIC);
    } else if (newState === 'VANISHED') {
      eventBus.emit(EVENTS.AI_VANISHED);
      this.startCountdown();
    }
    this.notify();
  }

  startCountdown() {
    if (this.state.ai.timerInterval) clearInterval(this.state.ai.timerInterval);
    eventBus.emit(EVENTS.COUNTDOWN_STARTED);
    this.state.ai.timerInterval = setInterval(() => {
      if (this.state.ai.countdownSeconds > 0) {
        this.state.ai.countdownSeconds -= 1;
        this.notify();
      } else {
        clearInterval(this.state.ai.timerInterval);
      }
    }, 1000);
  }

  addAIMessage(sender, text) {
    this.state.ai.messages.push({ sender, text });
    this.notify();
  }

  requestAIHint(puzzleId) {
    eventBus.emit(EVENTS.AI_HINT_REQUESTED, { puzzleId });
    let hintText = 'Notice the timeline records carefully.';
    if (puzzleId === 'P01') {
      hintText = 'Notice Lena left at 21:47 before any sighting near Northbridge Park.';
    } else if (puzzleId === 'P04') {
      hintText = 'Look at the time window between the jogger (22:10) and the phone call (22:15). Can both be right?';
    } else if (puzzleId === 'P05') {
      hintText = 'Check login credential metadata. Access does not equal physical presence.';
    }

    this.state.ai.messages.push({ sender: 'hint', text: `[SYSTEM HINT]: ${hintText}` });
    eventBus.emit(EVENTS.AI_HINT_GIVEN, { hintText });
    this.notify();
  }

  completePuzzle(puzzleId) {
    this.state.puzzleProgress[puzzleId] = true;
    eventBus.emit(EVENTS.PUZZLE_COMPLETED, { puzzleId });

    // Unlock related evidence
    const puzzle = this.state.currentCase?.puzzles?.find(p => p.id === puzzleId);
    if (puzzle?.unlocks) {
      puzzle.unlocks.forEach(eid => this.unlockEvidence(eid));
    }

    // AI reactive emotional shifts
    const solvedCount = Object.values(this.state.puzzleProgress).filter(Boolean).length;
    if (solvedCount === 1) this.setAIState('EXCITED');
    if (solvedCount === 2) this.setAIState('DEFENSIVE');
    if (solvedCount === 3) this.setAIState('THREATENED');
    if (solvedCount === 4) this.setAIState('PANIC');
    if (solvedCount >= 5) this.setAIState('VANISHED');

    this.notify();
  }

  addConnection(from, to, status = 'RELEVANT') {
    const id = `${from}-${to}`;
    const exists = this.state.connections.find(c => (c.from === from && c.to === to) || (c.from === to && c.to === from));
    if (!exists) {
      this.state.connections.push({
        id,
        from,
        to,
        status,
        custom: true
      });
      eventBus.emit(EVENTS.CONNECTION_CREATED, { from, to, status });
      this.notify();
    }
  }

  removeConnection(connectionId) {
    this.state.connections = this.state.connections.filter(c => c.id !== connectionId);
    this.notify();
  }

  addNote(text) {
    if (!text.trim()) return;
    this.state.notes.unshift({
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.notify();
  }

  editNote(id, newText) {
    const note = this.state.notes.find(n => n.id === id);
    if (note) {
      note.text = newText;
      this.notify();
    }
  }

  deleteNote(id) {
    this.state.notes = this.state.notes.filter(n => n.id !== id);
    this.notify();
  }

  submitFinalAnswer(answer) {
    this.state.finalAnswer = answer;
    
    // Evaluate reasoning based on case
    let epistemicScore = 85;
    let feedback = 'Strong evaluation: separated verified facts from fabricated correlation.';
    if (answer.suspectId === '501' && answer.hypothesisId === 'H1') {
      epistemicScore = 40;
      feedback = 'Premature conclusion: fell into the fabricated pattern trap without verifying credential logs.';
    } else if (answer.hypothesisId === 'H4' || answer.hypothesisId === 'H5') {
      epistemicScore = 95;
      feedback = 'Excellent epistemic discipline: recognized the false pattern while respecting the evidence gaps.';
    }

    this.state.results = {
      score: epistemicScore,
      feedback,
      puzzlesSolved: Object.values(this.state.puzzleProgress).filter(Boolean).length,
      evidenceInvestigated: Object.values(this.state.evidenceMap).filter(e => e.status === 'investigated').length,
      timestamp: new Date().toLocaleString()
    };

    this.setScreen('RESULTS');
  }
}

export const gameState = new GameState();
