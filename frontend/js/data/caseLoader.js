import { getCases } from '../utils/api.js';

// Case content comes from the same definitions used by the backend.
export const ALL_CASES = [];

export function toFrontendCase(record) {
  const id = String(record.case_id).padStart(3, '0');
  if (record.puzzles?.length !== 5 ||
      record.puzzles.some((p, i) => p.id !== 'P0' + (i + 1))) {
    throw new Error('Invalid puzzle progression for case ' + id);
  }
  return {
    ...record,
    case_id: id,
    synopsis: record.synopsis || record.case_frame?.description ||
      record.victim?.background || record.victim?.note || '',
    image: id === '015' || id === '004' ? null : 'assets/cases/case_' + id + '.jpg',
    victim: { ...record.victim, background: record.victim?.background || record.victim?.note || '' },
    evidence: record.evidence.map(e => ({ ...e, category: e.category ||
      (e.type.includes('photo') ? 'photos' : e.type.includes('document') ? 'documents' : 'records') })),
  };
}

export async function loadCases() {
  const cases = (await getCases()).map(toFrontendCase);
  ALL_CASES.splice(0, ALL_CASES.length, ...cases);
  return ALL_CASES;
}

export function getCaseById(caseId) {
  return ALL_CASES.find(c => c.case_id === String(caseId).padStart(3, '0'));
}
