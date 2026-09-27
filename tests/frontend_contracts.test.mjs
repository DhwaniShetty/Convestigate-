
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState, gameState } from '../frontend/js/state/gameState.js';
import { sendAIMessage, requestHint, submitFinalReasoning } from '../frontend/js/utils/api.js';
import { renderAIPanel } from '../frontend/js/components/aiPanel.js';
import { renderResultsScreen } from '../frontend/js/components/resultsScreen.js';
import { renderFinalAnswer } from '../frontend/js/components/finalAnswer.js';

globalThis.document = { querySelector: () => null };
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const state = () => {
  const game = new GameState();
  game.state.sessionId = 'session-014';
  game.state.currentCase = { case_id: '014', title: 'Case', hypotheses: [], puzzles: Array.from({length: 5}, (_, i) => ({id: 'P0' + (i + 1)})) };
  return game;
};
const container = () => ({ innerHTML: '', querySelector: () => null, querySelectorAll: () => [] });

test('three API utilities use the exact backend paths and Pydantic payloads', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push([url, options]); return response({ ok: true }); };
  await sendAIMessage('sid/a', 'Investigate');
  await requestHint('sid/a', 'P02');
  await submitFinalReasoning('sid/a', 'H4', 'Reasoning');
  assert.deepEqual(calls.map(([url]) => url), [
    'http://127.0.0.1:8000/sessions/sid%2Fa/ai',
    'http://127.0.0.1:8000/sessions/sid%2Fa/hint',
    'http://127.0.0.1:8000/sessions/sid%2Fa/final-reasoning'
  ]);
  assert.deepEqual(calls.map(([, options]) => JSON.parse(options.body)), [
    { message: 'Investigate' }, { puzzle_id: 'P02' }, { hypothesis_id: 'H4', reasoning: 'Reasoning' }
  ]);
  assert.ok(calls.every(([, options]) => options.method === 'POST'));
});

test('API errors handle network failures, non-JSON responses and validation details', async () => {
  globalThis.fetch = async () => { throw new TypeError('network'); };
  await assert.rejects(sendAIMessage('sid', 'hello'), /Cannot reach/);
  globalThis.fetch = async () => new Response('Internal Server Error', { status: 500 });
  await assert.rejects(sendAIMessage('sid', 'hello'), /could not complete/);
  globalThis.fetch = async () => response({ detail: [{ msg: 'Field required' }] }, 422);
  await assert.rejects(sendAIMessage('sid', 'hello'), /Field required/);
  assert.throws(() => sendAIMessage(null, 'hello'), /Start an investigation/);
});

test('chat displays the server response and server AI state with a loading guard', async () => {
  const game = state();
  let finish, calls = 0;
  globalThis.fetch = () => { calls++; return new Promise(resolve => { finish = resolve; }); };
  const pending = game.sendAIMessage('question');
  assert.equal(game.state.ai.chatPending, true);
  await game.sendAIMessage('duplicate');
  assert.equal(calls, 1);
  finish(response({ response: 'Server answer', ai_state: 'COMFORTABLE', ai_vanished: false }));
  await pending;
  assert.equal(game.state.ai.chatPending, false);
  assert.equal(game.state.ai.state, 'COMFORTABLE');
  assert.equal(game.state.ai.messages.at(-1).text, 'Server answer');
});

test('failed chat retains the draft without inventing a reply', async () => {
  const game = state();
  const count = game.state.ai.messages.length;
  globalThis.fetch = async () => response({ detail: 'AI service unavailable' }, 503);
  await game.sendAIMessage('keep my question');
  assert.equal(game.state.ai.draft, 'keep my question');
  assert.equal(game.state.ai.messages.length, count);
  assert.equal(game.state.ai.error, 'AI service unavailable');
  assert.equal(game.state.ai.chatPending, false);
});

test('failed hint consumes nothing; successful hint uses server text and allowance', async () => {
  const game = state();
  globalThis.fetch = async () => response({ detail: 'No hint was used.' }, 503);
  await game.requestAIHint('P01');
  assert.equal(game.state.ai.hintsRemaining, 3);
  assert.equal(game.state.ai.hintPending, false);
  globalThis.fetch = async () => response({ hint: 'Backend hint', hints_used: 1, hints_remaining: 2, ai_state: 'CALM' });
  await game.requestAIHint('P01');
  assert.equal(game.state.ai.hintsRemaining, 2);
  assert.equal(game.state.ai.messages.at(-1).text, 'Backend hint');
  game.state.ai.hintsRemaining = 0;
  globalThis.fetch = async () => { assert.fail('Exhausted hint request must not be sent'); };
  await game.requestAIHint('P01');
});

