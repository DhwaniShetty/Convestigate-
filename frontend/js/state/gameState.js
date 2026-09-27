/**
 * GameState - Central Single Source of Truth
 * Keeps shared reactive state for the investigation.
 */
import { eventBus, EVENTS } from './eventBus.js';
import { createSession, getCaseDetails, getSessionState, sendAIMessage,
  requestHint, submitFinalReasoning, inspectEvidence } from '../utils/api.js';

export class GameState {
  constructor() {
    this.state = {
      currentCaseId: '014',
      sessionId: null,
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
        chatPending: false,
        hintPending: false,
        draft: '',
        error: null,
        gameOver: false,
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
      finalPending: false,
      finalError: null,
      results: null
    };

    this.subscribers = new Set();
    this.caseVersion = 0;
    this.sessionRequest = null;
    this.puzzleRequests = new Map();
    this.evidenceRequests = new Map();
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
    if (['FINAL_INVESTIGATION', 'FINAL_ANSWER'].includes(screen) && !this.allPuzzlesSolved()) return;
    if (screen === 'DASHBOARD' && !this.state.sessionId) screen = 'BRIEFING';
    this.state.currentScreen = screen;
    eventBus.emit(EVENTS.SCREEN_CHANGED, { screen });
    this.notify();
  }

  loadCase(caseData) {
    this.caseVersion += 1;
    this.puzzleRequests.clear();
    this.evidenceRequests.clear();
    this.state.evidenceErrors = {};
    this.state.notes = [];
    caseData = structuredClone(caseData);
    this.sessionRequest = null;
    this.state.sessionId = null;
    this.state.results = null;
    this.state.finalPending = false;
    this.state.finalError = null;
    this.state.finalAnswer = { suspectId: null, hypothesisId: null, selectedEvidenceIds: [], reasoningText: '' };
    if (this.state.ai.timerInterval) clearInterval(this.state.ai.timerInterval);
    this.state.ai = {
      state: 'CALM', messages: [], hintsRemaining: 3, countdownSeconds: 1799,
      timerInterval: null, chatPending: false, hintPending: false,
      draft: '', error: null, gameOver: false
    };
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

  requestContext(puzzleId = null) {
    return { version: this.caseVersion, sessionId: this.state.sessionId,
      caseId: this.state.currentCaseId, puzzleId };
  }

  isCurrentRequest(context) {
    return context.version === this.caseVersion &&
      context.sessionId === this.state.sessionId && context.caseId === this.state.currentCaseId;
  }

  allPuzzlesSolved() {
    const puzzles = this.state.currentCase?.puzzles || [];
    return !!this.state.sessionId && puzzles.length === 5 &&
      puzzles.every(p => this.state.puzzleProgress[p.id]);
  }

  isPuzzleAvailable(id) {
    const puzzles = this.state.currentCase?.puzzles || [];
    const index = puzzles.findIndex(p => p.id === id);
    return !!this.state.sessionId && index >= 0 &&
      puzzles.slice(0, index).every(p => this.state.puzzleProgress[p.id]);
  }

  applySessionProgress(response) {
    if (response.session_id !== this.state.sessionId ||
        String(response.case_id).padStart(3, '0') !== this.state.currentCaseId ||
        !Array.isArray(response.solved_puzzle_ids)) {
      throw new Error('The server returned mismatched session progress.');
    }
    for (const p of this.state.currentCase.puzzles) {
      this.state.puzzleProgress[p.id] = response.solved_puzzle_ids.includes(p.id);
    }
    for (const e of Object.values(this.state.evidenceMap)) {
      e.status = response.inspected_evidence?.includes(e.id) ? 'investigated' :
        response.unlocked_evidence?.includes(e.id) ? 'unlocked' : 'locked';
    }
    this.applyAIResponse(response);
  }

  async submitPuzzle(puzzleId, request) {
    const context = this.requestContext(puzzleId);
    if (!this.isPuzzleAvailable(puzzleId)) throw new Error('Complete the preceding puzzles first.');
    if (this.puzzleRequests.has(puzzleId)) return null;
    this.puzzleRequests.set(puzzleId, context);
    try {
      const result = await request();
      if (!this.isCurrentRequest(context)) return null;
      if (typeof result?.correct !== 'boolean') throw new Error('Invalid puzzle response.');
      if (result.correct) {
        const progress = await getSessionState(context.sessionId);
        if (!this.isCurrentRequest(context)) return null;
        if (!progress.solved_puzzle_ids?.includes(puzzleId)) throw new Error('The server has not confirmed puzzle completion.');
        this.applySessionProgress(progress);
        eventBus.emit(EVENTS.PUZZLE_COMPLETED, { puzzleId });
        this.notify();
      }
      return result;
    } catch (error) {
      if (!this.isCurrentRequest(context)) return null;
      throw error;
    } finally {
      if (this.puzzleRequests.get(puzzleId) === context) this.puzzleRequests.delete(puzzleId);
    }
  }

  async openEvidence(evidenceId) {
    const context = this.requestContext();
    const evidence = this.state.evidenceMap[evidenceId];
    if (!evidence || evidence.status === 'locked' || !context.sessionId) return false;
    if (evidence.status === 'investigated') return true;
    if (this.evidenceRequests.has(evidenceId)) return this.evidenceRequests.get(evidenceId);
    this.state.evidenceErrors ||= {};
    delete this.state.evidenceErrors[evidenceId];
    const pending = (async () => {
      try {
        const result = await inspectEvidence(context.sessionId, evidenceId);
        if (!this.isCurrentRequest(context)) return false;
        if (result.evidence_id !== evidenceId || !result.inspected_evidence?.includes(evidenceId)) {
          throw new Error('The server did not confirm this evidence inspection.');
        }
        evidence.status = 'investigated';
        eventBus.emit(EVENTS.EVIDENCE_OPENED, { evidenceId });
        return true;
      } catch (error) {
        if (this.isCurrentRequest(context)) this.state.evidenceErrors[evidenceId] = error.message;
        return false;
      } finally {
        if (this.isCurrentRequest(context)) this.evidenceRequests.delete(evidenceId);
      }
    })();
    this.evidenceRequests.set(evidenceId, pending);
    return pending;
  }

  setAIState(newState) {
    const validStates = ['CALM', 'COMFORTABLE', 'EXCITED', 'DEFENSIVE', 'THREATENED', 'PANIC', 'VANISHED'];
    if (!validStates.includes(newState) || this.state.ai.state === newState) return;

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

  async ensureSession() {
    if (this.state.sessionId) return this.state.sessionId;
    if (this.sessionRequest) return this.sessionRequest;
    const version = this.caseVersion;
    const caseId = this.state.currentCaseId;
    this.sessionRequest = (async () => {
      const details = await getCaseDetails(caseId);
      if (version !== this.caseVersion) throw new Error('The selected case changed. Please try again.');
      const session = await createSession(caseId, 2, this.state.lobby.playerName);
      if (version !== this.caseVersion) throw new Error('The selected case changed. Please try again.');
      if (String(session.case_id).padStart(3, '0') !== String(caseId).padStart(3, '0')) {
        throw new Error('The server returned a session for another case.');
      }
      this.state.sessionId = session.session_id;
      // Display the same hypotheses the backend will evaluate, without their hidden outcomes.
      this.state.currentCase.hypotheses = details.hypotheses || [];
      this.applyAIResponse(session);
      if (session.solved_puzzle_ids) this.applySessionProgress(session);
      this.notify();
      return session.session_id;
    })();
    try {
      return await this.sessionRequest;
    } finally {
      if (version === this.caseVersion) this.sessionRequest = null;
    }
  }

  applyAIResponse(response) {
    const ai = this.state.ai;
    if (Number.isInteger(response.hints_remaining)) ai.hintsRemaining = Math.max(0, response.hints_remaining);
    else if (Number.isInteger(response.hints_used)) ai.hintsRemaining = Math.max(0, 3 - response.hints_used);
    if (typeof response.game_over === 'boolean') ai.gameOver = response.game_over;
    if (response.ai_vanished) this.setAIState('VANISHED');
    else if (response.ai_state) this.setAIState(response.ai_state);
    if (response.countdown_active && !ai.timerInterval) this.startCountdown();
  }

  async refreshAI() {
    const sid = this.state.sessionId;
    const ai = this.state.ai;
    if (!sid) return;
    try {
      const response = await getSessionState(sid);
      if (sid !== this.state.sessionId || ai !== this.state.ai) return;
      ai.error = null;
      this.applyAIResponse(response);
    } catch (error) {
      if (ai !== this.state.ai) return;
      ai.error = error.message;
    }
    this.notify();
  }

  async sendAIMessage(message) {
    const ai = this.state.ai;
    if (ai.chatPending || ai.hintPending || ai.gameOver || ai.state === 'VANISHED' || !message.trim()) return;
    const sid = this.state.sessionId;
    ai.chatPending = true;
    ai.error = null;
    ai.draft = message;
    this.notify();
    try {
      const response = await sendAIMessage(sid, message.trim());
      if (sid !== this.state.sessionId || ai !== this.state.ai) return;
      if (typeof response.response !== 'string') throw new Error('The server returned no AI response.');
      ai.messages.push({ sender: 'user', text: message.trim() }, { sender: 'assistant', text: response.response });
      ai.draft = '';
      this.applyAIResponse(response);
    } catch (error) {
      if (ai !== this.state.ai) return;
      ai.error = error.message;
    } finally {
      if (ai === this.state.ai) {
        ai.chatPending = false;
        this.notify();
      }
    }
  }

  async requestAIHint(puzzleId) {
    const ai = this.state.ai;
    if (ai.chatPending || ai.hintPending || ai.hintsRemaining <= 0 || ai.gameOver || ai.state === 'VANISHED') return;
    const sid = this.state.sessionId;
    ai.hintPending = true;
    ai.error = null;
    eventBus.emit(EVENTS.AI_HINT_REQUESTED, { puzzleId });
    this.notify();
    try {
      const response = await requestHint(sid, puzzleId);
      if (sid !== this.state.sessionId || ai !== this.state.ai) return;
      if (typeof response.hint !== 'string') throw new Error('The server returned no hint.');
      this.applyAIResponse(response);
      ai.messages.push({ sender: 'hint', text: response.hint });
      eventBus.emit(EVENTS.AI_HINT_GIVEN, { hintText: response.hint });
    } catch (error) {
      if (ai !== this.state.ai) return;
      ai.error = error.message;
    } finally {
      if (ai === this.state.ai) {
        ai.hintPending = false;
        this.notify();
      }
    }
  }

  completePuzzle(puzzleId) {
    this.state.puzzleProgress[puzzleId] = true;
    eventBus.emit(EVENTS.PUZZLE_COMPLETED, { puzzleId });

    // Unlock related evidence
    const puzzle = this.state.currentCase?.puzzles?.find(p => p.id === puzzleId);
    if (puzzle?.unlocks) {
      puzzle.unlocks.forEach(eid => this.unlockEvidence(eid));
    }

    // Puzzle routes update the backend AI; use its state rather than a local mood schedule.
    void this.refreshAI();

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

  clearConnections() {
    this.state.connections = [];
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

  async submitFinalAnswer(answer) {
    if (!this.allPuzzlesSolved()) {
      this.state.finalError = 'Complete all five puzzles before submitting final reasoning.';
      this.notify();
      return;
    }
    if (this.state.finalPending || this.state.results) return;
    this.state.finalAnswer = { ...answer };
    this.state.finalError = null;
    if (!answer.hypothesisId || !answer.reasoningText?.trim()) {
      this.state.finalError = 'Select a hypothesis and enter your reasoning before submitting.';
      this.notify();
      return;
    }
    const sid = this.state.sessionId;
    const version = this.caseVersion;
    this.state.finalPending = true;
    this.notify();
    try {
      const result = await submitFinalReasoning(sid, answer.hypothesisId, answer.reasoningText);
      if (sid !== this.state.sessionId || version !== this.caseVersion) return;
      if (!['SUPPORTED', 'CONTRADICTED', 'NOT_ESTABLISHED'].includes(result.hypothesis_result)) {
        throw new Error('The server returned no valid verdict.');
      }
      this.applyAIResponse(result);
      this.state.results = {
        hypothesisResult: result.hypothesis_result,
        hypothesisStatement: result.hypothesis_statement,
        feedback: result.hypothesis_result.replaceAll('_', ' '),
        puzzlesSolved: result.solved_puzzles.length,
        evidenceInvestigated: Object.values(this.state.evidenceMap).filter(e => e.status === 'investigated').length,
        timestamp: new Date().toLocaleString()
      };
      this.setScreen('RESULTS');
    } catch (error) {
      if (version === this.caseVersion) this.state.finalError = error.message;
    } finally {
      if (version === this.caseVersion) {
        this.state.finalPending = false;
        this.notify();
      }
    }
  }
}

export const gameState = new GameState();
