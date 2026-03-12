/**
 * Docs2Simon — Google Docs Add-on
 *
 * Architektura:
 *  - Card-based UI: vše server-side přes CardService (multi-account kompatibilní)
 *  - Sidebar: záloha pro single-account uživatele přes Extensions menu
 *  - Drive API: UrlFetchApp server-side (v exportFromCard)
 *  - Servantes API: UrlFetchApp server-side
 *  - Simon token: UserProperties (server-side, perzistentní)
 */

function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Otevřít Docs2Simon', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var doc = DocumentApp.getActiveDocument();
  var template = HtmlService.createTemplateFromFile('Sidebar');
  template.validationJson = JSON.stringify(validateDocument());
  template.docId          = doc.getId();
  template.docNameJson    = JSON.stringify(doc.getName());
  template.oauthToken     = ScriptApp.getOAuthToken();
  DocumentApp.getUi().showSidebar(template.evaluate().setTitle('Docs2Simon'));
}

// ── Card-based UI (multi-account kompatibilní) ────────────────────────────

function createHomepageCard(e) {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Docs2Simon')
      .setSubtitle('Export do Simona'));

  // Získej docId a docTitle co nejspolehlivěji
  var docId    = (e && e.docs && e.docs.id)    ? e.docs.id    : '';
  var docTitle = (e && e.docs && e.docs.title) ? e.docs.title : '';
  try {
    var doc   = DocumentApp.getActiveDocument();
    docId     = doc.getId()    || docId;
    docTitle  = doc.getName()  || docTitle;
  } catch (err) {}

  // Sekce: validace dokumentu
  var docSection = CardService.newCardSection().setHeader('Dokument');

  try {
    var validation = validateDocument();

    docSection.addWidget(CardService.newDecoratedText()
      .setTopLabel('Název')
      .setText(docTitle || '(bez názvu)'));

    var h1h2 = validation.headings.filter(function(h) {
      return h.level === 'HEADING1' || h.level === 'HEADING2';
    }).length;

    docSection.addWidget(CardService.newDecoratedText()
      .setText(validation.valid
        ? '✓ ' + validation.headings.length + ' nadpisů (' + h1h2 + '× H1/H2)'
        : '✗ Žádné nadpisy H1/H2 — nelze exportovat'));

    docSection.addWidget(CardService.newDecoratedText()
      .setTopLabel('Strategie rozdělení')
      .setText(validation.splitStrategy === 'pageBreaks' ? 'Page breaky' : 'Nadpisy'));

  } catch (err) {
    if (docTitle) {
      docSection.addWidget(CardService.newDecoratedText()
        .setTopLabel('Název')
        .setText(docTitle));
    }
    docSection.addWidget(CardService.newTextParagraph()
      .setText('Analýza dokumentu není v tomto kontextu dostupná.'));
  }

  card.addSection(docSection);

  // Sekce: přihlášení / export
  var props         = PropertiesService.getUserProperties();
  var simonToken    = props.getProperty('d2s_simonToken');
  var simonUsername = props.getProperty('d2s_simonUsername');

  if (simonToken && simonUsername) {
    var exportSection = CardService.newCardSection().setHeader('Simon');
    exportSection.addWidget(CardService.newDecoratedText()
      .setTopLabel('Přihlášen jako')
      .setText(simonUsername));
    exportSection.addWidget(CardService.newTextButton()
      .setText('Exportovat do Simona')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction()
        .setFunctionName('exportFromCard')
        .setParameters({ docId: docId, docTitle: docTitle })));
    exportSection.addWidget(CardService.newTextButton()
      .setText('Odhlásit')
      .setOnClickAction(CardService.newAction().setFunctionName('logoutFromCard')));
    card.addSection(exportSection);
  } else {
    var loginSection = CardService.newCardSection().setHeader('Přihlášení do Simona');
    loginSection.addWidget(CardService.newTextInput()
      .setFieldName('username')
      .setTitle('Přihlašovací jméno')
      .setHint('email@servantes.cz'));
    loginSection.addWidget(CardService.newTextInput()
      .setFieldName('password')
      .setTitle('Heslo'));
    loginSection.addWidget(CardService.newTextButton()
      .setText('Přihlásit se')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOnClickAction(CardService.newAction().setFunctionName('loginFromCard')));
    card.addSection(loginSection);
  }

  return card.build();
}

function loginFromCard(e) {
  var inputs   = (e.commonEventObject && e.commonEventObject.formInputs) || {};
  var username = inputs.username && inputs.username.stringInputs ? inputs.username.stringInputs.value[0] : '';
  var password = inputs.password && inputs.password.stringInputs ? inputs.password.stringInputs.value[0] : '';

  if (!username || !password) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Zadejte přihlašovací jméno a heslo.'))
      .build();
  }

  var result = _proxyLogin(username, password);

  if (result.error) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Chyba: ' + result.error))
      .build();
  }

  if (result.Type === 'DATA') {
    var token        = result.Data;
    var detectedUser = _decodeJwtUsername(token) || username;
    PropertiesService.getUserProperties().setProperties({
      'd2s_simonToken':    token,
      'd2s_simonUsername': detectedUser
    });
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(createHomepageCard(e)))
      .setNotification(CardService.newNotification()
        .setText('Přihlášen jako ' + detectedUser))
      .build();
  }

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText(_loginErrorMsg(result)))
    .build();
}

