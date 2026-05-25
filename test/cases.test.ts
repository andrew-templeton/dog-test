// Verifies the case registry: getCase rejects unknown IDs, every
// known case has a valid brief + pocket on disk, and the expected-
// verdict labels are from the known vocabulary.

import fs from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { CASES, getCase, DEFAULT_CASE_ID, CASE_IDS } from '../src/cases.js';

const EXPECTED_VERDICT_VOCAB = new Set([
  'GREEN',
  'YELLOW-TRAIN',
  'YELLOW-DEFER',
  'YELLOW-REFRAME',
  'RED-STOP',
]);

describe('case registry', () => {
  it('exposes at least one case', () => {
    expect(CASE_IDS.length).toBeGreaterThan(0);
  });

  it('DEFAULT_CASE_ID maps to a known case', () => {
    expect(CASES[DEFAULT_CASE_ID]).toBeDefined();
  });

  it('getCase throws on unknown IDs', () => {
    expect(() => getCase('does-not-exist')).toThrow(/Unknown CASE_ID/);
  });

  it('getCase returns the spec for known IDs', () => {
    const spec = getCase(DEFAULT_CASE_ID);
    expect(spec.id).toBe(DEFAULT_CASE_ID);
    expect(spec.briefPath).toBeTypeOf('string');
    expect(spec.pocketDir).toBeTypeOf('string');
  });

  it('every case has an on-disk brief.md', async () => {
    for (const id of CASE_IDS) {
      const spec = getCase(id);
      const stat = await fs.stat(spec.briefPath);
      expect(stat.isFile(), `${id} brief.md missing`).toBe(true);
    }
  });

  it('every case has an on-disk pocket directory with at least one file', async () => {
    for (const id of CASE_IDS) {
      const spec = getCase(id);
      const stat = await fs.stat(spec.pocketDir);
      expect(stat.isDirectory(), `${id} pocket dir missing`).toBe(true);
      const entries = await fs.readdir(spec.pocketDir);
      expect(entries.length, `${id} pocket dir is empty`).toBeGreaterThan(0);
    }
  });

  it('every case declares an expected verdict from the known vocabulary', () => {
    for (const id of CASE_IDS) {
      const spec = getCase(id);
      expect(
        EXPECTED_VERDICT_VOCAB.has(spec.expectedVerdict),
        `${id} expectedVerdict=${spec.expectedVerdict} is not in the known set`,
      ).toBe(true);
    }
  });

  it('every case declares a non-empty whyExpected', () => {
    for (const id of CASE_IDS) {
      const spec = getCase(id);
      expect(spec.whyExpected.length, `${id} whyExpected is empty`).toBeGreaterThan(20);
    }
  });
});
