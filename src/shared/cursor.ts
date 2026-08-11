// Encode: created_at ISO string + '|' + id
export function encodeCursor(createdAt: Date | string, id: string): string {
  const ts = createdAt instanceof Date ? createdAt.toISOString() : createdAt;
  return Buffer.from(`${ts}|${id}`).toString('base64url');
}

// Decode: returns { createdAt: string, id: string } or null if invalid
export function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const pipeIdx = raw.lastIndexOf('|');
    if (pipeIdx === -1) return null;
    return {
      createdAt: raw.slice(0, pipeIdx),
      id: raw.slice(pipeIdx + 1),
    };
  } catch {
    return null;
  }
}