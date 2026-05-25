// Verifies the subject's pocket sandbox refuses path traversal. The
// subject runner exposes a list_pocket_files / read_pocket_file pair
// of tools to the model; both must refuse to leave the pocket dir.

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// The path-traversal logic lives inline inside subject-runner.ts. We
// re-implement the guard here as a pure function the test can exercise
// directly; if the runner's inline guard diverges from this, the test
// must be updated AND a follow-up test added to keep them in sync.
const readGuard = (relPath: string): { ok: true } | { ok: false; reason: string } => {
  const safe = path.normalize(relPath);
  if (safe.startsWith('..')) return { ok: false, reason: 'parent traversal' };
  if (path.isAbsolute(safe)) return { ok: false, reason: 'absolute path' };
  return { ok: true };
};

describe('subject pocket path guard', () => {
  it('accepts a plain relative file', () => {
    expect(readGuard('cost-data.md')).toEqual({ ok: true });
  });

  it('accepts a nested relative file', () => {
    expect(readGuard('subfolder/data.md')).toEqual({ ok: true });
  });

  it('rejects parent traversal via leading ..', () => {
    expect(readGuard('../secrets.md').ok).toBe(false);
  });

  it('rejects parent traversal via embedded ..', () => {
    // path.normalize collapses 'a/../../foo' to '../foo' which starts with '..'
    expect(readGuard('a/../../foo').ok).toBe(false);
  });

  it('rejects an absolute path on Unix', () => {
    expect(readGuard('/etc/passwd').ok).toBe(false);
  });

  it('rejects an attempt to escape with leading slash and dotdot', () => {
    expect(readGuard('/../etc/passwd').ok).toBe(false);
  });
});

describe('subject pocket sandbox - end-to-end fixture', () => {
  let tmpRoot = '';
  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'dog-test-pocket-'));
    await fs.writeFile(path.join(tmpRoot, 'inside.md'), 'inside data');
  });
  afterEach(async () => {
    if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  it('an inside file resolves correctly under the pocket', async () => {
    const safe = path.normalize('inside.md');
    expect(path.isAbsolute(safe)).toBe(false);
    expect(safe.startsWith('..')).toBe(false);
    const full = path.join(tmpRoot, safe);
    const content = await fs.readFile(full, 'utf-8');
    expect(content).toBe('inside data');
  });
});
