/**
 * GameState - Central Single Source of Truth
 * Keeps shared reactive state for the investigation.
 */
import { eventBus, EVENTS } from './eventBus.js';
import {
  getSessionState,
  requestHint,
  sendAIMessage as sendAIMessageRequest,
  submitFinalReasoning
} from '../utils/api.js';

const readSessionValue = key => globalThis.sessionStorage?.getItem(key) ?? null;
const writeSessionValue = (key, value) => globalThis.sessionStorage?.setItem(key, value);
const removeSessionValue = key => globalThis.sessionStorage?.removeItem(key);

export class GameState {
  constructor() {
    const savedSessionId = readSessionValue('conv_session_id');
    const savedCaseId = readSessionValue('conv_case_id') || '014';
    const savedScreen = readSessionValue('conv_current_screen') || 'LANDING';
    const timerCaseId = readSessionValue('conv_timer_case_id');
    const savedDeadline = Number(readSessionValue('conv_timer_deadline_at'));

    this.state = {
      currentCaseId: savedCaseId,
      sessionId: savedSessionId,
      sessionNotice: null,
      currentCase: null,
      currentScreen: savedSessionId ? savedScreen : 'LANDING',
      investigationTimer: {
        deadlineAt: timerCaseId === savedCaseId && Number.isFinite(savedDeadline) && savedDeadline > 0 ? savedDeadline : null,
        interval: null,
        expired: false
      },
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
        timerInterval: null,
        chatPending: false,
        hintPending: false,
        error: null,
        draft: ''
      },
      finalPending: false,
      finalError: null,
      evidenceErrors: {},
      
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
    this.sessionPromise = null;
    this.requestSequence = 0;
  }

  getState() {
    return this.state;
  }

  setSessionId(id, deadlineAtMs = null) {
    if (id && id !== this.state.sessionId) this.stopInvestigationTimer(true);
    this.state.sessionId = id;
    if (id) {
      writeSessionValue('conv_session_id', id);
      this.state.sessionNotice = null;
      if (deadlineAtMs) {
        this.state.investigationTimer.deadlineAt = Number(deadlineAtMs);
        this.state.investigationTimer.expired = false;
        writeSessionValue('conv_timer_case_id', this.state.currentCaseId);
        writeSessionValue('conv_timer_deadline_at', String(deadlineAtMs));
      }
    } else {
      removeSessionValue('conv_session_id');
    }
    if (id && this.state.investigationTimer.deadlineAt) this.startInvestigationTimer();
    this.notify();
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
    if (screen === 'FINAL_INVESTIGATION' && !this.allPuzzlesSolved()) {
      screen = 'DASHBOARD';
    }
    this.state.currentScreen = screen;
    writeSessionValue('conv_current_screen', screen);
    eventBus.emit(EVENTS.SCREEN_CHANGED, { screen });
    this.notify();
  }

