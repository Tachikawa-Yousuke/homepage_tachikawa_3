// 日付の表記（お知らせ用）。例: Sep. 30, 2026
// YAML/Markdown の `date: 2026-09-30` は UTC の 0 時として読まれるので、UTC で取り出す（タイムゾーンで日付がずれないように）
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
export const fmtDate = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