function logoutFromCard(e) {
  var props = PropertiesService.getUserProperties();
  props.deleteProperty('d2s_simonToken');
  props.deleteProperty('d2s_simonUsername');
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(createHomepageCard(e)))
    .setNotification(CardService.newNotification().setText('Odhlášen ze Simona.'))
    .build();
}

function exportFromCard(e) {
  var props      = PropertiesService.getUserProperties();
  var simonToken = props.getProperty('d2s_simonToken');

  if (!simonToken) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Nejste přihlášeni do Simona.'))
      .build();
  }

  try {
    var params   = (e.commonEventObject && e.commonEventObject.parameters) || {};
    var docId    = params.docId    || (e.docs && e.docs.id)    || '';
    var docTitle = params.docTitle || (e.docs && e.docs.title) || 'document';
    var fileName = docTitle.replace(/\.[^.]+$/, '') + '.epub';

    if (!docId) throw new Error('Nepodařilo se zjistit ID dokumentu.');

    // 1. Export EPUB přes Drive API (server-side UrlFetchApp)
    var epubResp = UrlFetchApp.fetch(
      'https://www.googleapis.com/drive/v3/files/' + docId +
      '/export?mimeType=application%2Fepub%2Bzip&alt=media',
      {
        headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
        muteHttpExceptions: true
      }
    );

    if (epubResp.getResponseCode() !== 200) {
      throw new Error('EPUB export selhal (' + epubResp.getResponseCode() + '): ' +
        epubResp.getContentText().substring(0, 200));
    }

    // 2. Upload do Simona (server-side UrlFetchApp, multipart)
    var blob    = epubResp.getBlob().setName(fileName).setContentType('application/epub+zip');
    var payload = {};
    payload[fileName] = blob;

    var simonResp = UrlFetchApp.fetch('https://simon.servantes.cz/api/Upload/ExternalSource', {
      method:  'POST',
      payload: payload,
      headers: { 'X-Servantes-Token': simonToken },
      muteHttpExceptions: true
    });

    var code = simonResp.getResponseCode();

    if (code === 401) {
      props.deleteProperty('d2s_simonToken');
      props.deleteProperty('d2s_simonUsername');
      return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().updateCard(createHomepageCard(e)))
        .setNotification(CardService.newNotification()
          .setText('Relace Simona vypršela. Přihlaste se znovu.'))
        .build();
    }

    if (code !== 200 && code !== 201) {
      throw new Error('Simon API chyba (' + code + '): ' +
        simonResp.getContentText().substring(0, 200));
    }

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('✓ ' + fileName + ' odeslán do Simona.'))
      .build();

  } catch (err) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Chyba exportu: ' + err.message))
      .build();
  }
}

// ── Servantes API proxy (pro google.script.run ze Sidebaru) ───────────────

function proxyLogin(username, password) {
  return _proxyLogin(username, password);
}

function proxyUpload(epubBase64, fileName, simonToken) {
  return _proxyUpload(epubBase64, fileName, simonToken);
}

function _proxyLogin(username, password) {
  var resp = UrlFetchApp.fetch('https://app.servantes.cz/Login/TokenLogin', {
    method:      'POST',
    contentType: 'application/json',
    payload:     JSON.stringify({ Login: username, Password: password }),
    muteHttpExceptions: true
  });
  try { return JSON.parse(resp.getContentText()); }
  catch (e) { return { error: 'Nepodařilo se zpracovat odpověď serveru.' }; }
}

function _proxyUpload(epubBase64, fileName, simonToken) {
  var blob = Utilities.newBlob(
    Utilities.base64Decode(epubBase64),
    'application/octet-stream',
    fileName
  );
  var payload = {};
  payload[fileName] = blob;

  var resp = UrlFetchApp.fetch('https://simon.servantes.cz/api/Upload/ExternalSource', {
    method:  'POST',
    payload: payload,
    headers: { 'X-Servantes-Token': simonToken },
    muteHttpExceptions: true
  });

  var code = resp.getResponseCode();
  if (code === 401) return { error: 'session_expired', code: 401 };
  if (code !== 200 && code !== 201) {
    return { error: 'Simon API chyba (' + code + '): ' + resp.getContentText().substring(0, 300) };
  }
  try { return JSON.parse(resp.getContentText()); }
  catch (e) { return { message: 'Soubor byl úspěšně odeslán do aplikace Simon.' }; }
}

function _decodeJwtUsername(token) {
  try {
    var b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var decoded = JSON.parse(Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString());
    return decoded.username || null;
  } catch (e) {
    return null;
  }
}

function _loginErrorMsg(data) {
  if (data.Type === 'FAILED_VALIDATION') return 'Zadejte povinné údaje.';
  if (data.Type === 'ERROR') {
    switch (data.ErrorKey) {
      case 'login_invalid_credentials': return 'Špatné přihlašovací jméno nebo heslo.';
      case 'login_disabled':            return 'Tento účet nemá právo k přihlášení.';
      case 'login_locked_out':          return 'Účet byl dočasně uzamknut. Zkuste to později.';
    }
  }
  return 'Přihlášení selhalo.';
}
