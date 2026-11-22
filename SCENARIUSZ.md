# PISMO — scenariusz reklamy (≤ 2:00)

Format: 1920×1080, 30 kl./s, muzyka (dynamiczna, bez lektora) + krótkie napisy.
Zasada: **w pierwszych 5 sekundach widz widzi, co robi produkt** — skan zamienia się w dane na żywo.
Każda liczba w filmie pochodzi z naszych pomiarów (źródło w ostatniej kolumnie).

| Czas | Scena | Co widać | Napis na ekranie | Źródło liczb / materiał |
|---|---|---|---|---|
| **0:00–0:06** | **HAK: skan → dane** | Ciemne tło. Wjeżdża krzywy skan pełnomocnictwa. Przez stronę przesuwa się świetlny „skaner”. Nazwiska, NIP, KRS, PESEL podświetlają się na turkusowo i **wylatują w prawo, układając się w JSON** pisany na żywo. | „Skan PDF → dane JSON. Automatycznie.” | prawdziwy skan `dane/skany/pelnomocnictwa/…` + nasz JSON z `output/` |
| 0:06–0:14 | Problem | Trzy dokumenty sprawy (odwołanie, pełnomocnictwo, przelew) rozkładają się jak karty; obok kursor mozolnie przepisuje dane, licznik czasu biegnie. | „Tysiące spraw KIO rocznie.” → „Każda: odwołanie + pełnomocnictwo + przelew.” → „Dane przepisywane ręcznie.” | wyzwanie.pdf (opis problemu) |
| 0:14–0:20 | Odsłona | Litery P-I-S-M-O składają się z fragmentów dokumentów; rozwinięcie skrótu. | **PISMO** — Parser Inteligentnie Strukturyzujący Materiały Odwoławcze | `docs/grafika_pismo.png` |
| 0:20–0:45 | Jak działa (4 kroki) | Animowany przepływ na jednym prawdziwym dokumencie: | ① **Czyta** — PDF z tekstem lub skan (OCR na CPU) ② **Rozpoznaje** — odwołanie / pełnomocnictwo / przelew, inny dokument → `{}` ③ **Wyciąga** — reguły + AI (otwarty model, serwery w UE) ④ **Sprawdza** — każda wartość AI musi być w dokumencie, sumy kontrolne NIP/REGON/PESEL/IBAN, `null` zamiast zgadywania | architektura z `docs/architektura.md` |
| 0:45–1:05 | Demo: 1 klik | Dwuklik `start.bat` → w terminalu przewija się `[1/30] … odwolanie, pola 22/22` → drzewo `output/` = lustro `input/`. Przejście do GUI: **dokument obok danych**; klik w pole → na stronie podświetla się fragment, z którego pochodzi. | „Jeden klik. Folder PDF-ów → folder JSON-ów.” → „Każda wartość: strona, fragment, reguła czy AI.” | nagranie ekranu terminala i GUI |
| 1:05–1:20 | Elastyczność | Edytor: pojawia się plik `config/document_types/nowy_typ.yaml` (kilka linii: słowa kluczowe, pola). Zapis → w GUI nowy typ na liście i jego JSON — bez restartu, bez kodu. | „Nowy typ dokumentu? Jeden plik YAML.” → „Zero programowania. AI uczy się z tego samego pliku.” | `docs/nowy-typ-dokumentu.md` |
| 1:20–1:40 | Liczby | Liczniki „nabijające się” do wartości, po jednej na ~3 s: | **F1 = 1,000** na zbiorze treningowym · **F1 = 0,987** na nowych skanach, których reguły nie widziały · **228/228** dokumentów poprawnie rozpoznanych · **ok. 10 gr za 100 stron** (ok. 1 zł za 1000 stron) · **OCR 4× szybszy**, bez GPU | `reports/`, pomiary kosztu (≈ 1,2 tys. tokenów na stronę, $0,20 / 1 mln tokenów; trening 427 stron, skany 72 strony) |
| 1:40–1:52 | Ściana atutów | Szybko „odhaczana” lista (ikony + krótkie hasła), patrz niżej. | — | — |
| 1:52–2:00 | Finał | Logo PISMO, hasło, link do repozytorium, nazwa zespołu. | „PISMO. Od PDF-a do danych.” + `github.com/…` | — |

