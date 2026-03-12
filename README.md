# Docs2Simon — Google Docs Add-on

Exportuje Google Doc do EPUB a odešle ho do systému Simon přímo ze sidebaru nebo card UI.

## Architektura

Dva UI přístupy pro různé kontexty:

| UI | Kdy se použije | Auth token |
|---|---|---|
| **Sidebar** | Otevřít přes Extensions → Docs2Simon | `localStorage` prohlížeče |
| **Card UI** | Automaticky ve workspace add-on panelu (multi-account) | `UserProperties` (server-side) |

### Tok exportu (Sidebar)

1. OAuth token je při načtení sidebaru embedován server-side do šablony
2. Sidebar volá Drive API přímo přes `fetch` (CORS je pro googleapis.com povolen)
3. EPUB blob se převede na base64 a odešle přes `google.script.run` proxy (`proxyUpload`)
4. Proxy použije `UrlFetchApp` pro POST na Simon API (obejde CORS omezení)

### Tok exportu (Card UI)

1. Drive API i Simon upload jdou celé server-side přes `UrlFetchApp`
2. Token je uložen v `UserProperties` — přežije relaci

## Struktura

| Soubor | Popis |
|--------|-------|
| `appsscript.json` | Manifest, OAuth scopes, addOns config |
| `Code.gs` | `onOpen()`, sidebar, card UI (`createHomepageCard`, `loginFromCard`, `exportFromCard`), server-side proxy (`proxyLogin`, `proxyUpload`) |
| `Validation.gs` | Analýza struktury dokumentu (nadpisy H1–H6, page breaky) |
| `Export.gs` | *(prázdný — export přesunut do klientského JS v Sidebar.html)* |
| `Simon.gs` | *(prázdný — auth přesunuta do klientského JS + Code.gs proxy)* |
| `Sidebar.html` | Kompletní sidebar UI (validace, login, export) |

## Přihlášení

Uživatel se přihlašuje jménem a heslem (Servantes účet). Token se získá z `https://app.servantes.cz/Login/TokenLogin` a uloží lokálně — není potřeba žádný ruční API klíč.

## Validace dokumentu

Dokument musí obsahovat alespoň jeden nadpis H1 nebo H2. Strategie rozdělení EPUB:
- **Page breaky** — pokud dokument obsahuje manuální page breaky
- **Nadpisy** — jinak

## Nasazení přes clasp

```bash
npm install -g @google/clasp
clasp login
cd "/cesta/k/Docs2Simon"
clasp create --type docs --title "Docs2Simon"
clasp push
```

`clasp create` vygeneruje `.clasp.json` se `scriptId` (soubor je v `.gitignore`).

### Testování

V Google Apps Script editoru (script.google.com):
- **Deploy → Test deployments → Editor Add-on**
- Otevři libovolný Google Doc
- **Extensions → Docs2Simon → Otevřít Docs2Simon**