  loadCase(caseData) {
    const caseChanged = this.state.currentCaseId && this.state.currentCaseId !== caseData.case_id;
    if (caseChanged) {
      this.stopInvestigationTimer(true);
      this.setSessionId(null);
      this.state.results = null;
      this.state.finalAnswer = { suspectId: null, hypothesisId: null, selectedEvidenceIds: [], reasoningText: '' };
      this.state.finalPending = false;
      this.state.finalError = null;
      this.state.evidenceErrors = {};
      this.state.ai.hintsRemaining = 3;
    }
    this.state.currentCaseId = caseData.case_id;
    writeSessionValue('conv_case_id', caseData.case_id);
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

    this.state.results = null;

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

  async ensureSession() {
    if (this.state.sessionId) return this.state.sessionId;
    if (this.sessionPromise) return this.sessionPromise;
    const caseId = this.state.currentCaseId;
    this.sessionPromise = (async () => {
      const canonical = await fetch(`${'http://127.0.0.1:8000'}/cases/${caseId}`).then(async response => {
        if (!response.ok) throw new Error('Unable to load the selected case.');
        return response.json();
      });
      const { createSession } = await import('../utils/api.js');
      const session = await createSession(caseId, 1, this.state.lobby.playerName);
      if (this.state.currentCaseId !== caseId) return null;
      this.loadCase({ ...this.state.currentCase, ...canonical, case_id: caseId });
      this.setSessionId(session.session_id, session.deadline_at_ms);
      return session.session_id;
    })().finally(() => { this.sessionPromise = null; });
    return this.sessionPromise;
  }

  async restoreSavedSession() {
    const sessionId = this.state.sessionId;
    if (!sessionId) return false;
    try {
      const progress = await getSessionState(sessionId);
      if (sessionId !== this.state.sessionId) return false;
      if (progress.case_id !== this.state.currentCaseId) {
        this.recoverLostSession({ status: 404 }, sessionId);
        return false;
      }
      if (progress.deadline_at_ms) {
        this.state.investigationTimer.deadlineAt = Number(progress.deadline_at_ms);
        writeSessionValue('conv_timer_case_id', this.state.currentCaseId);
        writeSessionValue('conv_timer_deadline_at', String(progress.deadline_at_ms));
      }
      if (progress.expired) {
        this.expireInvestigation();
        return false;
      }
      this.applyProgress(progress);
      return true;
    } catch (error) {
      if (error.status === 404) this.recoverLostSession(error, sessionId);
      return false;
    }
  }

  recoverLostSession(error, sessionId = this.state.sessionId) {
    if (error.status !== 404 || !sessionId || sessionId !== this.state.sessionId) return false;
    this.stopInvestigationTimer(true);
    this.state.results = null;
    this.state.finalPending = false;
    this.state.finalError = null;
    this.state.ai.error = null;
    this.state.sessionNotice = 'Your previous investigation session is no longer available. Open the case briefing to start a fresh 15-minute run.';
    this.state.currentScreen = 'LANDING';
    writeSessionValue('conv_current_screen', 'LANDING');
    this.setSessionId(null);
    return true;
  }

  isPuzzleAvailable(puzzleId) {
    const puzzles = this.state.currentCase?.puzzles || [];
    const index = puzzles.findIndex(puzzle => puzzle.id === puzzleId);
    return index >= 0 && (index === 0 || this.state.puzzleProgress[puzzles[index - 1].id] === true);
  }

  allPuzzlesSolved() {
    const puzzles = this.state.currentCase?.puzzles || [];
    return puzzles.length > 0 && puzzles.every(puzzle => this.state.puzzleProgress[puzzle.id] === true);
  }

  async submitPuzzle(puzzleId, submit) {
    const sessionId = this.state.sessionId;
    const caseId = this.state.currentCaseId;
    const token = ++this.requestSequence;
    let result;
    try {
      result = await submit();
    } catch (error) {
      if (token !== this.requestSequence || sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return null;
      if (error.code === 'CASE_EXPIRED') this.expireInvestigation();
      else if (this.recoverLostSession(error, sessionId)) return null;
      throw error;
    }
    if (token !== this.requestSequence || sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return null;
    if (!result?.correct) return result;
    const progress = await getSessionState(sessionId);
    if (token !== this.requestSequence || sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return null;
    if (progress.case_id !== caseId) throw new Error('The server returned progress for a mismatched case.');
    this.applyProgress(progress);
    return result;
  }

  applyProgress(progress) {
    const solved = new Set(progress.solved_puzzle_ids || []);
    for (const puzzle of this.state.currentCase?.puzzles || []) {
      this.state.puzzleProgress[puzzle.id] = solved.has(puzzle.id);
    }
    for (const evidenceId of progress.unlocked_evidence || []) this.unlockEvidence(evidenceId);
    for (const evidenceId of progress.inspected_evidence || []) {
      if (this.state.evidenceMap[evidenceId]) this.state.evidenceMap[evidenceId].status = 'investigated';
    }
    if (progress.ai_state) this.state.ai.state = progress.ai_state;
    this.notify();
  }

  async sendAIMessage(message) {
    if (this.state.ai.chatPending) return;
    if (!this.state.sessionId) { this.state.ai.error = 'Start an investigation before contacting the AI.'; this.notify(); return; }
    const sessionId = this.state.sessionId, caseId = this.state.currentCaseId;
    this.state.ai.chatPending = true;
    this.state.ai.draft = message;
    this.state.ai.error = null;
    this.notify();
    try {
      const reply = await sendAIMessageRequest(sessionId, message);
      if (sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return;
      this.state.ai.messages.push({ sender: 'user', text: message }, { sender: 'assistant', text: reply.response });
      if (reply.ai_state) this.state.ai.state = reply.ai_state;
      this.state.ai.draft = '';
    } catch (error) {
      if (sessionId === this.state.sessionId && caseId === this.state.currentCaseId) {
        if (error.code === 'CASE_EXPIRED') this.expireInvestigation();
        else if (this.recoverLostSession(error, sessionId)) return;
        else this.state.ai.error = error.message;
      }
    } finally {
      this.state.ai.chatPending = false;
      this.notify();
    }
  }

  async requestAIHint(puzzleId) {
    if (this.state.ai.hintPending || this.state.ai.hintsRemaining <= 0 || !this.state.sessionId) return;
    const sessionId = this.state.sessionId, caseId = this.state.currentCaseId;
    this.state.ai.hintPending = true;
    this.state.ai.error = null;
    this.notify();
    try {
      const result = await requestHint(sessionId, puzzleId);
      if (sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return;
      this.state.ai.hintsRemaining = result.hints_remaining ?? Math.max(0, this.state.ai.hintsRemaining - 1);
      this.state.ai.messages.push({ sender: 'hint', text: result.hint });
      if (result.ai_state) this.state.ai.state = result.ai_state;
      eventBus.emit(EVENTS.AI_HINT_GIVEN, { hintText: result.hint });
    } catch (error) {
      if (sessionId === this.state.sessionId && caseId === this.state.currentCaseId) {
        if (error.code === 'CASE_EXPIRED') this.expireInvestigation();
        else if (this.recoverLostSession(error, sessionId)) return;
        else this.state.ai.error = error.message;
      }
    } finally {
      this.state.ai.hintPending = false;
      this.notify();
    }
  }

  async openEvidence(evidenceId) {
    const evidence = this.state.evidenceMap[evidenceId];
    if (!evidence) return false;
    if (evidence.status === 'investigated') return true;
    if (!this.state.sessionId) return false;
    const sessionId = this.state.sessionId, caseId = this.state.currentCaseId;
    try {
      const response = await fetch(`http://127.0.0.1:8000/sessions/${encodeURIComponent(sessionId)}/evidence/${encodeURIComponent(evidenceId)}`, { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(result.detail || 'Could not inspect evidence.');
        error.status = response.status;
        if (response.status === 410 && result.expired) error.code = 'CASE_EXPIRED';
        throw error;
      }
      if (sessionId !== this.state.sessionId || caseId !== this.state.currentCaseId) return false;
      evidence.status = 'investigated';
      delete this.state.evidenceErrors[evidenceId];
      this.notify();
      return true;
    } catch (error) {
      if (sessionId === this.state.sessionId && caseId === this.state.currentCaseId) {
        if (error.code === 'CASE_EXPIRED') this.expireInvestigation();
        else if (this.recoverLostSession(error, sessionId)) return false;
        else this.state.evidenceErrors[evidenceId] = error.message;
      }
      this.notify();
      return false;
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

  startInvestigationTimer() {
    const timer = this.state.investigationTimer;
    let startedNow = false;
    if (!timer.deadlineAt) {
      timer.deadlineAt = Date.now() + 15 * 60 * 1000;
      writeSessionValue('conv_timer_case_id', this.state.currentCaseId);
      writeSessionValue('conv_timer_deadline_at', String(timer.deadlineAt));
      startedNow = true;
    }
    if (!timer.interval) timer.interval = setInterval(() => this.updateInvestigationTimerDisplay(), 250);
    this.updateInvestigationTimerDisplay();
    if (startedNow) this.notify();
  }

  stopInvestigationTimer(reset = false) {
    const timer = this.state.investigationTimer;
    if (timer.interval) clearInterval(timer.interval);
    timer.interval = null;
    if (reset) {
      timer.deadlineAt = null;
      timer.expired = false;
      removeSessionValue('conv_timer_case_id');
      removeSessionValue('conv_timer_deadline_at');
    }
  }

  updateInvestigationTimerDisplay() {
    const timer = this.state.investigationTimer;
    if (!timer.deadlineAt || timer.expired) return;
    const remainingSeconds = Math.max(0, Math.ceil((timer.deadlineAt - Date.now()) / 1000));
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    const display = globalThis.document?.querySelector?.('#hud-investigation-timer');
    if (display) display.textContent = `${minutes}:${seconds}`;
    if (remainingSeconds === 0) this.expireInvestigation();
  }

  expireInvestigation() {
    if (this.state.investigationTimer.expired) return;
    this.state.investigationTimer.expired = true;
    this.state.investigationTimer.deadlineAt = Date.now();
    writeSessionValue('conv_timer_deadline_at', String(this.state.investigationTimer.deadlineAt));
    this.stopInvestigationTimer(false);
    this.state.results = { expired: true };
    this.state.finalPending = false;
    this.state.ai.chatPending = false;
    this.state.ai.hintPending = false;
    this.state.currentScreen = 'RESULTS';
    writeSessionValue('conv_current_screen', 'RESULTS');
    eventBus.emit(EVENTS.SCREEN_CHANGED, { screen: 'RESULTS' });
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
    if (this.state.finalPending || this.state.results) return;
    this.state.finalAnswer = answer;
    this.state.finalError = null;
    if (!answer?.hypothesisId || !answer?.reasoningText?.trim()) {
      this.state.finalError = 'Select a hypothesis and enter your reasoning.';
      this.notify();
      return;
    }
    if (!this.allPuzzlesSolved()) {
      this.state.finalError = 'Complete all five puzzles before submitting your conclusion.';
      this.setScreen('DASHBOARD');
      return;
    }
    if (!this.state.sessionId) {
      this.state.finalError = 'Start an investigation before submitting your conclusion.';
      this.notify();
      return;
    }
    this.state.finalPending = true;
    this.notify();
    try {
      const result = await submitFinalReasoning(this.state.sessionId, answer.hypothesisId, answer.reasoningText);
      this.state.results = {
        hypothesisResult: result.hypothesis_result,
        hypothesisStatement: result.hypothesis_statement,
        puzzlesSolved: (result.solved_puzzles || []).length,
        feedback: result.feedback
      };
      this.state.finalAnswer = answer;
      this.state.finalError = null;
      this.setScreen('RESULTS');
    } catch (error) {
      if (error.code === 'CASE_EXPIRED') this.expireInvestigation();
      else if (this.recoverLostSession(error)) return;
      else this.state.finalError = error.message;
    } finally {
      this.state.finalPending = false;
      this.notify();
    }
  }
}

export const gameState = new GameState();