test('duplicate hints are blocked while the request is pending', async () => {
  const game = state();
  let finish, calls = 0;
  globalThis.fetch = () => { calls++; return new Promise(resolve => { finish = resolve; }); };
  const pending = game.requestAIHint('P02');
  assert.equal(game.state.ai.hintPending, true);
  await game.requestAIHint('P02');
  assert.equal(calls, 1);
  finish(response({ hint: 'Hint', hints_remaining: 2 }));
  await pending;
});

test('late chat responses cannot populate a different case', async () => {
  const game = state();
  let finish;
  globalThis.fetch = () => new Promise(resolve => { finish = resolve; });
  const pending = game.sendAIMessage('old case');
  game.loadCase({ case_id: '001', title: 'New case' });
  finish(response({ response: 'Old case reply', ai_state: 'PANIC' }));
  await pending;
  assert.equal(game.state.sessionId, null);
  assert.equal(game.state.ai.state, 'CALM');
  assert.ok(!game.state.ai.messages.some(m => m.text === 'Old case reply'));
});

test('final reasoning uses the backend verdict after all puzzles and AI disappearance', async () => {
  const game = state();
  game.state.ai.state = 'VANISHED';
  game.state.ai.gameOver = true;
  for (const id of Object.keys(game.state.puzzleProgress)) game.state.puzzleProgress[id] = true;
  globalThis.fetch = async () => response({
    hypothesis_result: 'CONTRADICTED', hypothesis_statement: 'Selected theory',
    solved_puzzles: ['one', 'two', 'three', 'four', 'five'], game_over: true
  });
  await game.submitFinalAnswer({ hypothesisId: 'H4', reasoningText: 'My reasoning', selectedEvidenceIds: [] });
  assert.equal(game.state.results.hypothesisResult, 'CONTRADICTED');
  assert.equal(game.state.results.puzzlesSolved, 5);
  assert.equal(game.state.results.score, undefined);
  assert.equal(game.state.currentScreen, 'RESULTS');
  assert.equal(game.state.finalPending, false);
});

test('failed final submission retains draft and does not show results', async () => {
  const game = state();
  for (const id of Object.keys(game.state.puzzleProgress)) game.state.puzzleProgress[id] = true;
  game.state.currentScreen = 'FINAL_ANSWER';
  const answer = { hypothesisId: 'H4', reasoningText: 'Saved draft', selectedEvidenceIds: ['E01'] };
  globalThis.fetch = async () => response({ detail: 'Try again' }, 503);
  await game.submitFinalAnswer(answer);
  assert.deepEqual(game.state.finalAnswer, answer);
  assert.equal(game.state.results, null);
  assert.equal(game.state.currentScreen, 'FINAL_ANSWER');
  assert.equal(game.state.finalError, 'Try again');
  assert.equal(game.state.finalPending, false);
});

test('final submission prevents duplicates and requires hypothesis and reasoning', async () => {
  const game = state();
  for (const id of Object.keys(game.state.puzzleProgress)) game.state.puzzleProgress[id] = true;
  let calls = 0, finish;
  globalThis.fetch = () => { calls++; return new Promise(resolve => { finish = resolve; }); };
  await game.submitFinalAnswer({ hypothesisId: null, reasoningText: '' });
  assert.equal(calls, 0);
  const answer = { hypothesisId: 'H1', reasoningText: 'reason' };
  const pending = game.submitFinalAnswer(answer);
  assert.equal(game.state.finalPending, true);
  await game.submitFinalAnswer(answer);
  assert.equal(calls, 1);
  finish(response({ hypothesis_result: 'NOT_ESTABLISHED', solved_puzzles: [] }));
  await pending;
  await game.submitFinalAnswer(answer);
  assert.equal(calls, 1);
});

test('session setup fetches canonical hypotheses and does not create duplicate sessions', async () => {
  const game = new GameState();
  game.loadCase({ case_id: '001', title: 'Case 1', hypotheses: [{ id: 'wrong' }] });
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return url.endsWith('/cases/001')
      ? response({ hypotheses: [{ id: 'H3', statement: 'Canonical theory' }] })
      : response({ session_id: 'session-001', case_id: '001', ai_state: 'CALM', hints_used: 0 });
  };
  const ids = await Promise.all([game.ensureSession(), game.ensureSession()]);
  assert.deepEqual(ids, ['session-001', 'session-001']);
  assert.equal(calls.length, 2);
  assert.equal(game.state.currentCase.hypotheses[0].id, 'H3');
  game.loadCase({ case_id: '014', title: 'Other case' });
  assert.equal(game.state.sessionId, null);
  assert.equal(game.state.results, null);
  assert.equal(game.state.ai.hintsRemaining, 3);
});

