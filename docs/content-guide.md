# 更新手順書（コンテンツ更新ガイド）

このサイトは「内容（データ）」と「見た目（コード）」を分けて作ってあります。
日常の更新で触るのは下の表のファイルだけで、コード（`.astro` / `.js` / `.css`）を編集する必要はありません。

## 1. 更新で触るファイル

| 更新したいこと | 触るファイル | 補足 |
|---|---|---|
| メンバーの追加・肩書き変更・卒業 | `src/content/members.yaml` | 1 人 = 1 ブロック。写真は `public/images/members/` に置く |
| 業績（論文・発表・受賞）の追加 | `src/content/publications.yaml` | 1 件 = 1 ブロック。年と通し番号で自動整列 |
| 研究テーマの文章 | `src/content/research/*.md` | 1 テーマ = 1 ファイル（Markdown） |
| 装置・設備の追加・写真 | `src/content/equipment.yaml` | 写真は `public/images/equipment/` に置く |
| お知らせ | `src/content/news/YYYY-MM-DD-題名.md` | いまはトップに表示していない（データは残してある） |
| 研究室名・住所・問い合わせフォームの URL | `src/data/site.json` | 全ページに反映 |
| 研究室概要・アクセスの本文 | `src/pages/about.astro`, `src/pages/access.astro` | 文章だけなら HTML を直接書き換える |
| メッセージ（トップの板の本文） | `src/pages/index.astro` の `<aside id="message">` の中 | 太字の見出しと段落 |

写真などの画像は `public/images/` 以下に置き、データファイルには **ファイル名だけ** を書きます（例: `photo: yamada.jpg`）。

## 2. 公開までの流れ（共通）

1. GitHub Desktop でリポジトリを開き、上の表のファイルを編集する（GitHub の Web 画面で鉛筆アイコンから編集しても同じ）。
2. 左下の Summary に変更内容を一行で書いて **Commit to main** → **Push origin**。
3. 数分で GitHub Actions がビルドし、公開サイトに反映される。進み具合はリポジトリの **Actions** タブで見られる。
4. Actions が赤（失敗）になったら、直前の編集で書式が崩れているか、参照した画像が無い。エラーの行に原因が書いてある（下の「自動点検」参照）。

ローカルで確認したいときは、リポジトリのフォルダで次を実行し、表示された URL をブラウザで開く。

```bash
npm install
npm run dev
```

## 3. よくある更新の手順

### 3.1 業績を 1 件足す

`src/content/publications.yaml` の先頭（`# ...` のコメント行の下）に、次のブロックを追加する。

```yaml
- id: p79                 # 他と重複しない英数字（通し番号に合わせると分かりやすい）
  number: 79              # 公式サイトの通し番号。年内はこの番号の降順で並ぶ
  type: journal           # journal / conference / award / other
  title: 論文タイトル
  authors: Taro Yamada, Yasuhiro Kimura
  venue: Applied Physics Letters
  year: 2026
  volume: "130"           # 数字だけの値は "" で囲む
  pages: "011101"
  doi: 10.1063/xxxxxx     # あればリンクが自動で付く（無ければ行ごと削除）
```

### 3.2 メンバーを 1 人足す

`src/content/members.yaml` に次を追加する。`group` と `order` で区分と表示順が決まる。

```yaml
- id: yamada              # 英数字で一意
  name: 山田 太郎
  nameEn: Taro YAMADA     # 任意
  role: B4                # 例: 准教授（主宰・PI）/ M1 / B4 / 技術職員
  group: student          # faculty（教員）/ student（学生）/ staff（技術職員）/ alumni（卒業生）
  order: 40               # 小さいほど上
  voxel: default-voxel.png   # 名刺の表の人形。専用の人形を作ったらそのファイル名
  photo: yamada.jpg       # 名刺の裏の写真（public/images/members/）。無ければ行ごと削除
  consent: true           # 本人に掲載の同意を得てから true にする。false の間は写真が出ない
  interests: []
```

卒業したら削除せず `group: alumni` に変えると、卒業生の欄に名前だけ残る。

### 3.3 写真を差し替える・足す

1. 写真を **縦 4 : 横 3**（例: 750 × 1000 px）に切り出す。顔が中央に来るようにする。装置の写真は正方形でよい。
2. `public/images/members/`（メンバー）または `public/images/equipment/`（装置）に入れる。同じファイル名で上書きすれば、データファイルの変更は不要。
3. 新しいファイル名にした場合は、該当ブロックの `photo:` や `image:` を書き換える。
4. メンバーの写真は本人の同意を確認してから `consent: true` にする。

### 3.4 装置を 1 台足す

`src/content/equipment.yaml` に追加する。並び順はファイル内の順番。

```yaml
- id: xrd                 # 英数字で一意。写真のファイル名もこれに合わせると管理しやすい
  name: X線回折装置
  description: 薄膜の結晶構造評価
  image: xrd.jpg          # public/images/equipment/ に置く
```

### 3.5 研究テーマの文章を直す

`src/content/research/` の該当ファイルを開き、`---` で囲まれた先頭部分（題名・要約・表示順）と、その下の本文（Markdown）を編集する。新しいテーマは既存ファイルを複製して `order` を変える。

## 4. 自動点検（壊れた状態を公開しない仕組み）

- **型の検査**: データの項目名・必須項目は `src/content.config.ts` で決めてある。項目名の綴り間違いや必須項目の抜けは、ビルド時にエラーになって公開されない。
- **リンク・画像の検査**: ビルド後に `scripts/check-site.mjs` が全ページのリンクと画像の参照先を調べ、1 つでも欠けていれば Actions が失敗する。手元では次で実行できる。

```bash
npm run build && npm run check
```

  書きかけの「（記入）」が残っているページは「注意」として一覧に出る（失敗にはしない）。

## 5. 書式の注意

- YAML はインデント（行頭の空白 2 個）で構造が決まる。既存ブロックをコピーして書き換えるのが安全。
- 値に「: 」（コロン＋空白）や `#` を含むときは、値全体を `"..."` で囲む。
- 数字だけの値（巻号・ページ）は `"130"` のように `""` で囲む（数値と文字の取り違えを防ぐ）。
- 項目を新しく増やしたいとき（例: メンバーに「出身地」を足す）は `src/content.config.ts` の型定義と表示側のコードの変更が必要になる。これはコード編集なので、担当者に相談する。

## 6. 見た目を変えたいとき（参考）

- 配色: `public/style.css` の先頭にある `:root[data-theme="yellow"] { ... }` などの変数。4 色分が並んでいる。
- 町の模型（建物の配置・人形・看板）: `src/scripts/diorama.js`。建物を動かしたら `node scripts/check-town-layout.mjs` で人形や走路との重なりを確認する。
- メニュー項目: `src/lib/town.ts` の一覧。
