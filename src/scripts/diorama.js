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
    bldg: [0xf3eadb, 0xffffff, 0xe8dcc4], roof: [0x8c98a8, 0xe85c4a, 0x5f6b7a], window: 0x8fd3f4, tree: 0x3f9b3a, treeLight: 0x6fcf5a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xff7a59,
    hemiSky: 0xffffff, hemiGround: 0xc8902a, sun: 0xfff2d0, sunI: 2.2, hemiI: 0.9, emissive: 0x000000 },
  navy: { bg: 0x1f2a44, base: 0xf6c945, grain: [0xffd964, 0xf2c23a, 0xffe17a, 0xe8b52e], road: 0xfff2c0,
    wire: 0xe8ecf3, wireEdge: 0xffffff, atom: 0xff7a59, electron: 0x8fd3ff,
    person: [0xffffff, 0xff7a59, 0x8fd3ff, 0x5bc96a], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0xb8c0cc, deviceLight: 0x5bc96a, letter: 0x1f2a44, sign: 0xffffff,
    bldg: [0xffffff, 0xf3eadb, 0xe8dcc4], roof: [0x2f3a5c, 0xe85c4a, 0x5f6b7a], window: 0x8fd3f4, tree: 0x3f9b3a, treeLight: 0x6fcf5a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xff7a59,
    hemiSky: 0xcfdcff, hemiGround: 0x2a3550, sun: 0xffffff, sunI: 2.0, hemiI: 0.8, emissive: 0x000000 },
  green: { bg: 0x1f5a3a, base: 0x2f7a52, grain: [0x4fa86e, 0x5cb87a, 0x44995f, 0x6ac688], road: 0xe9e0c4,
    wire: 0xe6ebe8, wireEdge: 0xffffff, atom: 0xffd84a, electron: 0xffffff,
    person: [0xffffff, 0xffd84a, 0xff7a59, 0x8fd3ff], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0x9aa5a0, deviceLight: 0xffd84a, letter: 0x0f2a20, sign: 0xffffff,
    bldg: [0xf3eadb, 0xffffff, 0xe8dcc4], roof: [0x8c98a8, 0xe85c4a, 0x5f6b7a], window: 0x8fd3f4, tree: 0x2f7a3a, treeLight: 0x5bc96a, trunk: 0x8a5a2b, plane: 0xffffff, planeAccent: 0xffd84a,
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
  spring: { canopy: [0xf7b6d2, 0xf49ac1, 0xfde2ec, 0xf28cb8], bare: false, density: 1.0, ground: [0x8cd65a, 0x7ac44a, 0x98de68, 0x86cc56], particle: 0xfbc8dc, pCount: 220, pSize: 0.5, fall: 1.6, drift: 1.2 },
  summer: { canopy: [0x2e8b3d, 0x3fa34a, 0x55b85a, 0x237a33], bare: false, density: 1.0, ground: [0x6fbf47, 0x5fae3c, 0x7fcc55, 0x66b542], particle: 0x9ad66a, pCount: 40, pSize: 0.35, fall: 1.0, drift: 0.8 },
  autumn: { canopy: [0xe0522f, 0xf08a24, 0xf2b53a, 0xc7391f], bare: false, density: 0.92, ground: [0xb9c25a, 0xa8b24c, 0xc6cc66, 0xb0b854], particle: 0xf08a24, pCount: 180, pSize: 0.5, fall: 2.0, drift: 1.6 },
  winter: { canopy: [0xffffff, 0xf2f6fb, 0xe6edf5, 0xffffff], bare: true, density: 0.45, ground: [0xf4f7fb, 0xe9eef5, 0xffffff, 0xeef2f8], particle: 0xffffff, pCount: 260, pSize: 0.4, fall: 1.2, drift: 0.9 },
};
export const SEASON_NAMES = Object.keys(SEASONS);
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
function tree(t, x, z, s = 1) {
  const v = [];
  for (let y = 0; y < 2 * s; y++) v.push({ x, y: y + 0.5, z, c: t.trunk });
  const r = 1 + s;
  for (let i = -r; i <= r; i++) for (let j = 0; j <= r + 1; j++) for (let k = -r; k <= r; k++) {
    if (i * i + (j - r * 0.6) * (j - r * 0.6) + k * k <= r * r + 0.5) v.push({ x: x + i, y: 2 * s + j + 0.5, z: z + k, c: (i + j) % 3 === 0 ? t.treeLight : t.tree });
  }
  return v;
}