test('AI and final-result rendering escapes text and never fabricates scores', () => {
  gameState.state = state().state;
  gameState.state.ai.messages = [{ sender: 'assistant', text: '<img src=x onerror=alert(1)>' }];
  gameState.state.ai.error = '<script>error</script>';
  gameState.state.ai.chatPending = true;
  const panel = container();
  renderAIPanel(panel);
  assert.ok(panel.innerHTML.includes('&lt;img'));
  assert.ok(!panel.innerHTML.includes('<img src=x'));
  assert.ok(panel.innerHTML.includes('role="status"'));
  assert.ok(panel.innerHTML.includes('disabled'));
  const results = container();
  renderResultsScreen(results);
  assert.ok(results.innerHTML.includes('No verdict'));
  gameState.state.results = { hypothesisResult: 'SUPPORTED', hypothesisStatement: '<script>theory</script>', feedback: 'SUPPORTED', puzzlesSolved: 5 };
  renderResultsScreen(results);
  assert.ok(results.innerHTML.includes('SUPPORTED'));
  assert.ok(results.innerHTML.includes('&lt;script&gt;theory'));
  assert.ok(!results.innerHTML.includes('/ 100'));
  gameState.state.finalPending = true;
  gameState.state.finalError = '<script>failed</script>';
  const final = container();
  renderFinalAnswer(final);
  assert.ok(final.innerHTML.includes('SUBMITTING VERDICT'));
  assert.ok(final.innerHTML.includes('&lt;script&gt;failed'));
});

import fs from 'node:fs';
import { toFrontendCase, loadCases, ALL_CASES } from '../frontend/js/data/caseLoader.js';
import { CASE_SCHEMAS } from '../frontend/js/utils/puzzle_schemas.js';
import { renderP0XGeneric } from '../frontend/js/components/puzzles/p0XGenericPuzzle.js';
import { sound } from '../frontend/js/effects/soundSystem.js';

function caseRecord(id) {
  const record = JSON.parse(fs.readFileSync(new URL('../data/case_' + id + '.json', import.meta.url), 'utf8'));
  record.hypotheses = record.hypotheses.map(({id, statement}) => ({id, statement}));
  return record;
}
function started(id = '004') {
  const game = new GameState();
  game.loadCase(toFrontendCase(caseRecord(id)));
  game.state.sessionId = 'sid-' + id;
  return game;
}
function progress(game, ids) {
  return { session_id: game.state.sessionId, case_id: game.state.currentCaseId,
    solved_puzzle_ids: ids, unlocked_evidence: ['E01'], inspected_evidence: [] };
}

for (let n = 1; n <= 15; n++) {
  const id = String(n).padStart(3, '0');
  test('canonical frontend case ' + id + ' exposes all five ordered puzzles', () => {
    const source = caseRecord(id), actual = toFrontendCase(source);
    assert.deepEqual(actual.puzzles, source.puzzles);
    assert.deepEqual(actual.hypotheses, source.hypotheses);
    assert.equal(actual.title, source.title);
    assert.deepEqual(actual.timeline, source.timeline);
    assert.equal(actual.victim.name, source.victim.name);
    for (const p of actual.puzzles) assert.ok(CASE_SCHEMAS[id][p.id]?.endpoint);
    const game = started(id);
    assert.equal(game.isPuzzleAvailable('P01'), true);
    assert.equal(game.isPuzzleAvailable('P02'), false);
    for (const p of actual.puzzles) game.state.puzzleProgress[p.id] = true;
    assert.equal(game.allPuzzlesSolved(), true);
  });
}
test('catalogue utility fetches all 15 cases from backend', async () => {
  globalThis.fetch = async url => {
    assert.equal(url, 'http://127.0.0.1:8000/cases');
    return response(Array.from({length:15}, (_,i)=>caseRecord(String(i+1).padStart(3,'0'))));
  };
  await loadCases();
  assert.equal(ALL_CASES.length, 15);
});

