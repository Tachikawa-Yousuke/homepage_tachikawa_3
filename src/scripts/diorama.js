// 研究室のシンボル「一本の巨大なナノワイヤの塔」を中心にした小さな街の 3D ジオラマ（three.js）。
// すべてコードで組んだ立方体・多角柱で構成し、画像やモデルファイルは使わない。
// テーマ（黄 / 紺 / 緑 / 黒）は <html data-theme> を読んで色と光を切り替える。
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const THEMES = {
  yellow: { bg: 0xf6c945, base: 0x2f3a5c, grain: [0x4a5a8a, 0x55679c, 0x3f4f80, 0x5f72a8], road: 0xe9dfc2,
    wire: 0xd9dde6, wireEdge: 0xffffff, atom: 0xff7a59, electron: 0x2f6fd8,
    person: [0xffffff, 0xff7a59, 0x2f6fd8, 0x5bc96a], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0x8a93a3, deviceLight: 0x5bc96a, letter: 0x1f2a44, sign: 0xffffff,
    bldg: [0xf6a5b5, 0x55bfe8, 0x3fc9b4, 0xfff1a8, 0xffffff], roof: [0x8c98a8, 0xe85c4a, 0x2f3a5c, 0xf2a53b], window: 0xffffff, tree: 0x3f9b3a, treeLight: 0x6fcf5a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xff7a59,
    hemiSky: 0xffffff, hemiGround: 0xc8902a, sun: 0xfff2d0, sunI: 2.2, hemiI: 0.9, emissive: 0x000000 },
  navy: { bg: 0x1f2a44, base: 0xf6c945, grain: [0xffd964, 0xf2c23a, 0xffe17a, 0xe8b52e], road: 0xfff2c0,
    wire: 0xe8ecf3, wireEdge: 0xffffff, atom: 0xff7a59, electron: 0x8fd3ff,
    person: [0xffffff, 0xff7a59, 0x8fd3ff, 0x5bc96a], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0xb8c0cc, deviceLight: 0x5bc96a, letter: 0x1f2a44, sign: 0xffffff,
    bldg: [0xffffff, 0xf6a5b5, 0x55bfe8, 0x3fc9b4, 0xfff1a8], roof: [0x2f3a5c, 0xe85c4a, 0x5f6b7a, 0xf2a53b], window: 0xffe9a0, tree: 0x3f9b3a, treeLight: 0x6fcf5a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xff7a59,
    hemiSky: 0xcfdcff, hemiGround: 0x2a3550, sun: 0xffffff, sunI: 2.0, hemiI: 0.8, emissive: 0x000000 },
  green: { bg: 0x1f5a3a, base: 0x2f7a52, grain: [0x4fa86e, 0x5cb87a, 0x44995f, 0x6ac688], road: 0xe9e0c4,
    wire: 0xe6ebe8, wireEdge: 0xffffff, atom: 0xffd84a, electron: 0xffffff,
    person: [0xffffff, 0xffd84a, 0xff7a59, 0x8fd3ff], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0x9aa5a0, deviceLight: 0xffd84a, letter: 0x0f2a20, sign: 0xffffff,
    bldg: [0xf6a5b5, 0x55bfe8, 0xfff1a8, 0xffffff, 0x3fc9b4], roof: [0x8c98a8, 0xe85c4a, 0x2f3a5c, 0xf2a53b], window: 0xffffff, tree: 0x2f7a3a, treeLight: 0x5bc96a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xffd84a,
    hemiSky: 0xe8ffe8, hemiGround: 0x1f5a3a, sun: 0xfff6d8, sunI: 2.1, hemiI: 0.9, emissive: 0x000000 },
  black: { bg: 0x0a0a0c, base: 0x161922, grain: [0x262b3a, 0x2d3345, 0x20242f, 0x343a4e], road: 0x3a3f4e,
    wire: 0xcfd4de, wireEdge: 0xffffff, atom: 0xffd84a, electron: 0x5ad6ff,
    person: [0xf4f4f4, 0xffd84a, 0x5ad6ff, 0xff7a59], skin: 0xf2c9a0, hair: 0x2a2a2a,
    device: 0x5a6070, deviceLight: 0x5ad6ff, letter: 0xffd84a, sign: 0xf4f4f4,
    bldg: [0x2a2f3d, 0x343a4a, 0x222633], roof: [0x4a5162, 0xd04a3a, 0x5f6b7a], window: 0xffe9a0, tree: 0x24533a, treeLight: 0x3a7a50, trunk: 0x4a3220, plane: 0xf4f4f4, planeAccent: 0x5ad6ff,
    hemiSky: 0x8fa8ff, hemiGround: 0x1a1a22, sun: 0xffffff, sunI: 1.6, hemiI: 0.6, emissive: 0x111318 },
};
export const THEME_NAMES = Object.keys(THEMES);

// 季節: 大木の葉と地面、舞う粒子
export const SEASONS = {
  spring: { canopy: [0xf7b6d2, 0xf49ac1, 0xfde2ec, 0xf28cb8], small: [0xf49ac1, 0xfbd0e0], bare: false, density: 1.0, ground: [0x8cd65a, 0x7ac44a, 0x98de68, 0x86cc56], particle: 0xfbc8dc, pCount: 220, pSize: 0.5, fall: 1.6, drift: 1.2 },
  summer: { canopy: [0x2e8b3d, 0x3fa34a, 0x55b85a, 0x237a33], small: [0x3f9b3a, 0x6fcf5a], bare: false, density: 1.0, ground: [0x6fbf47, 0x5fae3c, 0x7fcc55, 0x66b542], particle: 0x9ad66a, pCount: 40, pSize: 0.35, fall: 1.0, drift: 0.8 },
  autumn: { canopy: [0xe0522f, 0xf08a24, 0xf2b53a, 0xc7391f], small: [0xe8742a, 0xf2b53a], bare: false, density: 0.92, ground: [0xb9c25a, 0xa8b24c, 0xc6cc66, 0xb0b854], particle: 0xf08a24, pCount: 180, pSize: 0.5, fall: 2.0, drift: 1.6 },
  winter: { canopy: [0xffffff, 0xf2f6fb, 0xe6edf5, 0xffffff], small: [0x8a6a4a, 0xffffff], bare: true, density: 0.45, ground: [0xf4f7fb, 0xe9eef5, 0xffffff, 0xeef2f8], particle: 0xffffff, pCount: 260, pSize: 0.4, fall: 1.2, drift: 0.9 },
};
export const SEASON_NAMES = Object.keys(SEASONS);
// 大木の様式（形）。trunk: 幹、branches: 枝、canopy: 樹冠を作る楕円体の集合（cut より下は切る）
export const TREE_STYLES = {
  umbrella: { label: '丸い傘（現行）', trunk: { r: 3.6, h: 20 }, branches: { n: 9, len: 17, y0: 13, y1: 23 }, canopy: [{ rx: 23, ry: 10, rz: 23, cy: 27, cut: 22 }] },
  flat:     { label: '平たい傘（写真寄り）', trunk: { r: 3.9, h: 22 }, branches: { n: 12, len: 24, y0: 12, y1: 24 }, canopy: [{ rx: 29, ry: 7, rz: 29, cy: 27, cut: 23 }] },
  layered:  { label: '段々の樹冠', trunk: { r: 3.4, h: 30 }, branches: { n: 8, len: 20, y0: 12, y1: 20 }, canopy: [{ rx: 25, ry: 5, rz: 25, cy: 22, cut: 19 }, { rx: 18, ry: 5, rz: 18, cy: 29, cut: 26 }, { rx: 11, ry: 5, rz: 11, cy: 35, cut: 32 }] },
  round:    { label: '丸い玉（絵本風）', trunk: { r: 3.0, h: 18 }, branches: { n: 5, len: 8, y0: 10, y1: 17 }, canopy: [{ rx: 17, ry: 15, rz: 17, cy: 29, cut: 17 }] },
  lumpy:    { label: '雲のような塊', trunk: { r: 3.6, h: 20 }, branches: { n: 9, len: 16, y0: 12, y1: 24 }, canopy: 'tips' },
  weeping:  { label: 'しだれ', trunk: { r: 3.4, h: 22 }, branches: { n: 10, len: 18, y0: 14, y1: 26 }, canopy: [{ rx: 22, ry: 8, rz: 22, cy: 29, cut: 25 }], strands: true },
  // 冬（葉なし）: 枝の本数と枝分かれの段数が違う 3 案。sub = 1 本の枝から出る小枝の数、twig = 小枝の先の細枝の数
  winter_a: { label: '冬A: 枝 9 本・小枝 2', bare: true, trunk: { r: 3.6, h: 20 }, branches: { n: 9, len: 18, y0: 13, y1: 24, sub: 2, twig: 0 }, canopy: [] },
  winter_b: { label: '冬B: 枝 14 本・小枝 3・細枝 2', bare: true, trunk: { r: 3.6, h: 20 }, branches: { n: 14, len: 20, y0: 12, y1: 25, sub: 3, twig: 2 }, canopy: [] },
  winter_c: { label: '冬C: 枝 20 本・小枝 3・細枝 3', bare: true, trunk: { r: 3.8, h: 22 }, branches: { n: 20, len: 22, y0: 12, y1: 27, sub: 3, twig: 3 }, canopy: [] },
};
// 季節ごとに使う様式（ユーザー選定: 春 = 丸い玉、夏 = 段々、秋 = 丸い傘、冬 = 冬B）
export const SEASON_STYLE = { spring: 'round', summer: 'layered', autumn: 'umbrella', winter: 'winter_b' };
export const TREE_STYLE_NAMES = Object.keys(TREE_STYLES);