export function createDiorama(canvas, { themeName = 'yellow', seasonName = seasonForDate(), base = '/' } = {}) {
  let t = THEMES[themeName] || THEMES.yellow;
  let season = SEASONS[seasonName] || SEASONS.autumn;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 600);
  scene.add(camera);

  const hemi = new THREE.HemisphereLight(t.hemiSky, t.hemiGround, t.hemiI); scene.add(hemi);
  const sun = new THREE.DirectionalLight(t.sun, t.sunI); sun.position.set(60, 90, 40); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 90, bottom: -60, far: 300 }); sun.shadow.bias = -0.0005;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-40, 30, -40); scene.add(rim);

  const world = new THREE.Group(); scene.add(world);
  const themed = [];                              // テーマで色が変わる InstancedMesh の組み立て関数
  const addThemed = (fn) => { const holder = new THREE.Group(); world.add(holder); themed.push({ holder, fn }); };

  // ---- 台座（芝生の広場）＋ 環状の道。地面の色は季節で変わる ----
  const N = 26;
  const groundVox = [];
  for (let gx = -N; gx < N; gx++) for (let gz = -N; gz < N; gz++) {
    const cx = gx + 0.5, cz = gz + 0.5, d = Math.hypot(cx, cz);
    const gi = Math.floor((Math.sin(gx * 0.9) + Math.cos(gz * 1.1) + Math.sin((gx + gz) * 0.5)) * 1.5 + 4) % 4;
    const road = Math.abs(d - 15.5) < 1.3 || (Math.abs(cx) < 1.3 && d > 15) || (Math.abs(cz) < 1.3 && d > 15);
    for (let y = -2; y <= 0; y++) groundVox.push({ x: cx, y: y + 0.5, z: cz, top: y === 0, road, gi });
  }
  const groundHolder = new THREE.Group(); world.add(groundHolder);
  function buildGround() {
    groundHolder.clear();
    groundHolder.add(makeVoxels(groundVox.map((v) => ({ ...v, c: v.top ? (v.road ? t.road : season.ground[v.gi]) : t.base })), 1));
  }
  const edge = new THREE.Mesh(new THREE.BoxGeometry(N * 2 + 2, 1, N * 2 + 2), new THREE.MeshLambertMaterial({ color: t.base })); edge.position.y = -3; edge.receiveShadow = true; world.add(edge);

  // ---- 大木（傘状の広葉樹）。幹・枝は固定、葉（樹冠）と雪は季節で作り直す ----
  const TREE_H = 40;                                   // 樹冠の最上部の高さ（目印の位置計算にも使う）
  const bigTree = new THREE.Group(); world.add(bigTree);
  const trunkVox = [];
  // 幹: 根元が太く上へ細くなる
  for (let y = 0; y < 20; y++) {
    const r = y < 3 ? 3.6 : 3.2 - y * 0.06;
    for (let i = -4; i <= 4; i++) for (let k = -4; k <= 4; k++) if (i * i + k * k <= r * r) trunkVox.push({ x: i, y: y + 0.5, z: k, c: (i + k + y) % 5 === 0 ? 0x5a3a22 : 0x6b4a2b });
  }
  // 枝: 幹の上部から放射状に伸び、傘の内側を支える
  const branchTips = [];
  for (let n = 0; n < 9; n++) {
    const ang = (n / 9) * Math.PI * 2 + 0.3, len = 17 + (n % 3) * 3;
    const y0 = 13 + (n % 2) * 3, y1 = 23 + (n % 3) * 2;
    for (let st = 0; st <= 24; st++) {
      const u = st / 24, r = u * len, y = y0 + (y1 - y0) * Math.sin(u * Math.PI / 2);
      const x = Math.cos(ang) * r, z = Math.sin(ang) * r;
      trunkVox.push({ x: Math.round(x), y: Math.round(y) + 0.5, z: Math.round(z), c: 0x5a3a22 });
      if (u > 0.3 && st % 2 === 0) trunkVox.push({ x: Math.round(x + Math.cos(ang + 1.57) * 1), y: Math.round(y) + 0.5, z: Math.round(z + Math.sin(ang + 1.57) * 1), c: 0x5a3a22 });
    }
    branchTips.push([Math.cos(ang) * len, y1, Math.sin(ang) * len]);
  }
  bigTree.add(makeVoxels(trunkVox, 1));
  const canopyHolder = new THREE.Group(); bigTree.add(canopyHolder);
  // 樹冠: 横に広い楕円体を下側で切った傘形。表面の層だけを置き、縁はまばらにして葉のまとまりを出す
  const canopyCells = [];
  const RX = 23, RY = 10, RZ = 23, CY = 27, CUT = 22;
  const inside = (x, y, z) => ((x * x) / (RX * RX) + ((y - CY) * (y - CY)) / (RY * RY) + (z * z) / (RZ * RZ)) <= 1 && y >= CUT;
  for (let x = -RX; x <= RX; x++) for (let y = CUT; y <= CY + RY; y++) for (let z = -RZ; z <= RZ; z++) {
    if (!inside(x, y, z)) continue;
    const shell = !(inside(x + 1, y, z) && inside(x - 1, y, z) && inside(x, y + 1, z) && inside(x, y - 1, z) && inside(x, y, z + 1) && inside(x, y, z - 1));
    const shell2 = !(inside(x + 2, y, z) && inside(x - 2, y, z) && inside(x, y + 2, z) && inside(x, y - 2, z) && inside(x, y, z + 2) && inside(x, y, z - 2));
    if (!shell2) continue;                                          // 厚さ 2 の表面だけ
    const n = Math.sin(x * 0.7) * Math.cos(z * 0.6) * Math.sin(y * 0.9);
    canopyCells.push({ x, y: y + 0.5, z, edge: shell, n, top: y >= CY + RY - 2 });
  }
  function buildCanopy() {
    canopyHolder.clear();
    const cells = canopyCells.filter((c) => {
      if (season.bare) return c.top || c.n > 0.45;                  // 冬: 上面の雪と、枝先に残る雪の塊だけ
      return c.n > -0.55 * season.density - 0.3;                     // 縁をまばらに
    });
    const v = cells.map((c, i) => ({ x: c.x, y: c.y, z: c.z, c: season.canopy[(i * 7 + Math.abs(c.x) + Math.abs(c.z)) % season.canopy.length] }));
    if (season.bare) {                                              // 冬: 枝の上に雪を乗せる
      trunkVox.forEach((tv, i) => { if (tv.y > 12 && i % 2 === 0) v.push({ x: tv.x, y: tv.y + 1, z: tv.z, c: 0xffffff }); });
    }
    canopyHolder.add(makeVoxels(v, 1));
  }
  // 舞う粒子（花びら・葉・雪）
  const PMAX = 300;
  const particleMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), PMAX);
  particleMesh.count = PMAX; world.add(particleMesh);
  const particles = Array.from({ length: PMAX }, () => ({ x: 0, y: -10, z: 0, vx: 0, vz: 0, w: Math.random() * 6.28, life: 0 }));
  function respawn(pt) {
    const ang = Math.random() * 6.28, r = Math.random() * (season.bare ? 30 : RX);
    pt.x = Math.cos(ang) * r; pt.z = Math.sin(ang) * r;
    pt.y = season.bare ? 44 + Math.random() * 10 : CUT + Math.random() * 10;
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
      ...tree(t, -8, -21, 1), ...tree(t, 8, -22, 1), ...tree(t, -24, -2, 1), ...tree(t, 24, 2, 1), ...tree(t, 12, 22, 1), ...tree(t, 2, 23, 1), ...tree(t, -12, 23, 1), ...tree(t, 24, -5, 1), ...tree(t, -3, -24, 1),
    ];
    // 電子顕微鏡（塔の右奥）
    for (let y = 0; y < 6; y++) for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) v.push({ x: 12 + dx, y: y + 0.5, z: -8 + dz, c: y === 5 ? t.deviceLight : t.device });
    for (let dx = -2; dx <= 2; dx++) { v.push({ x: 12 + dx, y: 0.5, z: -4, c: t.device }); v.push({ x: 12 + dx, y: 1.5, z: -4, c: dx % 2 ? t.deviceLight : t.device }); }
    // 立て看板（進学・配属）と郵便受け（アクセス）
    for (let y = 0; y < 3; y++) v.push({ x: -12, y: y + 0.5, z: 10, c: 0x8a5a2b });
    for (let dx = -2; dx <= 2; dx++) for (let dy = 0; dy < 3; dy++) v.push({ x: -12 + dx, y: 3.5 + dy, z: 10, c: dy === 1 && Math.abs(dx) < 2 ? t.letter : t.sign });
    for (let y = 0; y < 2; y++) v.push({ x: 14, y: y + 0.5, z: 12, c: 0x8a93a3 });
    for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) v.push({ x: 14 + dx, y: 2.5 + dy, z: 11 + dz, c: dy ? 0xff7a59 : 0xd04a2a });
    // 「M2D」の文字（手前の縁）
    const FONT = { M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], 2: ['####.', '....#', '.###.', '#....', '#####'], D: ['####.', '#...#', '#...#', '#...#', '####.'] };
    ['M', '2', 'D'].forEach((ch, li) => FONT[ch].forEach((row, ry) => [...row].forEach((c, cx) => { if (c === '#') v.push({ x: -8 + li * 6 + cx, y: 4.5 - ry, z: 24.5, c: t.letter }); })));
    const meshes = [makeVoxels(v, 1)];
    // 見上げる研究者たち
    [[-9, 7, 0, 0.4], [9, 5, 1, -0.6], [3, 11, 2, 0], [-13, -3, 1, 1.2], [16, 6, 3, -1.2]].forEach(([x, z, c, f]) => meshes.push(person(t, x, z, c, f)));
    return meshes;
  });

  // ---- キャッチボールをする学生 2 人とボール ----
  addThemed((t) => [person(t, -10, 18, 2, Math.PI / 2), person(t, 0, 18, 3, -Math.PI / 2)]);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffffff })); ball.castShadow = true; world.add(ball);

  // ---- 塔の周りを飛ぶ飛行機 ----
  const plane = new THREE.Group();
  const planeVox = [];
  for (let x = -3; x <= 3; x++) planeVox.push({ x, y: 0, z: 0, k: 'body' });                   // 胴体
  for (let z = -4; z <= 4; z++) planeVox.push({ x: 0, y: 0, z, k: z === 0 ? 'body' : 'accent' }); // 主翼
  planeVox.push({ x: -3, y: 1, z: 0, k: 'accent' }, { x: -3, y: 0, z: -1, k: 'body' }, { x: -3, y: 0, z: 1, k: 'body' }); // 尾翼
  planeVox.push({ x: 3, y: 0, z: 0, k: 'nose' });                                                // 機首
  world.add(plane);                                                                              // 色は applyTheme で付ける

  // ---- クリックできる目印（模型のローカル座標）。4 つ目が true なら塔の伸びに追従 ----
  const HOTSPOTS = {
    research: [0, TREE_H + 2, 0, true],   // 樹冠のてっぺん（木の成長に追従）
    publications: [12, 24, 9, true],       // 枝の上
    about: [-17, 8, -16],                   // 研究棟の屋上
    members: [-5, 6, 18],                   // キャッチボールの間
    equipment: [12, 8, -8],                 // 電子顕微鏡
    join: [-12, 7, 10],                     // 立て看板
    access: [14, 5, 12],                    // 郵便受け
  };

  // ---- 操作: ドラッグで回転 ----
  let dragging = false, lastX = 0, dragVel = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; dragVel = 0; canvas.setPointerCapture(e.pointerId); });
  addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; dragVel = dx * 0.008; world.rotation.y += dragVel; });
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
  const HALF_W = 38, HALF_H = 34, CENTER_Y = 18;
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
    // キャッチボール: 2 人の間を放物線で往復
    const T = 2.2, ph = (time % (2 * T)) / T, u = ph < 1 ? ph : 2 - ph;
    ball.position.set(-10 + 10 * u, 3 + Math.sin(u * Math.PI) * 4, 18);
    // 飛行機: 塔の周りを旋回しつつ上下にうねる
    const pa = time * 0.5, pr = 20;
    plane.position.set(Math.cos(pa) * pr, 26 + Math.sin(time * 0.9) * 4, Math.sin(pa) * pr);
    plane.rotation.set(0, -pa - Math.PI / 2 + Math.PI, 0); plane.rotation.z = 0.35; plane.rotation.x = Math.cos(time * 0.9) * 0.15;
    // スクロール進行 0 → 1 で右（縮小）から中央（拡大）へ
    const prog = Math.max(0, Math.min(1, scrollY / (innerHeight * 0.9)));
    const pe = prog < 0.5 ? 2 * prog * prog : 1 - Math.pow(-2 * prog + 2, 2) / 2;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dVert = HALF_H / tanV * 1.08;
    const dHoriz = (f) => HALF_W / (tanV * camera.aspect * f) * 1.08;
    // 最上部（ヒーロー）: 右半分に収まる距離。タウンビュー: 画面を大きく使い、やや右寄せで少しはみ出す
    // エントランスビュー: 右寄りだが大きめで、左の文章領域に少しかかる。タウンビュー: 画面を大きく使い、やや右寄せ
    const dHero = Math.max(dVert, dHoriz(wide ? 0.64 : 1)) * (wide ? 0.95 : 1);
    const dTown = Math.max(dVert, dHoriz(wide ? 0.8 : 1)) * (wide ? 0.86 : 0.95);
    const d = dHero + (dTown - dHero) * pe;
    const fw = camera.getFilmWidth();
    camera.filmOffset = wide ? -fw * (0.19 * (1 - pe) + 0.12 * pe) : 0;
    camera.position.set(0, CENTER_Y + d * 0.36, d); camera.lookAt(0, CENTER_Y, 0); camera.updateProjectionMatrix();
    world.position.set(0, wide ? 0 : -20 * (1 - pe), 0);
    // 自転: ヒーローではやや速く、タウンビューではゆっくり。ドラッグ中は止め、離すと惰性のあと再開
    if (!dragging) {
      const spin = prefersReduced ? 0 : (prog < 0.5 ? 0.22 : 0.08);
      world.rotation.y += dt * spin + dragVel; dragVel *= 0.92;
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
    edge.material.color.set(t.base); buildGround();
    for (const th of themed) { th.holder.clear(); th.fn(t).forEach((m) => th.holder.add(m)); }
    plane.clear(); plane.add(makeVoxels(planeVox.map((p) => ({ ...p, c: p.k === 'nose' ? 0x303030 : p.k === 'accent' ? t.planeAccent : t.plane })), 0.7));
  }
  function applySeason(name) {
    season = SEASONS[name] || SEASONS.autumn;
    buildGround(); buildCanopy(); buildParticles();
  }
  applyTheme(themeName); applySeason(seasonName);
  frame();
  function dispose() { alive = false; renderer.dispose(); }
  return { applyTheme, applySeason, dispose, renderer, camera, world, HOTSPOTS };
}
