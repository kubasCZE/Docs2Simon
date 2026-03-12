# Docs2Simon — Google Docs Add-on

Exportuje Google Doc do EPUB a odešle ho do systému Simon přímo ze sidebaru.

## Rychlý start

### 1. Prerekvizity

```bash
npm install -g @google/clasp
clasp login
```

### 2. Vytvoření projektu

```bash
cd "/Users/jakubsimunek/Documents/Developement/Docs2Simon"
clasp create --type docs --title "Docs2Simon"
clasp push
```

`clasp create` přepíše `.clasp.json` se správným `scriptId`.

### 3. Testování

V Google Apps Script editoru (script.google.com):
- **Deploy → Test deployments → Editor Add-on**
- Otevři libovolný Google Doc
- **Extensions → Docs2Simon → Otevřít Docs2Simon**

### 4. Nastavení Simon endpointu

Otevři `Simon.gs` a nahraď `SIMON_ENDPOINT`:

```javascript
var SIMON_ENDPOINT = 'https://tvoje-adresa.simon-api.com/api/import';
```

## Struktura

| Soubor | Popis |
|--------|-------|
| `appsscript.json` | Manifest, OAuth scopes, addOns config |
| `Code.gs` | `onOpen()`, `showSidebar()`, `onHomepage()` |
| `Validation.gs` | Analýza struktury dokumentu (nadpisy, page breaky) |
| `Export.gs` | Export do EPUB přes Drive API |
| `Simon.gs` | Simon API komunikace + správa API klíče |
| `Sidebar.html` | Kompletní sidebar UI |

## Workflow

1. Sidebar se načte → automaticky zavolá `validateDocument()`
2. Zobrazí název dokumentu, seznam nadpisů, strategii rozdělení
3. Uživatel zadá API klíč → uloží se do `UserProperties` (per-user)
4. Tlačítko "Exportovat" se odblokuje pokud: dokument je validní + API klíč je nastaven
5. Export: Drive API → EPUB blob → POST na Simon endpoint
6. Zobrazí se výsledek z Simon API