export function seasonForDate(d = new Date()) { const m = d.getMonth() + 1; return m <= 2 || m === 12 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn'; }


// MagicaVoxel などで作った部品の差し替え設定。public/models/<name>.obj（＋ .mtl ＋ .png）があれば読み込む。
//  attach: 'wire' = ナノワイヤの塔（成長アニメーションに追従）/ 'world' = 街の中の固定物
//  height: 塔の高さに合わせて拡大縮小（attach:'wire' のとき）。scale: そのままの倍率（attach:'world' のとき）
export const MODELS = [];
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 部品 ----------
function makeVoxels(list, scale = 1) {
  const geo = new THREE.BoxGeometry(scale, scale, scale);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial(), list.length);
  const m = new THREE.Matrix4(); const col = new THREE.Color();
  list.forEach((v, i) => { m.makeTranslation(v.x * scale, v.y * scale, v.z * scale); mesh.setMatrixAt(i, m); mesh.setColorAt(i, col.set(v.c)); });
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}
function personVox(t, coat) {
  const v = [];
  for (let y = 0; y < 2; y++) { v.push({ x: -0.3, y: y * 0.5 + 0.25, z: 0, c: 0x2f3a5c }); v.push({ x: 0.3, y: y * 0.5 + 0.25, z: 0, c: 0x2f3a5c }); }
  for (let y = 2; y < 5; y++) for (let dx = -0.5; dx <= 0.5; dx += 0.5) v.push({ x: dx, y: y * 0.5 + 0.25, z: 0, c: coat });
  v.push({ x: -1, y: 1.75, z: 0, c: coat }); v.push({ x: 1, y: 1.75, z: 0, c: coat });
  for (let dx = -0.5; dx <= 0.5; dx += 0.5) for (let dy = 0; dy < 2; dy++) v.push({ x: dx, y: 2.75 + dy * 0.5, z: 0, c: dy ? t.hair : t.skin });
  return v;
}
function person(t, x, z, colorIdx, facing = 0) {
  const g = new THREE.Group(); g.add(makeVoxels(personVox(t, t.person[colorIdx % t.person.length]), 0.5)); g.position.set(x, 0, z); g.rotation.y = facing; return g;
}
// 建物: 幅 w、高さ h、奥行き d。壁の色、屋根の色、窓
function building(t, x, z, w, h, d, wallIdx, roofIdx, y0 = 0) {
  const v = [];
  const wall = t.bldg[wallIdx % t.bldg.length], roof = t.roof[roofIdx % t.roof.length];
  for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) for (let k = 0; k < d; k++) {
    const edge = i === 0 || i === w - 1 || k === 0 || k === d - 1;
    if (!edge && j < h - 1) continue;                               // 中は空洞
    const win = edge && j > 0 && j < h - 1 && j % 2 === 1 && ((i + k) % 2 === 0) && !(i === 0 && k === 0) && !(i === w - 1 && k === d - 1);
    v.push({ x: x + i - w / 2 + 0.5, y: y0 + j + 0.5, z: z + k - d / 2 + 0.5, c: j === h - 1 ? roof : (win ? t.window : wall) });
  }
  // 入口
  v.push({ x: x, y: y0 + 0.5, z: z + d / 2 - 0.5, c: 0x5f6b7a });
  return v;
}
function tree(t, x, z, s = 1, season = null) {
  const v = [];
  for (let y = 0; y < 2 * s; y++) v.push({ x, y: y + 0.5, z, c: t.trunk });
  const r = 1 + s;
  const col = season ? season.small : [t.tree, t.treeLight];
  if (season && season.bare) {                                           // 冬: 枝だけ残し、先端に雪
    for (let y = 2 * s; y < 2 * s + 2; y++) v.push({ x, y: y + 0.5, z, c: t.trunk });
    [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]].forEach(([dx, dz], i) => { v.push({ x: x + dx, y: 2 * s + 2.5 + (i % 2), z: z + dz, c: t.trunk }); v.push({ x: x + dx, y: 2 * s + 3.5 + (i % 2), z: z + dz, c: 0xffffff }); });
    v.push({ x, y: 2 * s + 2.5, z, c: 0xffffff });
    return v;
  }
  for (let i = -r; i <= r; i++) for (let j = 0; j <= r + 1; j++) for (let k = -r; k <= r; k++) {
    if (i * i + (j - r * 0.6) * (j - r * 0.6) + k * k <= r * r + 0.5) v.push({ x: x + i, y: 2 * s + j + 0.5, z: z + k, c: (i + j) % 3 === 0 ? col[1] : col[0] });
  }
  return v;
}

