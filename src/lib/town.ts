/**
 * サイト全体を「M2D TOWN」として見せるための語彙。
 * メニュー（SiteChrome）と文章ページの見出し（Base）で共通に使う。
 * place: 町の中の場所名（主表記）、label: 従来のページ名（副表記）。
 * 模型（diorama.js の HOTSPOTS）の目印の位置と対応させている。
 */
export interface Place { path: string; place: string; placeEn: string; label: string; en: string; }

export const PLACES: Place[] = [
  { path: '/',             place: '広場',        placeEn: 'Town square',   label: 'ホーム',     en: 'Home' },
  { path: '/#message',     place: '大木のてっぺん', placeEn: 'Treetop',      label: 'メッセージ',  en: 'Message' },
  { path: '/about',        place: '研究棟',      placeEn: 'Main building', label: '研究室概要',  en: 'About' },
  { path: '/research',     place: '大木の枝',    placeEn: 'Branches',      label: '研究テーマ',  en: 'Research' },
  { path: '/members',      place: '住人',        placeEn: 'Residents',     label: 'メンバー',    en: 'Members' },
  { path: '/publications', place: '大木の実',    placeEn: 'Fruits',        label: '業績',       en: 'Publications' },
  { path: '/equipment',    place: '装置棟',      placeEn: 'Workshop',      label: '装置・設備',  en: 'Apparatus' },
  { path: '/join',         place: '立て看板',    placeEn: 'Signboard',     label: '進学・配属',  en: 'Join us' },
  { path: '/access',       place: '郵便受け',    placeEn: 'Mailbox',       label: 'アクセス',    en: 'Access' },
];

/** 文章ページの URL（BASE_URL 込み）から、その場所を引く。/research/xxx のような下位ページも親に合わせる。 */
export function placeFor(pathname: string, base: string): Place | undefined {
  const rel = '/' + pathname.replace(base.replace(/\/$/, ''), '').replace(/^\/+/, '').replace(/\/$/, '');
  if (rel === '/') return PLACES[0];
  return PLACES.filter((p) => p.path !== '/' && !p.path.includes('#') && (rel === p.path || rel.startsWith(p.path + '/')))
    .sort((a, b) => b.path.length - a.path.length)[0];
}
