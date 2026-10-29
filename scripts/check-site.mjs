// ビルド結果（dist/）の点検: サイト内リンク・画像・CSS/JS の参照先が存在するか。
//   使い方: npm run build && npm run check      （BASE_PATH を付けてビルドしたときは同じ BASE_PATH を環境変数で渡す）
// 見つかった問題を一覧にして、1 つでもあれば終了コード 1（GitHub Actions ではデプロイが止まる）。
// 「（記入）」などの書きかけの目印は警告として数えるだけで、失敗にはしない。
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const DIST = resolve('dist');
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '');   // 例: "/homepage_tachikawa_3" または ""
if (!existsSync(DIST)) { console.error('dist/ がありません。先に npm run build を実行してください。'); process.exit(2); }

const htmlFiles = [];
(function walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); statSync(p).isDirectory() ? walk(p) : /\.html$/.test(f) && htmlFiles.push(p); } })(DIST);

const problems = [], warnings = [];
const seen = new Set();
const exists = (urlPath) => {                                       // dist 上の実体があるか（ファイル、または /dir/ → dir/index.html）
  const p = join(DIST, decodeURIComponent(urlPath));
  if (existsSync(p) && statSync(p).isFile()) return true;
  if (existsSync(join(p, 'index.html'))) return true;
  return existsSync(p + '.html');
};
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);
  const placeholders = (html.match(/（記入/g) || []).length;
  if (placeholders) warnings.push(`${rel}: 書きかけの「（記入…）」が ${placeholders} 箇所`);
  for (const m of html.matchAll(/\b(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(u)) continue;      // 外部・特殊スキームは対象外
    if (u.startsWith('/')) { if (BASE && u.startsWith(BASE + '/')) u = u.slice(BASE.length); else if (BASE && u === BASE) u = '/'; }
    else u = '/' + relative(DIST, resolve(dirname(file), u)).split('\\').join('/');   // 相対リンクは置かれているページ基準
    const key = u; if (seen.has(key)) continue; seen.add(key);
    if (!exists(u)) problems.push(`${rel}: 参照先が見つかりません → ${m[1]}`);
  }
}
// CSS 内の url(...) も確認
const cssFiles = [];
(function walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); statSync(p).isDirectory() ? walk(p) : /\.css$/.test(f) && cssFiles.push(p); } })(DIST);
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const u = m[1]; if (/^(https?:|data:|\/\/)/.test(u)) continue;
    const p = u.startsWith('/') ? (BASE && u.startsWith(BASE + '/') ? u.slice(BASE.length) : u) : '/' + relative(DIST, resolve(dirname(file), u));
    if (!exists(p.split('#')[0].split('?')[0])) problems.push(`${relative(DIST, file)}: CSS の参照先が見つかりません → ${u}`);
  }
}
console.log(`点検: HTML ${htmlFiles.length} ページ、参照 ${seen.size} 件`);
for (const w of warnings) console.log('  注意: ' + w);
if (problems.length) { console.error(`\n問題 ${problems.length} 件:`); for (const p of problems) console.error('  × ' + p); process.exit(1); }
console.log('問題なし。');