// ---------- ボクセル人形（頭の大きい統一デザイン）。部位ごとに分けて動かせる ----------
const CHAR_V = 0.4;                                   // 1 ボクセルの大きさ
const CHAR_PAL = { hair: 0x4a3222, hairLight: 0x5c4030, skin: 0xf5cba4, eye: 0x2b2b2b, shirt: 0xffffff, shirtShade: 0xe6e6e6, pants: 0x2f3a5c, shoe: 0x5a3a22 };
function part(list, pivot) { const m = makeVoxels(list, CHAR_V); m.position.set(pivot[0], pivot[1], pivot[2]); return m; }
// opts: hair（髪色）, hairLight, hairStyle, skin, shirt, shirtShade, pants, shoe, glasses（眼鏡色）, jacket（上着色）, tie（ネクタイ色）, inner（襟元の下着色）, buttons（ボタン色）, collar（襟色）
function makeChar(opts = {}) {
  const g = new THREE.Group(); const P = { ...CHAR_PAL, ...opts };
  const leg = (sx) => { const v = []; for (let y = -3; y < 0; y++) for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) v.push({ x: sx + i - 0.5, y: y + 0.5, z: k - 0.5, c: y === -3 ? P.shoe : P.pants }); return part(v, [0, 1.2, 0]); };
  const legL = leg(-1.5), legR = leg(0.5);
  const torso = new THREE.Group(); torso.position.set(0, 1.2, 0);
  const body = [];
  for (let y = 0; y < 5; y++) for (let i = -2; i <= 2; i++) for (let k = -1; k <= 1; k++) {
    let c = (k === -1) ? P.shirtShade : P.shirt;
    if (P.jacket) { const front = k === 1 && Math.abs(i) <= 0; c = front ? P.shirt : P.jacket; }      // 上着: 前の中央だけシャツが見える
    if (P.tie && k === 1 && i === 0 && y >= 1 && y <= 4) c = P.tie;                                     // ネクタイ
    if (P.inner && k === 1 && Math.abs(i) <= 1 && y === 4) c = P.inner;                                  // 襟元から見える下着
    if (P.buttons && k === 1 && i === 0 && (y === 2 || y === 3)) c = P.buttons;                           // 前立てのボタン
    if (P.collar && k === 1 && (i === -1 || i === 1) && y === 4) c = P.collar;                            // 襟
    body.push({ x: i, y: y + 0.5, z: k, c });
  }
  torso.add(part(body, [0, 0, 0]));
  const arm = (sx) => { const v = []; for (let y = -4; y < 0; y++) v.push({ x: 0, y: y + 0.5, z: 0, c: y === -4 ? P.skin : (P.jacket || P.shirt) }); return part(v, [sx, 1.9, 0]); };
  const armL = arm(-1.25), armR = arm(1.25); torso.add(armL, armR);
  const head = [];
  // hairStyle: 'short'（既定）/ 'medium'（肩までの長髪、前髪は右に流す）/ 'spiky'（短髪、頭頂が少し立つ）/
  //            'parted'（センター分けのミディアム）/ 'curly'（ボリュームのあるくせ毛）/ 'bangs'（前髪を下ろした短髪）
  const HS = P.hairStyle || 'short';
  const medium = HS === 'medium', parted = HS === 'parted', curly = HS === 'curly', bangs = HS === 'bangs';
  for (let y = 0; y < 6; y++) for (let i = -3; i < 3; i++) for (let k = -3; k < 3; k++) {
    let hair = y >= 4 || k <= -1 || (y >= 3 && (i === -3 || i === 2));
    if (medium) hair = hair || (k <= 0 && y >= 1) || (y === 3 && k === 2 && i >= 1);                     // 横髪は目の上まで、前髪は右端だけ
    if (parted) hair = hair || (y >= 2 && (i === -3 || i === 2)) || (k <= 0 && y >= 2) || (y === 3 && k === 2 && (i === -3 || i === 2));   // 前髪は両端だけ。額と目は見せる
    if (curly)  hair = hair || (y >= 1 && (i === -3 || i === 2)) || (k <= 0 && y >= 1) || (y === 3 && k === 2 && i !== -1 && i !== 0);   // 顔の周りを髪が囲む、額の真ん中だけ見える
    if (bangs)  hair = hair || (y === 3 && k === 2);                                                        // 前髪を額いっぱいに下ろす
    let c = hair ? ((i + y) % 3 === 0 ? (P.hairLight || P.hair) : P.hair) : P.skin;
    if (!hair && y === 2 && k === 2 && (i === -2 || i === 1)) c = P.eye;
    head.push({ x: i + 0.5, y: y + 0.5, z: k + 0.5, c });
  }
  if (medium || parted) for (const i of [-3, 2]) for (const k of [-2, -1, 0]) head.push({ x: i + 0.5, y: -0.5, z: k + 0.5, c: P.hair });   // 襟足
  if (curly) {                                                       // 頭の外側にもう一層、ふくらんだ髪を足す
    for (let y = 1; y < 7; y++) for (let k = -3; k < 2; k++) for (const i of [-4, 3]) if (!(y === 6 && k === 1)) head.push({ x: i + 0.5, y: y + 0.5, z: k + 0.5, c: (i + y + k) % 2 ? P.hair : (P.hairLight || P.hair) });
    for (let y = 1; y < 7; y++) for (let i = -4; i < 4; i++) head.push({ x: i + 0.5, y: y + 0.5, z: -3.5, c: (i + y) % 2 ? P.hair : (P.hairLight || P.hair) });   // 後ろ
    for (let i = -3; i < 3; i++) for (let k = -3; k < 2; k++) if ((i * 7 + k * 3) % 4 !== 0) head.push({ x: i + 0.5, y: 6.5, z: k + 0.5, c: P.hair });   // 頭頂のふくらみ
    for (const [i, k] of [[-4, 2], [3, 2]]) head.push({ x: i + 0.5, y: 2.5, z: k + 0.5, c: P.hair });    // 頬の横にかかる毛先
  }
  if (HS === 'spiky') for (let i = -2; i < 2; i++) for (let k = -2; k < 2; k++) if ((i + k) % 2 === 0) head.push({ x: i + 0.5, y: 6.5, z: k + 0.5, c: P.hair });   // 頭頂が少し立つ（市松状の薄い層）
  const headM = part(head, [0, 2.0, 0]); torso.add(headM);
  if (P.glasses) {                                                   // 眼鏡: 半分の大きさのブロックで、目の周りの枠・ブリッジ・つる
    const gv = [];
    for (const ex of [-3, 3]) for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) === 2 || Math.abs(j) === 2) gv.push({ x: ex + i, y: 5 + j, z: 6.6, c: P.glasses });
    gv.push({ x: -0.5, y: 5, z: 6.6, c: P.glasses }, { x: 0.5, y: 5, z: 6.6, c: P.glasses });            // ブリッジ
    for (let z = 6; z >= -2; z--) { gv.push({ x: -6.5, y: 5.5, z, c: P.glasses }); gv.push({ x: 6.5, y: 5.5, z, c: P.glasses }); }   // つる
    const gm = makeVoxels(gv, CHAR_V / 2); gm.castShadow = false; headM.add(gm);
  }
  g.add(legL, legR, torso);
  return { g, legL, legR, torso, armL, armR, head: headM };
}