## Ściana atutów (1:40–1:52) — po 1 s na hasło

1. 100% open source — Apache 2.0
2. Otwarty model AI (Ministral 3 14B), serwery w UE
3. Działa na zwykłym laptopie — bez GPU, w Dockerze
4. Działa nawet bez AI — same reguły, zero kosztów
5. AI nie zmyśla — każda wartość sprawdzana w dokumencie
6. Pełna przejrzystość — źródło każdej wartości
7. CLI + GUI + API
8. Nowe typy dokumentów bez kodu (YAML)
9. 261 testów automatycznych + raporty jakości
10. Ten sam dokument nigdy nie jest opłacany dwa razy (pamięć odpowiedzi)

## Wszystkie atuty projektu (pełna lista, z odniesieniem do kryteriów oceny)

| Atut | Liczba / fakt | Kryterium UZP |
|---|---|---|
| Skuteczność na znanych dokumentach | F1 1,000 (60 spraw × 3 dokumenty) | F1 – 50% |
| Skuteczność na **nowych** układach (skany, OCR) | F1 0,987 (reguły + AI) | F1 — zbiór testowy jest inny niż treningowy |
| Klasyfikacja po treści, nie po nazwie pliku | 228/228, w tym 17 dokumentów negatywnych → `{}` | wymóg klasyfikacji |
| Nowy typ dokumentu = jeden plik YAML | reguły, pola, rozpoznawanie i prompt AI z jednego pliku | elastyczność – najważniejsze w finale |
| Rozsądny model | 14B → 18/20 pkt za „moc modelu”; otwarte wagi, Apache 2.0, możliwa instalacja lokalna | moc modelu |
| Bardzo niski koszt | ok. 10 gr za 100 stron (ok. 1 zł za 1000 stron); cały hackathon (setki przebiegów) ≈ 2 zł | „równowaga skuteczność / koszty” |
| Dane w UE | Mistral AI (Francja), endpoint UE, polityka prywatności z zakresem i miejscem przetwarzania | wymóg hostingu |
| OCR lokalny, nie przez API | nie wlicza się do średniej modeli LLM; 4× szybszy niż na starcie | wyjątek „OCR po API” |
| Przejrzystość ekstrakcji | strona, fragment, metoda (reguła / AI / arbitraż) dla każdej wartości; folder `meta/` | „premiowane: transparentność” |
| GUI w preferowanym układzie | dokument źródłowy obok wyodrębnionych danych | „GUI dodatkowo punktowane” |
| Odporność | brak klucza / awaria API → wynik z reguł, praca się nie przerywa | stabilność na maszynie testowej |
| Bez halucynacji | wartość AI musi występować w dokumencie; sumy kontrolne; `null` zamiast zgadywania | FAQ pkt 6 |
| Gotowe do wdrożenia | Docker, 1 klik (`start.bat`), CLI + API + GUI, 261 testów, dokumentacja | architektura i jakość – 20% |
| Uniwersalne narzędzie | silnik nie zna „odwołań” — wszystko opisuje konfiguracja; nadaje się do dowolnych PDF-ów | „uniwersalne narzędzie do danych z PDF” |

## Materiały do przygotowania

- [ ] Nagranie ekranu: dwuklik `start.bat` + terminal (ok. 10 s)
- [ ] Nagranie ekranu: GUI — wgranie PDF, analiza, klik w pole z podświetleniem źródła (ok. 15 s)
- [ ] Zrzut / nagranie: dodanie pliku YAML z nowym typem
- [ ] Obraz skanu pełnomocnictwa (strona 1) + jego JSON — do sceny „hak” (mogę przygotować z danych)
- [ ] Muzyka bez praw autorskich (np. YouTube Audio Library / Pixabay Music)
- [ ] Nazwa zespołu i link do repozytorium na planszę końcową
