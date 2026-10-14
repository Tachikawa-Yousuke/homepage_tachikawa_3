// 研究室のシンボル「一本の巨大なナノワイヤの塔」の 3D ジオラマ（three.js）。
// すべてコードで組んだ立方体・多角柱で構成し、画像やモデルファイルは使わない。
// テーマ（黄 / 黒）は <html data-theme> を読んで色と光を切り替える。
import * as THREE from 'three';

const THEMES = {
  yellow: {
    bg: 0xf6c945, fog: 0xf6c945,
    base: 0x2f3a5c, baseTop: 0x3c4a73, grain: [0x4a5a8a, 0x55679c, 0x3f4f80, 0x5f72a8],
    wire: 0xd9dde6, wireEdge: 0xffffff, atom: 0xff7a59, electron: 0x2f6fd8,
    person: [0xffffff, 0xff7a59, 0x2f6fd8], skin: 0xf2c9a0, hair: 0x3a2a1a,
    device: 0x8a93a3, deviceLight: 0x5bc96a, letter: 0x1f2a44,
    hemiSky: 0xffffff, hemiGround: 0xc8902a, sun: 0xfff2d0, sunI: 2.2, hemiI: 0.9, emissive: 0x000000,
  },
  black: {
    bg: 0x0a0a0c, fog: 0x0a0a0c,
    base: 0x161922, baseTop: 0x1e2230, grain: [0x262b3a, 0x2d3345, 0x20242f, 0x343a4e],
    wire: 0xcfd4de, wireEdge: 0xffffff, atom: 0xffd84a, electron: 0x5ad6ff,
    person: [0xf4f4f4, 0xffd84a, 0x5ad6ff], skin: 0xf2c9a0, hair: 0x2a2a2a,
    device: 0x5a6070, deviceLight: 0x5ad6ff, letter: 0xffd84a,
    hemiSky: 0x8fa8ff, hemiGround: 0x1a1a22, sun: 0xffffff, sunI: 1.6, hemiI: 0.6, emissive: 0x111318,
  },
};

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeVoxels(list, scale = 1) {
  // list: [{x,y,z,c}] を 1 つの InstancedMesh にまとめる
  const geo = new THREE.BoxGeometry(scale, scale, scale);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: false });
  const mesh = new THREE.InstancedMesh(geo, mat, list.length);
  const m = new THREE.Matrix4(); const col = new THREE.Color();
  list.forEach((v, i) => { m.makeTranslation(v.x * scale, v.y * scale, v.z * scale); mesh.setMatrixAt(i, m); mesh.setColorAt(i, col.set(v.c)); });
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

// 小さな人（研究者）: 幅 1 単位の積み木
function person(x, z, colors, t, facing = 0) {
  const v = [];
  const coat = t.person[colors % t.person.length];
  for (let y = 0; y < 2; y++) { v.push({ x: -0.3, y: y * 0.5 + 0.25, z: 0, c: 0x2f3a5c }); v.push({ x: 0.3, y: y * 0.5 + 0.25, z: 0, c: 0x2f3a5c }); }  // 脚
  for (let y = 2; y < 5; y++) for (let dx = -0.5; dx <= 0.5; dx += 0.5) v.push({ x: dx, y: y * 0.5 + 0.25, z: 0, c: coat });  // 胴
  v.push({ x: -1, y: 1.75, z: 0, c: coat }); v.push({ x: 1, y: 1.75, z: 0, c: coat });                                       // 腕
  for (let dx = -0.5; dx <= 0.5; dx += 0.5) for (let dy = 0; dy < 2; dy++) v.push({ x: dx, y: 2.75 + dy * 0.5, z: 0, c: dy ? t.hair : t.skin });  // 頭
  const g = new THREE.Group();
  g.add(makeVoxels(v, 0.5)); g.position.set(x, 0, z); g.rotation.y = facing;
  return g;
}