// メンバーごとの見た目（members.yaml の id と対応）。名刺の人形と街の人形の両方で使う
export const MEMBER_LOOKS = {
  kimura:    { hair: 0x1c1c1c, hairLight: 0x2a2a2a, glasses: 0x1b1b1b, jacket: 0x5a4636, shirt: 0xdbe7f3, shirtShade: 0xc9d6e4, tie: 0x2f3a6c, pants: 0x3a3a40, shoe: 0x2b2b2b },
  tachikawa: { hair: 0x151515, hairLight: 0x262626, hairStyle: 'medium', shirt: 0x262626, shirtShade: 0x171717, inner: 0xf4f4f4, pants: 0x2f3a5c, shoe: 0x2b2b2b },
  shiiba:    { hair: 0x1a1a1a, hairLight: 0x2d2d2d, hairStyle: 'spiky', glasses: 0x1b1b1b, shirt: 0x4a4046, shirtShade: 0x332b31, pants: 0x33363d, shoe: 0x2b2b2b },
  kuboya:    { hair: 0x3b2a1b, hairLight: 0x4e3a27, hairStyle: 'parted', shirt: 0x1e2a44, shirtShade: 0x141d33, buttons: 0x0b1020, collar: 0x2a3a60, pants: 0x3a3a40, shoe: 0x2b2b2b },
  kudo:      { hair: 0x111111, hairLight: 0x2a2a2a, hairStyle: 'curly', shirt: 0xf4f4f4, shirtShade: 0xdcdcdc, pants: 0x2f3a5c, shoe: 0x2b2b2b },
  kaneko:    { hair: 0x161616, hairLight: 0x262626, hairStyle: 'bangs', shirt: 0x2f4b45, shirtShade: 0x233934, pants: 0x4a6b9c, shoe: 0x3a3a3a },
};

// 1 人分の人形を透明背景の画像にする（メンバー紹介用）。opts は makeChar と同じ
export function renderPortrait(opts = {}, { w = 600, h = 720, pose = 'stand', angle = -0.45 } = {}) {
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setClearColor(0x000000, 0); r.shadowMap.enabled = true; r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xffffff, 0xb0a080, 1.0));
  const sun = new THREE.DirectionalLight(0xfff2d0, 2.0); sun.position.set(6, 12, 8); sun.castShadow = true; sc.add(sun);
  const c = makeChar(opts); sc.add(c.g);
  c.g.rotation.y = angle;                                             // 既定はやや斜め前を向く
  if (pose === 'wave') { c.armR.rotation.x = -Math.PI * 0.9; c.armR.rotation.z = -0.3; }
  if (pose === 'arms') { c.armL.rotation.x = -0.4; c.armR.rotation.x = -0.4; }
  const cam = new THREE.PerspectiveCamera(28, w / h, 0.1, 100);
  cam.position.set(0.6, 3.6, 17.5); cam.lookAt(0, 2.9, 0);
  r.render(sc, cam);
  const url = canvas.toDataURL('image/png');
  r.dispose();
  return url;
}

// 手に持つ小物（腕の先に付ける）
function bat(len, color) { const v = [{ x: 0, y: -3.5, z: -0.5, c: color }]; for (let i = 0; i < len; i++) v.push({ x: 0, y: -3.5, z: i + 0.5, c: color }); return makeVoxels(v, CHAR_V); }   // 手の位置（腕の先端）から腕と直角に伸びるバット

