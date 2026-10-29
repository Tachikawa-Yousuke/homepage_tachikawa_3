/**
 * サイト全体を「M2D TOWN」として見せるための語彙。
 * メニュー（SiteChrome）と文章ページの見出し（Base）で共通に使う。
 * label / en: ページ名。place / placeEn は同じ値（町の場所名は廃止）。
 */
export interface Place { path: string; place: string; placeEn: string; label: string; en: string; }

export const PLACES: Place[] = [
  // 2026-10-29: 町の場所名（広場・研究棟など）はユーザー要望で廃止し、通常のページ名に戻した。place/placeEn は label/en と同じ値を保持
  { path: '/',             place: 'ホーム',     placeEn: 'Home',         label: 'ホーム',     en: 'Home' },
  { path: '/#message',     place: 'メッセージ',  placeEn: 'Message',      label: 'メッセージ',  en: 'Message' },
  { path: '/about',        place: '研究室概要',  placeEn: 'About',        label: '研究室概要',  en: 'About' },
  { path: '/research',     place: '研究テーマ',  placeEn: 'Research',     label: '研究テーマ',  en: 'Research' },
  { path: '/members',      place: 'メンバー',    placeEn: 'Members',      label: 'メンバー',    en: 'Members' },
  { path: '/publications', place: '業績',       placeEn: 'Publications', label: '業績',       en: 'Publications' },
  { path: '/equipment',    place: '装置・設備',  placeEn: 'Apparatus',    label: '装置・設備',  en: 'Apparatus' },
  { path: '/join',         place: '進学・配属',  placeEn: 'Join us',      label: '進学・配属',  en: 'Join us' },
  { path: '/access',       place: 'アクセス',    placeEn: 'Access',       label: 'アクセス',    en: 'Access' },
];

/** 文章ページの URL（BASE_URL 込み）から、その場所を引く。/research/xxx のような下位ページも親に合わせる。 */
export function placeFor(pathname: string, base: string): Place | undefined {
  const rel = '/' + pathname.replace(base.replace(/\/$/, ''), '').replace(/^\/+/, '').replace(/\/$/, '');
  if (rel === '/') return PLACES[0];
  return PLACES.filter((p) => p.path !== '/' && !p.path.includes('#') && (rel === p.path || rel.startsWith(p.path + '/')))
    .sort((a, b) => b.path.length - a.path.length)[0];
}