export function createDiorama(canvas, { themeName = 'yellow' } = {}) {
  let t = THEMES[themeName] || THEMES.yellow;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 500);
  const rig = new THREE.Group(); rig.add(camera); scene.add(rig);
  camera.position.set(0, 58, 120); camera.lookAt(0, 20, 0);

  // 光
  const hemi = new THREE.HemisphereLight(t.hemiSky, t.hemiGround, t.hemiI); scene.add(hemi);
  const sun = new THREE.DirectionalLight(t.sun, t.sunI); sun.position.set(40, 70, 30); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -40; sun.shadow.camera.far = 200; sun.shadow.bias = -0.0005;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-40, 30, -40); scene.add(rim);

  // 台座（結晶粒の床）: 一辺 36 のタイル。粒ごとに高さと色を変えて「結晶粒分布」を表す
  const world = new THREE.Group(); scene.add(world);
  const baseVox = [];
  const N = 18;
  for (let gx = -N; gx < N; gx++) for (let gz = -N; gz < N; gz++) {
    const d = Math.hypot(gx + 0.5, gz + 0.5);
    const grain = Math.floor((Math.sin(gx * 0.9) + Math.cos(gz * 1.1) + Math.sin((gx + gz) * 0.5)) * 1.5 + 4) % t.grain.length;
    const h = d < 6 ? 2 : d < 11 ? 1 : 0;                      // 中心ほど高い（粒径勾配）
    for (let y = -2; y <= h; y++) baseVox.push({ x: gx + 0.5, y: y + 0.5, z: gz + 0.5, top: y === h, gi: grain });
  }
  const colorBase = () => baseVox.map((v) => ({ ...v, c: v.top ? t.grain[v.gi] : t.base }));
  let baseMesh = makeVoxels(colorBase(), 1); world.add(baseMesh);

  // 台座の縁
  const edgeGeo = new THREE.BoxGeometry(N * 2 + 2, 1, N * 2 + 2);
  const edge = new THREE.Mesh(edgeGeo, new THREE.MeshLambertMaterial({ color: t.base })); edge.position.y = -3; edge.receiveShadow = true; world.add(edge);

  // ナノワイヤの塔: 六角柱（単結晶の面）。根元から伸びる
  const WIRE_H = 48, WIRE_R = 3.2;
  const wireGeo = new THREE.CylinderGeometry(WIRE_R * 0.92, WIRE_R, WIRE_H, 6, 1, false);
  wireGeo.translate(0, WIRE_H / 2, 0);
  const wireMat = new THREE.MeshStandardMaterial({ color: t.wire, metalness: 0.25, roughness: 0.45, flatShading: true, emissive: t.emissive });
  const wire = new THREE.Mesh(wireGeo, wireMat); wire.castShadow = true; wire.receiveShadow = true; wire.position.y = 2.5; world.add(wire);
  const capGeo = new THREE.CylinderGeometry(0, WIRE_R * 0.92, 4, 6); capGeo.translate(0, WIRE_H + 2, 0);
  const cap = new THREE.Mesh(capGeo, wireMat); cap.castShadow = true; wire.add(cap);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo, 20), new THREE.LineBasicMaterial({ color: t.wireEdge, transparent: true, opacity: 0.35 }));
  wire.add(edges);
  // 根元の盛り上がり
  const rootGeo = new THREE.CylinderGeometry(WIRE_R + 2.5, WIRE_R + 4, 2, 6); rootGeo.translate(0, 1, 0);
  const root = new THREE.Mesh(rootGeo, new THREE.MeshLambertMaterial({ color: t.grain[1] })); root.position.y = 2.5; root.castShadow = true; world.add(root);

  // 原子: 床を這って根元に集まる（原子拡散）
  const ATOMS = 160;
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.42, 8, 6), new THREE.MeshLambertMaterial({ color: t.atom }), ATOMS);
  atomMesh.castShadow = true; world.add(atomMesh);
  const atoms = Array.from({ length: ATOMS }, () => ({ a: Math.random() * Math.PI * 2, r: 6 + Math.random() * 12, s: 0.6 + Math.random() * 0.8, w: Math.random() * Math.PI * 2 }));

  // 電子: ワイヤの周りを螺旋で上る
  const ELEC = 70;
  const elecMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.28, 6, 5), new THREE.MeshBasicMaterial({ color: t.electron }), ELEC);
  world.add(elecMesh);
  const elecs = Array.from({ length: ELEC }, (_, i) => ({ p: i / ELEC, a: Math.random() * Math.PI * 2 }));

  // 人: 塔を見上げる研究者たち
  [[-9, 8, 0, 0.4], [10, 6, 1, -0.6], [3, 12, 2, 0], [-12, -2, 1, 1.2]].forEach(([x, z, c, f]) => world.add(person(x, z, c, t, f)));

  // 装置: 電子顕微鏡（塔）と制御卓
  const dev = [];
  for (let y = 0; y < 6; y++) for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) dev.push({ x: 13 + dx, y: y + 3.5, z: -9 + dz, c: y === 5 ? t.deviceLight : t.device });
  for (let dx = -2; dx <= 2; dx++) dev.push({ x: 13 + dx, y: 3.5, z: -5, c: t.device });
  for (let dx = -2; dx <= 2; dx++) dev.push({ x: 13 + dx, y: 4.5, z: -5, c: dx % 2 ? t.deviceLight : t.device });
  world.add(makeVoxels(dev, 1));

  // 「M2D」の文字（手前の縁）
  const FONT = { M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], 2: ['####.', '....#', '.###.', '#....', '#####'], D: ['####.', '#...#', '#...#', '#...#', '####.'] };
  const letters = [];
  ['M', '2', 'D'].forEach((ch, li) => FONT[ch].forEach((row, ry) => [...row].forEach((c, cx) => { if (c === '#') letters.push({ x: -8 + li * 6 + cx, y: 4.5 - ry, z: 16.5, c: t.letter }); })));
  world.add(makeVoxels(letters, 1));

  // 入力（マウスで少し傾く）
  let targetTilt = 0, targetTurn = 0, pointerX = 0, pointerY = 0;
  addEventListener('pointermove', (e) => { pointerX = (e.clientX / innerWidth - 0.5); pointerY = (e.clientY / innerHeight - 0.5); }, { passive: true });

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    // 広い画面では模型を右半分に寄せ、左に文章の余白を作る。狭い画面では中央・下寄り
    const wide = w > 900;
    world.position.set(wide ? 44 : 0, wide ? -4 : -16, 0);
    camera.position.set(0, 68, wide ? 138 : 200); camera.lookAt(wide ? 44 : 0, 18, 0);
  }
  addEventListener('resize', resize); resize();

  let scrollY = 0;
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const timer = new THREE.Timer();
  let growth = 0;                                   // 0 → 1: ワイヤの成長（根元から押し上げる）
  const m4 = new THREE.Matrix4();
  function frame() {
    timer.update();
    const dt = Math.min(0.05, timer.getDelta());
    const time = timer.getElapsed();
    growth = prefersReduced ? 1 : Math.min(1, time / 18);          // 経過時間で決める（描画回数に依存しない）
    const ease = 1 - Math.pow(1 - growth, 3);
    wire.scale.y = 0.08 + 0.92 * ease;
    wire.rotation.y = Math.sin(time * 0.2) * 0.02;
    // 原子: 外から根元へ
    for (let i = 0; i < ATOMS; i++) {
      const a = atoms[i];
      if (!prefersReduced) { a.r -= dt * a.s * 2.5; a.a += dt * 0.15 * Math.sin(a.w + time); }
      if (a.r < WIRE_R + 1.2) { a.r = 10 + Math.random() * 9; a.a = Math.random() * Math.PI * 2; }
      const x = Math.cos(a.a) * a.r, z = Math.sin(a.a) * a.r;
      const d = Math.hypot(x, z); const y = (d < 6 ? 3 : d < 11 ? 2 : 1) + 2.0 + Math.sin(time * 6 + a.w) * 0.08;
      m4.makeTranslation(x, y, z); atomMesh.setMatrixAt(i, m4);
    }
    atomMesh.instanceMatrix.needsUpdate = true;
    // 電子: 螺旋で上昇
    const H = WIRE_H * wire.scale.y;
    for (let i = 0; i < ELEC; i++) {
      const e = elecs[i];
      if (!prefersReduced) e.p = (e.p + dt * 0.12) % 1;
      const ang = e.a + e.p * Math.PI * 6 + time * 0.3;
      const rr = WIRE_R + 1.6;
      m4.makeTranslation(Math.cos(ang) * rr, 3 + e.p * H, Math.sin(ang) * rr); elecMesh.setMatrixAt(i, m4);
    }
    elecMesh.instanceMatrix.needsUpdate = true;
    // カメラ: ゆっくり回転 ＋ マウスで傾き ＋ スクロールで上から覗く
    targetTurn = (prefersReduced ? 0 : time * 0.06) + pointerX * 0.35 + scrollY * 0.0012;
    targetTilt = -pointerY * 0.12;
    rig.rotation.y += (targetTurn - rig.rotation.y) * 0.05;
    rig.rotation.x += (targetTilt - rig.rotation.x) * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function applyTheme(name) {
    t = THEMES[name] || THEMES.yellow;
    scene.background = new THREE.Color(t.bg);
    scene.fog = new THREE.Fog(t.fog, 120, 220);
    hemi.color.set(t.hemiSky); hemi.groundColor.set(t.hemiGround); hemi.intensity = t.hemiI;
    sun.color.set(t.sun); sun.intensity = t.sunI;
    wireMat.color.set(t.wire); wireMat.emissive.set(t.emissive); edges.material.color.set(t.wireEdge);
    atomMesh.material.color.set(t.atom); elecMesh.material.color.set(t.electron);
    edge.material.color.set(t.base); root.material.color.set(t.grain[1]);
    // 台座は色を持つ InstancedMesh なので作り直す
    world.remove(baseMesh); baseMesh = makeVoxels(colorBase(), 1); world.add(baseMesh);
  }
  applyTheme(themeName);
  frame();
  return { applyTheme, renderer };
}
