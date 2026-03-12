/**
 * Validace dokumentu — kontrola nadpisů a page breaků.
 * Vrací JSON s informacemi o struktuře dokumentu.
 */

function validateDocument() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var numChildren = body.getNumChildren();

  var headings = [];
  var hasPageBreaks = false;

  var headingTypes = {
    'HEADING1': DocumentApp.ParagraphHeading.HEADING1,
    'HEADING2': DocumentApp.ParagraphHeading.HEADING2,
    'HEADING3': DocumentApp.ParagraphHeading.HEADING3,
    'HEADING4': DocumentApp.ParagraphHeading.HEADING4,
    'HEADING5': DocumentApp.ParagraphHeading.HEADING5,
    'HEADING6': DocumentApp.ParagraphHeading.HEADING6
  };

  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    var type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH) {
      var para = child.asParagraph();
      var heading = para.getHeading();

      // Zkontroluj, jestli je to nadpis
      if (heading !== DocumentApp.ParagraphHeading.NORMAL &&
          heading !== DocumentApp.ParagraphHeading.SUBTITLE &&
          heading !== DocumentApp.ParagraphHeading.TITLE) {

        var headingLevel = getHeadingLevel(heading);
        if (headingLevel) {
          headings.push({
            level: headingLevel,
            text: para.getText().trim()
          });
        }
      }

      // Zkontroluj page breaky uvnitř paragrafu
      var numParaChildren = para.getNumChildren();
      for (var j = 0; j < numParaChildren; j++) {
        var paraChild = para.getChild(j);
        if (paraChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
          hasPageBreaks = true;
        }
      }

      // Zkontroluj atribut page break before
      if (para.getAttributes()[DocumentApp.Attribute.PAGE_BREAK_BEFORE]) {
        hasPageBreaks = true;
      }
    }
  }

  var h1h2Count = headings.filter(function(h) {
    return h.level === 'HEADING1' || h.level === 'HEADING2';
  }).length;

  var valid = h1h2Count > 0;
  var errors = [];

  if (!valid) {
    errors.push('Dokument neobsahuje žádné nadpisy úrovně H1 nebo H2. Pro správný export přidejte alespoň jeden nadpis.');
  }

  var splitStrategy = hasPageBreaks ? 'pageBreaks' : 'headings';

  return {
    docTitle: doc.getName(),
    headings: headings,
    hasPageBreaks: hasPageBreaks,
    splitStrategy: splitStrategy,
    valid: valid,
    errors: errors
  };
}

function getHeadingLevel(heading) {
  switch (heading) {
    case DocumentApp.ParagraphHeading.HEADING1: return 'HEADING1';
    case DocumentApp.ParagraphHeading.HEADING2: return 'HEADING2';
    case DocumentApp.ParagraphHeading.HEADING3: return 'HEADING3';
    case DocumentApp.ParagraphHeading.HEADING4: return 'HEADING4';
    case DocumentApp.ParagraphHeading.HEADING5: return 'HEADING5';
    case DocumentApp.ParagraphHeading.HEADING6: return 'HEADING6';
    default: return null;
  }
}
