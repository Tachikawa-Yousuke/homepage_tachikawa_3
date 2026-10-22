# MagicaVoxel で部品を作って差し替える

3D 模型の部品（まずはナノワイヤの塔）を MagicaVoxel で作り、サイトに読み込む手順。
MagicaVoxel は無料のボクセル編集ソフトで、この Mac には導入済み（アプリケーションフォルダ、または Spotlight で「MagicaVoxel」）。

## 1. 新しいモデルを作る

1. MagicaVoxel を起動し、画面上部の **サイズ欄**（例: `40 40 40`）を塔の大きさに変える。塔なら `16 16 120`（幅 16・奥行 16・高さ 120）程度。
   - MagicaVoxel では **Z が上**。サイトに読み込むときに自動で向きを直すので、気にしなくてよい。
   - 大きさの上限は一辺 256。サイト側で「高さ 48 単位」に自動で拡大縮小するので、何ボクセルで作っても構わない。
2. 左のパレットから色を選び、右の **Brush** で `Attach`（追加）・`Erase`（削除）・`Paint`（色替え）を切り替えて積み木を置く。
   - `V`（Voxel）モードで 1 個ずつ、`F`（Face）モードで面ごと、`B`（Box）モードで直方体をまとめて置ける。
   - 底面（Z=0）を塔の根元にする。中心付近に立てると読み込み時の位置合わせが楽。
3. こまめに **Save**（右上のフロッピー）で `.vox` として保存する（例: `nanowire.vox`）。`.vox` が編集用の元データ。

## 2. 書き出す（Export）

1. 右側のパネル下部にある **Export** を開き、**obj** を押す。
2. 保存先を `Documents/claude/hp-competition/homepage_tachikawa_3/public/models/`、ファイル名を **`nanowire`** にする。
3. `nanowire.obj`・`nanowire.mtl`・`nanowire.png` の 3 つが書き出される。3 つとも同じフォルダに置く（色は png に入っている）。

## 3. 確認する

- Claude に「ナノワイヤを読み込んで確認して」と頼めば、ビルドして表示を確認する。
- 自分で見る場合: GitHub Desktop でコミット・Push すると、2〜3 分後に公開サイトに反映される。
- `public/models/nanowire.obj` が無いときは、これまでのコード描画の塔が表示される（壊れることはない）。

## 4. 他の部品も差し替えたいとき

`src/scripts/diorama.js` の先頭にある `MODELS` に 1 行足す。

```js
export const MODELS = [
  { name: 'nanowire', attach: 'wire', height: 48 },            // 塔（成長アニメーション付き）
  { name: 'building', attach: 'world', scale: 1, x: -17, z: -16 }, // 街の中の固定物（例）
];
```

`name` がファイル名（`public/models/<name>.obj`）、`attach: 'world'` は街の中に置く部品で、`x`・`z` が位置、`scale` が倍率（1 ボクセル = 街の 1 マス）。

## 注意

- MagicaVoxel の色はパレット（png）で渡るため、サイトの配色（黄・紺・緑・黒）を切り替えても部品の色は変わらない。
- ボクセル数が多い（数万個以上）と表示が重くなる。塔なら数千個で十分。
- `.vox` は Git に入れなくてもよいが、作り直しに備えて `public/models/` と同じ場所に置いておくことを勧める。