for (const outcome of ['success', 'incorrect', 'error']) {
  test('old puzzle ' + outcome + ' cannot mutate case B', async () => {
    const game = started('004'); let resolve, reject;
    const pending = game.submitPuzzle('P01', () => new Promise((a,b)=>{resolve=a;reject=b;}));
    game.loadCase(toFrontendCase(caseRecord('005')));
    game.state.sessionId = 'sid-005';
    const before = JSON.stringify(game.state);
    globalThis.fetch = () => assert.fail('Stale success must not fetch new state');
    if(outcome==='error') reject(new Error('old failure'));
    else resolve({correct:outcome==='success'});
    assert.equal(await pending, null);
    assert.equal(JSON.stringify(game.state), before);
  });
}
test('late session-progress response is ignored after switching cases', async () => {
  const game=started();let finish;
  globalThis.fetch=()=>new Promise(resolve=>finish=resolve);
  const pending=game.submitPuzzle('P01',async()=>({correct:true}));
  await Promise.resolve();
  game.loadCase(toFrontendCase(caseRecord('005')));
  finish(response({session_id:'sid-004',case_id:'004',solved_puzzle_ids:['P01']}));
  assert.equal(await pending,null);
  assert.equal(game.state.puzzleProgress.P01,false);
});
test('same-case new session also invalidates an old puzzle', async () => {
  const game=started();let finish;
  const pending=game.submitPuzzle('P01',()=>new Promise(resolve=>finish=resolve));
  game.state.sessionId='replacement-session';
  finish({correct:true});
  assert.equal(await pending,null);
  assert.equal(game.state.puzzleProgress.P01,false);
});
test('puzzle success requires matching authoritative server progress', async () => {
  const game=started();
  globalThis.fetch=async()=>response({...progress(game,['P01']),case_id:'005'});
  await assert.rejects(game.submitPuzzle('P01',async()=>({correct:true})),/mismatched/);
  assert.equal(game.state.puzzleProgress.P01,false);
  globalThis.fetch=async()=>response(progress(game,['P01']));
  await game.submitPuzzle('P01',async()=>({correct:true}));
  assert.equal(game.state.puzzleProgress.P01,true);
  assert.equal(game.state.evidenceMap.E01.status,'unlocked');
});
test('generic component regression: switch 004 to 005 while submit is pending', async () => {
  sound.enabled=false;gameState.loadCase(toFrontendCase(caseRecord('004')));
  gameState.state.sessionId='sid-004';
  let handler,finish;
  const element={innerHTML:'',querySelector:selector=>selector==='#btn-submit-P01'?
    {addEventListener:(_,fn)=>handler=fn}:null,querySelectorAll:()=>[]};
  renderP0XGeneric(element,'P01');
  globalThis.fetch=()=>new Promise(resolve=>finish=resolve);
  const pending=handler();
  gameState.loadCase(toFrontendCase(caseRecord('005')));
  finish(response({correct:true}));
  await pending;
  assert.equal(gameState.state.puzzleProgress.P01,false);
  assert.equal(gameState.state.sessionId,null);
});
for(const solved of [0,1,4,5]) {
  test('client final gate at '+solved+'/5',async()=>{
    const game=started();
    game.state.currentScreen='DASHBOARD';
    for(let i=1;i<=solved;i++)game.state.puzzleProgress['P0'+i]=true;
    let calls=0;
    globalThis.fetch=async()=>{calls++;return response({hypothesis_result:'SUPPORTED',
      hypothesis_statement:'Theory',solved_puzzles:['a','b','c','d','e'],game_over:true});};
    game.setScreen('FINAL_INVESTIGATION');
    assert.equal(game.state.currentScreen,solved===5?'FINAL_INVESTIGATION':'DASHBOARD');
    await game.submitFinalAnswer({hypothesisId:'H1',reasoningText:'Reason'});
    assert.equal(calls,solved===5?1:0);
    assert.equal(!!game.state.results,solved===5);
  });
}
test('evidence inspection uses backend, is idempotent and handles failure',async()=>{
  const game=started();game.state.evidenceMap.E01.status='unlocked';
  let calls=0;
  globalThis.fetch=async(url,options)=>{
    calls++;assert.equal(url,'http://127.0.0.1:8000/sessions/sid-004/evidence/E01');
    assert.equal(options.method,'POST');return response({detail:'Retry inspection'},503);
  };
  assert.equal(await game.openEvidence('E01'),false);
  assert.equal(game.state.evidenceMap.E01.status,'unlocked');
  assert.equal(game.state.evidenceErrors.E01,'Retry inspection');
  globalThis.fetch=async()=>{calls++;return response({evidence_id:'E01',inspected_evidence:['E01']});};
  assert.equal(await game.openEvidence('E01'),true);
  assert.equal(await game.openEvidence('E01'),true);
  assert.equal(calls,2);
});
for(const fail of [false,true]) {
  test('stale evidence '+(fail?'failure':'success')+' leaves new case untouched',async()=>{
    const game=started();game.state.evidenceMap.E01.status='unlocked';let finish;
    globalThis.fetch=()=>new Promise(resolve=>finish=resolve);
    const pending=game.openEvidence('E01');
    game.loadCase(toFrontendCase(caseRecord('005')));
    const before=JSON.stringify(game.state);
    finish(fail?response({detail:'old error'},503):response({evidence_id:'E01',inspected_evidence:['E01']}));
    assert.equal(await pending,false);
    assert.equal(JSON.stringify(game.state),before);
  });
}
