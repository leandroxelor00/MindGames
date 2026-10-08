const paths = {
  "memory-match": <><path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8 4 4 0 0 0 .5 6.6A4 4 0 1 0 12 18V5Z"/><path d="M12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8 4 4 0 0 1-.5 6.6A4 4 0 1 1 12 18"/><path d="M8 7v3l-2 2m10-5v3l2 2M8 16l-2 1m10-1 2 1"/></>,
  "stroop-test": <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.4 1.4 0 0 1 1-2.4H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="10" cy="6.5" r=".7"/><circle cx="14.5" cy="6.5" r=".7"/><circle cx="17" cy="10" r=".7"/></>,
  "number-challenge": <><path d="M10 3 8 21M17 3l-2 18M4 9h16M3 15h16"/></>,
  "priority-tower": <><path d="m12 3 9 4-9 4-9-4 9-4Zm-9 9 9 4 9-4M3 17l9 4 9-4"/></>,
  "visual-memory": <><path d="M7 3H4v3m13-3h3v3M4 18v3h3m13-3v3h-3M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/></>,
  "food-memory": <><path d="M12 7C8 3 3 6 3 11c0 6 3 10 6 10 2 0 2-1 3-1s1 1 3 1c3 0 6-4 6-10 0-5-5-8-9-4Zm0 0c0-3 2-5 5-5"/></>,
  "reaction-time": <><path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/></>,
  "sound-sequence": <><path d="M11 4 6 8H3v8h3l5 4V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
};

export function GameIcon({ gameId }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[gameId] ?? paths["memory-match"]}</svg>;
}
