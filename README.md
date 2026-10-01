# ASD — Algorytmy i struktury danych (PL / EN / RU)

Statyczna strona z wykładami, konspektami i ćwiczeniami z ASD. Działa na GitHub Pages i po otwarciu `index.html` z dysku.

## Publikacja na GitHub Pages

1. Utwórz repozytorium i wrzuć do niego **zawartość tego folderu** (tak, żeby `index.html` był w katalogu głównym repozytorium).
2. *Settings → Pages → Build and deployment*: **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Po chwili strona będzie pod adresem `https://<login>.github.io/<repozytorium>/`.

Plik `.nojekyll` wyłącza Jekyll, więc wszystkie pliki są serwowane bez zmian. Routing używa `#/…`, więc nie są potrzebne żadne przekierowania.

## Edycja treści

- Treść: `content/<język>/*.md` (Markdown z rozszerzeniami — opis na początku `assets/js/render/markdown.js`).
- Wzory: `$...$` w tekście i `$$...$$` jako osobny wiersz (KaTeX, dołączony lokalnie w `assets/vendor/katex`, więc działa też offline).
- Ramki: `:::def`, `:::formula`, `:::example`, `:::answer`, `:::tip`, `:::warn`, `:::exam`, `:::info`, `:::own`, `:::analogy` — opcjonalnie z tytułem i etykietą źródła, np. `:::formula Złożoność Prima src="slajdy MST"`.
- Wspólny kod Java: `content/code/*.java` (wstawiany przez `@include plik.java`).
- Po każdej zmianie w `content/` uruchom (Node.js):

```bash
node tools/build.js
```

Skrypt generuje `assets/data/content.<lang>.js` — te pliki trzeba też wrzucić do repozytorium.

## Struktura

```
index.html              strona (jedna, SPA z routingiem #/)
assets/css/main.css     importuje base/ i blocks/ (jeden plik = jeden blok BEM)
assets/js/core/         namespace, storage, i18n, theme, loader, router
assets/js/render/       markdown, math (KaTeX), highlight (składnia), diagrams (drzewa, grafy, tablice)
assets/vendor/katex/    KaTeX 0.16 (MIT) — skrypt, style i fonty woff2
assets/js/components/   code-block (kopiowanie), drawer (konspekt), toc (+ zwijany spis na telefonie), nav, progress, to-top
assets/js/pages/        home, topic, page
assets/data/            wygenerowane paczki treści (nie edytować ręcznie)
content/pl|en|ru/       treść w Markdown
content/code/           kod Java wspólny dla wszystkich języków
tools/build.js          budowanie paczek treści
```
