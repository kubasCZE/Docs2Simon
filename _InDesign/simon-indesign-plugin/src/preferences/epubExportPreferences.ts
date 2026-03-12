import { BulletListExportOption, EPubExportPreference, EPubFootnotePlacement, EpubVersion, ImageConversion, ImageResolution, JPEGOptionsFormat, JPEGOptionsQuality, NumberedListExportOption } from "indesign";

export const epubExportPreferences: Partial<EPubExportPreference> = {
    version: EpubVersion.EPUB3,
    includeClassesInHTML: true,
    // create toc.xhtml and toc.ncx from headers
    tocStyleName: "DefaultTOCStyleName",
    // enable creating page navigation because we handle it by ourselves
    epubCreatePageNavigation: true,
    // split document to separate files by heading
    breakDocument: true,
    // the name of paragraph style to break InDesign document.
    paragraphStyleName: "",
    // do not remove soft returns
    stripSoftReturn: false,
    footnotePlacement: EPubFootnotePlacement.FOOTNOTE_AFTER_STORY,
    // keep bullets in unordered lists (not convert into paragraphs)
    bulletExportOption: BulletListExportOption.UNORDERED_LIST,
    //  keep number bullets in ordered lists (not convert into paragraphs)
    numberedListExportOption: NumberedListExportOption.ORDERED_LIST,
    // format image based on layout appearence (preserve changes made by user - size, position, opacity etc.)
    preserveLayoutAppearence: true,
    // convert all images to JPEG due to issues with transparency in PNG and toggling dark mode
    imageConversion: ImageConversion.JPEG,
    imageExportResolution: ImageResolution.PPI_300,
    jpegOptionsFormat: JPEGOptionsFormat.PROGRESSIVE_ENCODING,
    jpegOptionsQuality: JPEGOptionsQuality.MAXIMUM,
    generateCascadeStyleSheet: true,
    // margins of the epub
    topMargin: 0,
    rightMargin: 0,
    bottomMargin: 0,
    leftMargin: 0,
    // local style override
    preserveLocalOverride: true,
    embedFont: true,
}