export function createDiorama(canvas, { themeName = 'yellow', seasonName = seasonForDate(), base = '/' } = {}) {
  let t = THEMES[themeName] || THEMES.yellow;
  let season = SEASONS[seasonName] || SEASONS.autumn;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 600);
  scene.add(camera);

  const hemi = new THREE.HemisphereLight(t.hemiSky, t.hemiGround, t.hemiI); scene.add(hemi);
  const sun = new THREE.DirectionalLight(t.sun, t.sunI); sun.position.set(60, 90, 40); sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 140, bottom: -120, far: 400 }); sun.shadow.bias = -0.0005; sun.shadow.radius = 4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-40, 30, -40); scene.add(rim);

  const world = new THREE.Group(); scene.add(world);
  const themed = [];                              // テーマで色が変わる InstancedMesh の組み立て関数
  const addThemed = (fn) => { const holder = new THREE.Group(); world.add(holder); themed.push({ holder, fn }); };

  // ---- 台座（芝生の広場）＋ 環状の道。地面の色は季節で変わる ----
  const N = 32;                                           // 街の半径（ボクセル）。2026-10-27 に 26 → 32 へ拡大
  const groundVox = [];
  for (let gx = -N; gx < N; gx++) for (let gz = -N; gz < N; gz++) {
    const cx = gx + 0.5, cz = gz + 0.5, d = Math.hypot(cx, cz);
    const gi = Math.floor((Math.sin(gx * 0.9) + Math.cos(gz * 1.1) + Math.sin((gx + gz) * 0.5)) * 1.5 + 4) % 4;
    const road = Math.abs(d - 15.5) < 1.3 || (Math.abs(cx) < 1.3 && d > 15) || (Math.abs(cz) < 1.3 && d > 15);
    groundVox.push({ x: cx, y: 0.5, z: cz, top: true, road, gi });                    // 地面は 1 層だけ（薄い板。高さは groundHolder.scale.y で潰す）
  }
  const groundHolder = new THREE.Group(); groundHolder.scale.y = 0.3; world.add(groundHolder);   // 地面の厚み 0.3（上面は y = 0.3）
  function buildGround() {
    groundHolder.clear();
    groundHolder.add(makeVoxels(groundVox.map((v) => ({ ...v, c: v.top ? (v.road ? t.road : season.ground[v.gi]) : t.base })), 1));
  }
  const edge = new THREE.Mesh(new THREE.BoxGeometry(N * 2 + 2, 0.25, N * 2 + 2), new THREE.MeshLambertMaterial({ color: t.base })); edge.position.y = -0.125; edge.receiveShadow = true; edge.castShadow = true; world.add(edge);   // 薄い縁
  // 模型全体の影を、背景色の床（見えない受け皿）に落とす。参考サイトの「紙の上に置いた模型」の見え方
  const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.ShadowMaterial({ opacity: 0.16 }));
  shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.position.y = -0.3; shadowCatcher.receiveShadow = true; scene.add(shadowCatcher);

  // ---- 大木。様式（TREE_STYLES）で幹・枝・樹冠の形が変わり、葉と雪は季節で作り直す ----
  let TREE_H = 40;                                     // 樹冠の最上部の高さ（目印の位置計算にも使う）
  const bigTree = new THREE.Group(); world.add(bigTree);
  const trunkHolder = new THREE.Group(); bigTree.add(trunkHolder);
  const canopyHolder = new THREE.Group(); bigTree.add(canopyHolder);
  let trunkVox = [], canopyCells = [], treeStyle = TREE_STYLES.umbrella, CANOPY_RX = 23, CANOPY_CUT = 22;
  function buildTreeShape(style) {
    treeStyle = style; trunkVox = []; canopyCells = [];
    // 幹: 根元が太く上へ細くなる
    for (let y = 0; y < style.trunk.h; y++) {
      const r = y < 3 ? style.trunk.r : style.trunk.r - 0.4 - y * 0.05;
      for (let i = -5; i <= 5; i++) for (let k = -5; k <= 5; k++) if (i * i + k * k <= r * r) trunkVox.push({ x: i, y: y + 0.5, z: k, c: (i + k + y) % 5 === 0 ? 0x5a3a22 : 0x6b4a2b });
    }
    // 枝: 幹の上部から放射状に伸び、樹冠の内側を支える。冬の様式では小枝・細枝も生やす
    const tips = [];
    const B = style.branches;
    const stroke = (x0, y0, z0, ang, len, rise, steps, thick) => {   // 1 本の枝を描いて先端を返す
      let ex = x0, ey = y0, ez = z0;
      for (let st = 0; st <= steps; st++) {
        const u = st / steps, r = u * len, y = y0 + rise * Math.sin(u * Math.PI / 2);
        ex = x0 + Math.cos(ang) * r; ez = z0 + Math.sin(ang) * r; ey = y;
        trunkVox.push({ x: Math.round(ex), y: Math.round(ey) + 0.5, z: Math.round(ez), c: 0x5a3a22 });
        if (thick && u > 0.3 && st % 2 === 0) trunkVox.push({ x: Math.round(ex + Math.cos(ang + 1.57)), y: Math.round(ey) + 0.5, z: Math.round(ez + Math.sin(ang + 1.57)), c: 0x5a3a22 });
      }
      return [ex, ey, ez];
    };
    for (let n = 0; n < B.n; n++) {
      const ang = (n / B.n) * Math.PI * 2 + 0.3, len = B.len + (n % 3) * 3;
      const y0 = B.y0 + (n % 2) * 3, y1 = B.y1 + (n % 3) * 2;
      const tip = stroke(0, y0, 0, ang, len, y1 - y0, 28, true);
      tips.push(tip);
      for (let j = 0; j < (B.sub || 0); j++) {                        // 小枝: 枝の途中から左右交互に
        const u0 = 0.4 + j * 0.2, sx = Math.cos(ang) * len * u0, sz = Math.sin(ang) * len * u0, sy = y0 + (y1 - y0) * Math.sin(u0 * Math.PI / 2);
        const a2 = ang + (j % 2 ? 0.7 : -0.7) + (n % 2) * 0.2;
        const t2 = stroke(sx, sy, sz, a2, len * 0.45, 5 + j * 2, 14, false);
        for (let k = 0; k < (B.twig || 0); k++) {                     // 細枝: 小枝の先から上向きに
          const a3 = a2 + (k - 1) * 0.6;
          stroke(t2[0], t2[1], t2[2], a3, 4 + k, 3 + k, 6, false);
        }
      }
    }
    trunkHolder.clear(); trunkHolder.add(makeVoxels(trunkVox, 1));
    // 樹冠: 楕円体の集合。表面の層だけを置き、縁はまばらにして葉のまとまりを出す
    const blobs = style.canopy === 'tips'
      ? [...tips.map(([x, y, z], i) => ({ cx: x * 0.85, cy: y + 4, cz: z * 0.85, rx: 8 + (i % 3), ry: 7 + (i % 2), rz: 8 + ((i + 1) % 3), cut: 0 })), { cx: 0, cy: 33, cz: 0, rx: 11, ry: 8, rz: 11, cut: 0 }]
      : style.canopy.map((e) => ({ cx: 0, cz: 0, ...e }));
    const inside = (x, y, z) => blobs.some((e) => y >= e.cut && ((x - e.cx) ** 2) / (e.rx * e.rx) + ((y - e.cy) ** 2) / (e.ry * e.ry) + ((z - e.cz) ** 2) / (e.rz * e.rz) <= 1);
    let minX = 99, maxX = -99, minY = 99, maxY = -99, minZ = 99, maxZ = -99;
    if (blobs.length === 0) { const top = Math.max(...trunkVox.map((v) => v.y)); minX = -B.len; maxX = B.len; minY = top; maxY = top; }
    blobs.forEach((e) => { minX = Math.min(minX, e.cx - e.rx); maxX = Math.max(maxX, e.cx + e.rx); minY = Math.min(minY, Math.max(e.cut, e.cy - e.ry)); maxY = Math.max(maxY, e.cy + e.ry); minZ = Math.min(minZ, e.cz - e.rz); maxZ = Math.max(maxZ, e.cz + e.rz); });
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z++) {
      if (!inside(x, y, z)) continue;
      const shell = !(inside(x + 1, y, z) && inside(x - 1, y, z) && inside(x, y + 1, z) && inside(x, y - 1, z) && inside(x, y, z + 1) && inside(x, y, z - 1));
      const shell2 = !(inside(x + 2, y, z) && inside(x - 2, y, z) && inside(x, y + 2, z) && inside(x, y - 2, z) && inside(x, y, z + 2) && inside(x, y, z - 2));
      if (!shell2) continue;
      const n = Math.sin(x * 0.7) * Math.cos(z * 0.6) * Math.sin(y * 0.9);
      canopyCells.push({ x, y: y + 0.5, z, edge: shell, n, top: y >= maxY - 2 });
    }
    // しだれ: 樹冠の縁から垂れ下がる葉の筋
    if (style.strands) {
      for (let n = 0; n < 40; n++) {
        const ang = (n / 40) * Math.PI * 2, r = 20 + (n % 3);
        const x = Math.round(Math.cos(ang) * r), z = Math.round(Math.sin(ang) * r), len = 10 + (n * 7) % 9;
        for (let y = 25; y > 25 - len; y--) if ((y + n) % 3 !== 0) canopyCells.push({ x, y: y + 0.5, z, edge: true, n: 0.3, top: false, strand: true });
      }
    }
    TREE_H = maxY; CANOPY_RX = maxX; CANOPY_CUT = Math.round(minY);
    HOTSPOTS.research[1] = TREE_H + 2;
    buildCanopy();
  }
  function buildCanopy() {
    canopyHolder.clear();
    const v = [];
    if (season.bare) {
      // 雪: 幹・枝のボクセルのうち、真上が空いている面に白を乗せる
      const occ = new Set(trunkVox.map((t) => `${t.x},${Math.round(t.y - 0.5)},${t.z}`));
      trunkVox.forEach((tv) => { const y = Math.round(tv.y - 0.5); if (y > 2 && !occ.has(`${tv.x},${y + 1},${tv.z}`)) v.push({ x: tv.x, y: tv.y + 1, z: tv.z, c: 0xffffff }); });
    } else {
      const cells = canopyCells.filter((c) => c.n > -0.55 * season.density - 0.3);
      cells.forEach((c, i) => v.push({ x: c.x, y: c.y, z: c.z, c: season.canopy[(i * 7 + Math.abs(c.x) + Math.abs(c.z)) % season.canopy.length] }));
    }
    if (v.length) canopyHolder.add(makeVoxels(v, 1));
  }
  // 舞う粒子（花びら・葉・雪）
  const PMAX = 300;
  const particleMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), PMAX);
  particleMesh.count = PMAX; world.add(particleMesh);
  const particles = Array.from({ length: PMAX }, () => ({ x: 0, y: -10, z: 0, vx: 0, vz: 0, w: Math.random() * 6.28, life: 0 }));
  function respawn(pt) {
    const ang = Math.random() * 6.28, r = Math.random() * (season.bare ? 30 : CANOPY_RX);
    pt.x = Math.cos(ang) * r; pt.z = Math.sin(ang) * r;
    pt.y = season.bare ? 44 + Math.random() * 10 : CANOPY_CUT + Math.random() * 10;
    pt.vx = (Math.random() - 0.5) * 0.6; pt.vz = (Math.random() - 0.5) * 0.6; pt.w = Math.random() * 6.28; pt.life = 1;
  }
  function buildParticles() { particleMesh.material.color.set(season.particle); particleMesh.geometry.dispose(); particleMesh.geometry = new THREE.BoxGeometry(season.pSize, season.pSize * 0.6, season.pSize); particles.forEach((pt, i) => { pt.life = 0; pt.y = -10; }); }
  // ---- 街: 建物・木・人・装置・看板・郵便受け・文字 ----
  addThemed((t) => {
    const v = [
      ...building(t, -17, -16, 14, 7, 9, 0, 0),    // 研究棟（ウエスト4号館のイメージ）
      ...building(t, 18, -16, 11, 5, 8, 2, 2),     // 講義棟
      ...building(t, 20, 15, 8, 4, 7, 1, 1),       // 食堂（赤い屋根）
      ...building(t, -21, 8, 6, 3, 6, 1, 1),       // 売店
      ...building(t, -21, 17, 6, 4, 6, 0, 2),      // 小さな建物
      ...building(t, -6, -21, 6, 9, 6, 0, 3),      // 高い建物（ピンク）
      ...building(t, 6, -21, 6, 6, 5, 2, 1),       // 中くらいの建物（ミント）
      ...building(t, 24, -6, 5, 5, 5, 3, 0),       // 黄色い建物
      ...building(t, -24, -4, 4, 6, 5, 1, 2),      // 水色の細い建物
      ...building(t, 7, 22, 6, 5, 5, 4, 1),        // 白い建物（手前）
      ...building(t, -27, -25, 8, 5, 7, 0, 0),     // 外周: ピンク
      ...building(t, 27, -22, 7, 8, 6, 1, 3),      // 外周: 水色の高い建物
      ...building(t, 29, 8, 6, 4, 6, 3, 1),        // 外周: 黄色
      ...building(t, -28, 24, 7, 6, 6, 2, 2),      // 外周: ミント
      ...building(t, -10, -28, 10, 4, 7, 4, 0),    // 外周: 白い長い建物
      ...building(t, 22, 27, 6, 5, 5, 0, 1),       // 外周: ピンク（手前右）
    ];
    // 電子顕微鏡（塔の右奥）
    for (let y = 0; y < 6; y++) for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) v.push({ x: 12 + dx, y: y + 0.5, z: -8 + dz, c: y === 5 ? t.deviceLight : t.device });
    for (let dx = -2; dx <= 2; dx++) { v.push({ x: 12 + dx, y: 0.5, z: -4, c: t.device }); v.push({ x: 12 + dx, y: 1.5, z: -4, c: dx % 2 ? t.deviceLight : t.device }); }
    // 立て看板（進学・配属）と郵便受け（アクセス）
    for (let y = 0; y < 3; y++) v.push({ x: -12, y: y + 0.5, z: 10, c: 0x8a5a2b });
    for (let dx = -2; dx <= 2; dx++) for (let dy = 0; dy < 3; dy++) v.push({ x: -12 + dx, y: 3.5 + dy, z: 10, c: dy === 1 && Math.abs(dx) < 2 ? t.letter : t.sign });
    for (let y = 0; y < 2; y++) v.push({ x: 14, y: y + 0.5, z: 12, c: 0x8a93a3 });
    for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) v.push({ x: 14 + dx, y: 2.5 + dy, z: 11 + dz, c: dy ? 0xff7a59 : 0xd04a2a });
    return [makeVoxels(v, 1)];
  });
  // 小さな木（季節で色が変わる）
  const smallTreesHolder = new THREE.Group(); world.add(smallTreesHolder);
  const SMALL_TREES = [[-15, -21], [14, -22], [-24, -2], [24, 4], [12, 22], [2, 23], [-12, 23], [-20, -28], [-3, -24], [28, -10], [-29, 10], [16, 28], [-22, 28], [30, 18]];   // 建物と重ならない位置
  function buildSmallTrees() { smallTreesHolder.clear(); smallTreesHolder.add(makeVoxels(SMALL_TREES.flatMap(([x, z]) => tree(t, x, z, 1, season)), 1)); }

  // ---- 登場人物 6 人（統一デザイン）。動きは frame() で付ける ----
  const chars = {};
  const GROUND_Y = 0.3;                                   // 地面の上面の高さ（groundHolder.scale.y と合わせる）
  const place = (key, x, z, ry, look) => { const c = makeChar(MEMBER_LOOKS[look] || {}); c.g.position.set(x, GROUND_Y, z); c.g.rotation.y = ry; world.add(c.g); chars[key] = c; return c; };
  place('catchA', -11, 18, Math.PI / 2, 'tachikawa');              // キャッチボール（投げる側）
  place('catchB', 1, 18, -Math.PI / 2, 'kudo');                    // キャッチボール（受ける側）
  const batter = place('batter', 9, 2, Math.PI / 2, 'shiiba');     // 素振り（大木のすぐ隣、外向き）
  const batMesh = bat(6, 0xc9a06a); batMesh.rotation.y = 0.8; batter.armR.add(batMesh);   // バット（右手に付け、左手も同じ位置に寄せて両手持ちに見せる。肩の斜め上に構える）
  const climber = place('climber', 0, 0, 0, 'kaneko');             // 木登り（幹に張り付く）
  const runner = place('runner', 15.5, 0, 0, 'kuboya');            // 校庭（環状の道）をマラソン
  place('backpain', -23, 23, -0.8, 'kimura');                      // 腰が痛そうな人（手前左の角）
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffffff })); ball.castShadow = true; world.add(ball);

  // ---- 塔の周りを飛ぶ飛行機 ----
  const plane = new THREE.Group();
  const planeVox = [];
  for (let x = -3; x <= 3; x++) planeVox.push({ x, y: 0, z: 0, k: 'body' });                   // 胴体
  for (let z = -4; z <= 4; z++) planeVox.push({ x: 0, y: 0, z, k: z === 0 ? 'body' : 'accent' }); // 主翼
  planeVox.push({ x: -3, y: 1, z: 0, k: 'accent' }, { x: -3, y: 0, z: -1, k: 'body' }, { x: -3, y: 0, z: 1, k: 'body' }); // 尾翼
  planeVox.push({ x: 3, y: 0, z: 0, k: 'nose' });                                                // 機首
  // world.add(plane);   // 飛行機は 2026-10-26 のユーザー要望で非表示（コードは残置。戻すときはこの行を有効にする）

  // ---- クリックできる目印（模型のローカル座標）。4 つ目が true なら塔の伸びに追従 ----
  const HOTSPOTS = {
    research: [0, 42, 0, true],           // 樹冠のてっぺん（高さは buildTreeShape が更新）
    publications: [12, 24, 9, true],       // 枝の上
    about: [-17, 8, -16],                   // 研究棟の屋上
    members: [-5, 7, 18],                   // キャッチボールの間
    equipment: [12, 8, -8],                 // 電子顕微鏡
    join: [-12, 7, 10],                     // 立て看板
    access: [14, 5, 12],                    // 郵便受け
  };

  // ---- 操作: ドラッグで回転 ----
  let dragging = false, lastX = 0, dragVel = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; dragVel = 0; canvas.setPointerCapture(e.pointerId); });
  addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; dragVel = dx * 0.008; orbit -= dragVel; });
  addEventListener('pointerup', () => { dragging = false; });
  addEventListener('pointercancel', () => { dragging = false; });

  let wide = true;
  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    wide = w > 900;
  }
  addEventListener('resize', resize); resize();
  let scrollY = window.scrollY;
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // 模型のおおよその大きさ（カメラ距離の計算用）
  const HALF_W = 44, HALF_H = 38, CENTER_Y = 17;
  let orbit = 0;                                          // 観測者（カメラ）が模型の周りを回る角度。模型自体は回さない
  const timer = new THREE.Timer();
  const m4 = new THREE.Matrix4();
  let alive = true, lastTown = null;
  function frame() {
    if (!alive) return;
    timer.update();
    const dt = Math.min(0.05, timer.getDelta()), time = timer.getElapsed();
    // 大木: 苗から 3 秒で育つ
    const growth = prefersReduced ? 1 : Math.min(1, time / 3);
    const ease = 1 - Math.pow(1 - growth, 3);
    bigTree.scale.setScalar(0.15 + 0.85 * ease);
    canopyHolder.rotation.y = Math.sin(time * 0.4) * 0.01;          // 風でわずかに揺れる
    // 舞う粒子: 樹冠（冬は空）から落ち、地面で消えて再出現
    let alivePts = 0;
    for (let i = 0; i < PMAX; i++) {
      const pt = particles[i];
      if (i < season.pCount && pt.life <= 0 && Math.random() < 0.02) respawn(pt);
      if (pt.life > 0 && !prefersReduced) {
        pt.y -= dt * season.fall * (0.8 + 0.4 * Math.sin(pt.w)); pt.x += (pt.vx + Math.sin(time * 1.3 + pt.w) * 0.6) * dt * season.drift; pt.z += (pt.vz + Math.cos(time * 1.1 + pt.w) * 0.6) * dt * season.drift;
        if (pt.y < 1) pt.life = 0;
      }
      if (pt.life > 0) { alivePts++; m4.makeRotationY(time + pt.w); m4.setPosition(pt.x, pt.y, pt.z); } else m4.makeTranslation(0, -50, 0);
      particleMesh.setMatrixAt(i, m4);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    // 登場人物の動き
    const swingLeg = (c, ph, amp = 0.6) => { c.legL.rotation.x = Math.sin(ph) * amp; c.legR.rotation.x = -Math.sin(ph) * amp; };
    // キャッチボール: ボールは 2 人の間を放物線で往復。投げる側の腕が振られる
    const T = 2.2, ph = (time % (2 * T)) / T, u = ph < 1 ? ph : 2 - ph;
    ball.position.set(-11 + 12 * u, GROUND_Y + 3.5 + Math.sin(u * Math.PI) * 4, 18);
    const cA = chars.catchA, cB = chars.catchB;
    cA.armR.rotation.x = ph < 1 ? -Math.PI * 0.8 * (1 - Math.min(1, ph * 4)) : -Math.PI * 0.8 * Math.min(1, (ph - 1) * 4);
    cB.armR.rotation.x = ph < 1 ? -Math.PI * 0.6 * Math.min(1, ph * 1.2) : -Math.PI * 0.6 * (1 - Math.min(1, (ph - 1) * 1.5));
    cA.armL.rotation.x = -0.3; cB.armL.rotation.x = -0.3;
    // 素振り: 構え → 一気に振る → 戻す（3 秒周期）
    const bt = time % 3, sw = bt < 1.8 ? 0 : bt < 2.1 ? (bt - 1.8) / 0.3 : bt < 2.6 ? 1 : 1 - (bt - 2.6) / 0.4;
    batter.torso.rotation.y = -0.6 + sw * 1.8; batter.head.rotation.y = -0.3 + sw * 0.6;
    batter.armR.rotation.x = -1.0 + sw * 0.25; batter.armR.rotation.z = -0.6; batter.armL.rotation.x = -1.0 + sw * 0.25; batter.armL.rotation.z = 0.6;   // 両腕を内側に寄せて体の前で手を合わせ、バットを両手で握る
    batter.legL.rotation.x = 0.2 - sw * 0.3; batter.legR.rotation.x = -0.1 + sw * 0.3;
    // 木登り: 幹に張り付いて上り下り。手足を交互に動かす
    const cy = 4 + (Math.sin(time * 0.35) * 0.5 + 0.5) * 9, cang = 0.9;
    const trunkR = treeStyle.trunk.r + 0.9;
    climber.g.position.set(Math.cos(cang) * trunkR, cy, Math.sin(cang) * trunkR); climber.g.rotation.y = -cang - Math.PI / 2;   // 顔を幹に向ける
    climber.g.rotation.x = 0.2;                                       // 少し前傾して幹に抱きつく
    climber.armL.rotation.x = -Math.PI * 0.85 + Math.sin(time * 2.5) * 0.3; climber.armR.rotation.x = -Math.PI * 0.85 - Math.sin(time * 2.5) * 0.3;
    climber.legL.rotation.x = -0.7 + Math.sin(time * 2.5 + 1.5) * 0.4; climber.legR.rotation.x = -0.7 - Math.sin(time * 2.5 + 1.5) * 0.4;
    // マラソン: 環状の道（半径 15.5）を一周 20 秒で走る
    const ra = time * (Math.PI * 2 / 20), rr = 15.5;
    runner.g.position.set(Math.cos(ra) * rr, GROUND_Y + Math.abs(Math.sin(time * 9)) * 0.25, Math.sin(ra) * rr); runner.g.rotation.y = -ra;
    swingLeg(runner, time * 9, 0.8); runner.armL.rotation.x = Math.sin(time * 9 + Math.PI) * 0.9 - 0.4; runner.armR.rotation.x = Math.sin(time * 9) * 0.9 - 0.4;
    // 腰が痛そうな人: 前かがみで腰に手を当て、ときどき伸ばそうとして戻る
    const bp = chars.backpain, strain = 0.5 + Math.max(0, Math.sin(time * 0.8)) * 0.25;
    bp.torso.rotation.x = strain; bp.head.rotation.x = strain - 0.2;
    bp.armR.rotation.x = Math.PI * 0.7; bp.armR.rotation.z = -0.5;      // 右手を腰の後ろへ
    bp.armL.rotation.x = strain * 0.6;                                   // 左手は膝の方へ
    bp.g.position.y = GROUND_Y - strain * 0.25;
    // 飛行機: 塔の周りを旋回しつつ上下にうねる
    const pa = time * 0.5, pr = 20;
    plane.position.set(Math.cos(pa) * pr, 26 + Math.sin(time * 0.9) * 4, Math.sin(pa) * pr);
    plane.rotation.set(0, -pa - Math.PI / 2 + Math.PI, 0); plane.rotation.z = 0.35; plane.rotation.x = Math.cos(time * 0.9) * 0.15;
    // スクロール進行 0 → 1 で右（縮小）から中央（拡大）へ
    // タウンビューの節（#town）が画面下端に現れてから上端近くに達するまでを 0 → 1 にする（ヒーローの長さに依存しない）
    const townEl = document.getElementById('town');
    const townTop = townEl ? townEl.getBoundingClientRect().top : innerHeight - scrollY;
    const prog = Math.max(0, Math.min(1, (innerHeight * 0.75 - townTop) / (innerHeight * 0.7)));   // 節の上端が画面の 75% の高さに来たら始め、5% で完了
    const pe = prog < 0.5 ? 2 * prog * prog : 1 - Math.pow(-2 * prog + 2, 2) / 2;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dVert = HALF_H / tanV * 1.08;
    const dHoriz = (f) => HALF_W / (tanV * camera.aspect * f) * 1.08;
    // 最上部（ヒーロー）: 右半分に収まる距離。タウンビュー: 画面を大きく使い、やや右寄せで少しはみ出す
    // エントランスビュー: 右寄りだが大きめで、左の文章領域に少しかかる。タウンビュー: 画面を大きく使い、やや右寄せ
    const dHero = Math.max(dVert, dHoriz(wide ? 0.64 : 1)) * (wide ? 0.95 : 1);
    const dTown = Math.max(dVert, dHoriz(wide ? 0.8 : 1)) * (wide ? 0.98 : 1.0);   // 画面に見切れない大きさ
    const d = dHero + (dTown - dHero) * pe;
    const fw = camera.getFilmWidth();
    camera.filmOffset = wide ? -fw * (0.23 * (1 - pe) + 0.12 * pe) : 0;   // エントランスでは文章と重ならないよう右に寄せる
    camera.position.set(Math.sin(orbit) * d, CENTER_Y + d * 0.24, Math.cos(orbit) * d); camera.lookAt(0, CENTER_Y, 0); camera.updateProjectionMatrix();   // 月が地球を回るように、カメラが周回
    world.position.set(0, wide ? 0 : -20 * (1 - pe), 0);
    // 自転: ヒーローではやや速く、タウンビューではゆっくり。ドラッグ中は止め、離すと惰性のあと再開
    if (!dragging) {
      const spin = prefersReduced ? 0 : (prog < 0.5 ? 0.22 : 0.08);
      orbit -= dt * spin + dragVel; dragVel *= 0.92;
    }
    const town = prog > 0.55;
    if (town !== lastTown) {
      lastTown = town;
      document.body.classList.toggle('town-view', town); document.body.classList.toggle('entrance-view', !town);
      if (!town) {   // エントランスに戻ったら、目印の説明と点線を消す
        document.querySelectorAll('.marker.hover, .spot-info.on').forEach((el) => el.classList.remove('hover', 'on'));
      }
    }
    renderer.render(scene, camera);
    updateMarkers();
    requestAnimationFrame(frame);
  }

  const markerEls = [...document.querySelectorAll('[data-spot]')];
  const v3 = new THREE.Vector3();
  function updateMarkers() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    for (const el of markerEls) {
      const pos = HOTSPOTS[el.dataset.spot]; if (!pos) continue;
      if (pos[3]) v3.set(pos[0] * bigTree.scale.x, pos[1] * bigTree.scale.y, pos[2] * bigTree.scale.z); else v3.set(pos[0], pos[1], pos[2]);
      world.localToWorld(v3); v3.project(camera);
      const visible = v3.z < 1;
      el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * w}px, ${(-v3.y * 0.5 + 0.5) * h}px)`;
      el.style.opacity = visible ? '1' : '0'; el.style.pointerEvents = visible ? 'auto' : 'none';
      el._sx = (v3.x * 0.5 + 0.5) * w; el._sy = (-v3.y * 0.5 + 0.5) * h;
    }
    // 点線: ホバー中の目印から、左の説明パネルの見出しへ
    const leader = document.getElementById('leader'); if (!leader) return;
    const active = markerEls.find((el) => el.classList.contains('hover'));
    const info = active && document.querySelector('.spot-info[data-for="' + active.dataset.spot + '"]');
    const town = document.body.classList.contains('town-view');
    if (!active || !info || !town) { leader.classList.remove('on'); return; }
    const head = info.querySelector('h3'); const r = (head || info).getBoundingClientRect();
    const ax = r.right + 14, ay = r.top + r.height / 2;
    const mx = active._sx, my = active._sy;
    const cx = (ax + mx) / 2, cy = Math.min(ay, my) - 40;              // 少し上に膨らむ曲線
    leader.setAttribute('viewBox', `0 0 ${w} ${h}`);
    leader.querySelector('path').setAttribute('d', `M ${ax} ${ay} Q ${cx} ${cy} ${mx} ${my}`);
    leader.classList.add('on');
  }

  function applyTheme(name) {
    t = THEMES[name] || THEMES.yellow;
    scene.background = new THREE.Color(t.bg); scene.fog = new THREE.Fog(t.bg, 160, 320);
    hemi.color.set(t.hemiSky); hemi.groundColor.set(t.hemiGround); hemi.intensity = t.hemiI; sun.color.set(t.sun); sun.intensity = t.sunI;
    edge.material.color.set(t.base); buildGround(); buildSmallTrees();
    for (const th of themed) { th.holder.clear(); th.fn(t).forEach((m) => th.holder.add(m)); }
    plane.clear(); plane.add(makeVoxels(planeVox.map((p) => ({ ...p, c: p.k === 'nose' ? 0x303030 : p.k === 'accent' ? t.planeAccent : t.plane })), 0.7));
  }
  let seasonKey = seasonName;
  function applySeason(name, styleName) {
    seasonKey = SEASONS[name] ? name : 'autumn';
    season = SEASONS[seasonKey];
    buildGround(); buildParticles(); buildSmallTrees();
    buildTreeShape(TREE_STYLES[styleName || SEASON_STYLE[seasonKey]] || TREE_STYLES.umbrella);   // 中で buildCanopy も走る
  }
  function applyTreeStyle(name) { buildTreeShape(TREE_STYLES[name] || TREE_STYLES.umbrella); }
  // 画像の書き出し（確認用）: 木を正面から収めた 1 枚を JPEG の data URL で返す
  function capture(w = 1200, h = 800, dist = 125, lookY = 22, tx = 0, tz = 0) {
    const saved = { pos: camera.position.clone(), fo: camera.filmOffset, aspect: camera.aspect, rot: world.rotation.y, size: renderer.getSize(new THREE.Vector2()), pr: renderer.getPixelRatio() };
    renderer.setPixelRatio(1); renderer.setSize(w, h, false); camera.aspect = w / h; camera.filmOffset = 0;
    camera.position.set(tx, lookY + dist * 0.42, tz + dist); camera.lookAt(tx, lookY, tz); camera.updateProjectionMatrix();
    const savedScale = bigTree.scale.x; bigTree.scale.setScalar(1);        // 成木の大きさで写す
    renderer.render(scene, camera);
    bigTree.scale.setScalar(savedScale);
    const url = renderer.domElement.toDataURL('image/jpeg', 0.9);
    renderer.setPixelRatio(saved.pr); renderer.setSize(saved.size.x, saved.size.y, false); camera.aspect = saved.aspect; camera.filmOffset = saved.fo; camera.position.copy(saved.pos); camera.updateProjectionMatrix();
    return url;
  }
  applyTheme(themeName); applySeason(seasonName);
  frame();
  function dispose() { alive = false; renderer.dispose(); }
  return { applyTheme, applySeason, applyTreeStyle, capture, renderPortrait, dispose, renderer, camera, world, HOTSPOTS, TREE_STYLES, SEASON_STYLE };
}
