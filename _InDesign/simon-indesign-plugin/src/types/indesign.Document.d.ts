import { Graphic } from "indesign"; // UXP API

declare module "indesign" {

    interface Document {
        readonly name: string;
        readonly filePath: string;
        readonly fullName: string;
        readonly saved: boolean;
        readonly modified: boolean;
        readonly readonly: boolean;
        readonly activeLayer: Layer;
        readonly pages: Page[];
        readonly spreads: Spread[];
        readonly masterSpreads: MasterSpread[];
        readonly stories: any;
        readonly textFrames: TextFrame[];
        readonly layers: Layer[];
        readonly fonts: Font[];
        readonly links: Link[];
        readonly colors: Color[];
        readonly swatches: Swatch[];
        readonly paragraphStyles: any;
        readonly characterStyles: CharacterStyle[];
        readonly guides: Guide[];
        readonly grids: Grid[];
        readonly preferences: DocumentPreference;
        readonly viewPreferences: ViewPreference;
        readonly textPreferences: TextPreference;
        readonly transparencyPreferences: TransparencyPreference;
        readonly transformPreferences: TransformPreference;
        readonly scriptPreferences: ScriptPreference;
        readonly indexingPreferences: IndexingPreference;
        readonly objectExportOptions: ObjectExportOption[];
        readonly xmlPreferences: XmlPreference;
        readonly properties: any;

        readonly epubExportPreferences: EPubExportPreference;
        readonly epubFixedLayoutExportPreferences:
        EPubFixedLayoutExportPreference;
        readonly allGraphics: Graphic[];

        activate(): void;
        close(saving?: SaveOptions, file?: File, versionComments?: string, forceSave?: boolean): void;
        save(file?: File, versionComments?: string, forceSave?: boolean): void;
        saveACopy(file: File, forceSave?: boolean): void;
        exportFile(format: ExportFormat, to: File, showingOptions?: boolean, using?: any, versionComments?: string, forceSave?: boolean): void;
        asynchronousExportFile(format: ExportFormat, to: File, showingOptions?: boolean, using?: any, versionComments?: string, forceSave?: boolean): Promise<void>;
        exportTaggedText(to: File, showingOptions?: boolean, using?: any): void;
        packageForPrint(to: File, copyingFonts?: boolean, copyingLinkedGraphics?: boolean, copyingProfiles?: boolean, updatingGraphics?: boolean, includeHiddenLayers?: boolean, ignorePreflightErrors?: boolean): void;
        place(file: File, showingOptions?: boolean, withProperties?: any): any;
        undo(): void;
        redo(): void;
        insertLabel(key: string, value: string): void;
        extractLabel(key: string): string;
        addLayer(withProperties?: any): Layer;
        addPageReference(documentPage?: Page, position?: any): void;
        synchronize(settings?: any): void;
        createPreflightProfile(name: string): void;
        createObjectStyle(name: string, withProperties?: any): ObjectStyle;
        createTextStyle(name: string, withProperties?: any): TextStyle;
        createCharacterStyle(name: string, withProperties?: any): CharacterStyle;
        createParagraphStyle(name: string, withProperties?: any): ParagraphStyle;
        addGuide(position: number, orientation: string): Guide;
        addGrid(rows: number, columns: number, gutterWidth?: number, gutterHeight?: number): Grid;
        convertToMasterSpread(): MasterSpread;
        remove(): void;
        extractICML(destination?: File): void;
        relinkText(to: File): void;
        checkOut(fromServer?: boolean): void;
        checkIn(comments?: string, keepCheckedOut?: boolean): void;
        updateFromServer(): void;
        move(to: File, versionComments?: string, forceSave?: boolean): void;
        saveAs(file: File, format?: SaveFormat, versionComments?: string, forceSave?: boolean): void;
    }

    interface EPubExportPreference {
        bottomMargin: number;
        breakDocument: boolean;
        bulletExportOption: BulletListExportOption;
        coverImageFile: string;
        customImageSizeOption: ImageSizeOption;
        embedFont: boolean;
        epubAccessibilityCertifiedBy: string;
        epubAccessibilityConformsTo: string;
        epubAccessibilityCredentials: string;
        epubAccessibilityFeature: string;
        epubAccessibilityHazard: string;
        epubAccessibilityMode: string;
        epubAccessibilityModeSufficient: string;
        epubAccessibilityReportLink: string;
        epubAccessibilitySummary: string;
        epubCover: EpubCover;
        epubCreatePageNavigation: boolean;
        epubCreator: string;
        epubDate: string;
        epubDescription: string;
        epubPublisher: string;
        epubRights: string;
        epubSubject: string;
        epubTitle: string;
        eventListeners: ReadonlyArray<EventListener>;
        events: ReadonlyArray<Event>;
        exportOrder: ExportOrder;
        externalStyleSheets: string[];
        footnotePlacement: EPubFootnotePlacement;
        generateCascadeStyleSheet: boolean;
        gifOptionsInterlaced: boolean;
        gifOptionsPalette: GIFOptionsPalette;
        id: string;
        ignoreObjectConversionSettings: boolean;
        imageAlignment: ImageAlignmentType;
        imageConversion: ImageConversion;
        imageExportResolution: ImageResolution;
        imagePageBreak: ImagePageBreakType;
        imageSpaceAfter: number;
        imageSpaceBefore: number;
        includeClassesInHTML: boolean;
        isValid: boolean;
        javascripts: string[];
        jpegOptionsFormat: JPEGOptionsFormat;
        jpegOptionsQuality: JPEGOptionsQuality;
        leftMargin: number;
        level: number;
        numberedListExportOption: NumberedListExportOption;
        paragraphStyleName: string;
        parent: Book | Document;
        preserveLayoutAppearence: boolean;
        preserveLocalOverride: boolean;
        properties: Record<string, unknown>;
        rightMargin: number;
        stripSoftReturn: boolean;
        tocStyleName: string;
        topMargin: number;
        useExistingImageOnExport: boolean;
        useImagePageBreak: boolean;
        useSVGAs: UseSVGAsEnum;
        version: EpubVersion;
    }

    interface EPubFixedLayoutExportPreference {
        includeDocumentMetadata: boolean;
        cover: EpubCover;
        spreadControl: EpubFixedLayoutSpreadControl;
        epubNavigationStyles: EpubNavigationStyle;
        eventListeners: EventListeners;
        events: Events;
        gifOptionsPalette: GIFOptionsPalette;
        imageConversion: ImageConversion;
        imageResolution: ImageResolution;
        jpegFormat: JPEGOptionsFormat;
        jpegQuality: JPEGOptionsQuality;
        rasterizationResolution: number;
        object: Object;
        pageRangeFormat: PageRangeFormat;
        pageRange: string;
    }

    type EpubFixedLayoutSpreadControl = any;
    type EventListeners = any;
    type Events = any;
    type PageRangeFormat = any;

    enum BulletListExportOption {
        /** Convert to text. */
        AS_TEXT = 1700946804,
        /** Map to html unordered list. */
        UNORDERED_LIST = 1970168940
    }

    enum ImageSizeOption {
        /** Image size to be used is absolute. */
        SIZE_FIXED = 1182295162,
        /** Image size to be used is relative to the text flow. */
        SIZE_RELATIVE_TO_TEXT_FLOW = 1383486566
    }

    enum ExportOrder {
        /** Based on article defined in article panel. */
        ARTICLE_PANEL_ORDER = 1700946288,
        /** Based on document layout. */
        LAYOUT_ORDER = 1700949113,
        /** Based on XML structure. */
        XML_STRUCTURE_ORDER = 1700952179
    }

    enum EPubFootnotePlacement {
        /** Footnote after paragraph. */
        FOOTNOTE_AFTER_PARAGRAPH = 1701213296,
        /** Footnote after story. */
        FOOTNOTE_AFTER_STORY = 1701213267,
        /** Footnote inside popup. */
        FOOTNOTE_INSIDE_POPUP = 1701213235
    }

    enum GIFOptionsPalette {
        /** Uses the adaptive (no dither) palette. */
        ADAPTIVE_PALETTE = 1886151024,
        /** Uses the Macintosh palette. */
        MACINTOSH_PALETTE = 1886154096,
        /** Uses the Web palette. */
        WEB_PALETTE = 1886156656,
        /** Uses the Windows palette. */
        WINDOWS_PALETTE = 1886156644
    }

    enum ImageAlignmentType {
        /** Image will be aligned center */
        CENTER = 1097614194,
        /** Image will be aligned left */
        LEFT = 1097616486,
        /** Image will be aligned right */
        RIGHT = 1097618036
    }

    enum ImageConversion {
        /** Uses the best format based on the image. */
        AUTOMATIC = 1768059764,
        /** Uses GIF format for all images. */
        GIF = 1734960742,
        /** Uses JPEG format for all images. */
        JPEG = 1785751398,
        /** Uses PNG format for all images. */
        PNG = 1397059687
    }

    enum ImageResolution {
        /** 150 pixels per inch */
        PPI_150 = 1920151654,
        /** 300 pixels per inch */
        PPI_300 = 1920160872,
        /** 72 pixels per inch */
        PPI_72 = 1920160628,
        /** 96 pixels per inch */
        PPI_96 = 1920159347,
    }

    enum ImagePageBreakType {
        /** Page break after image. */
        PAGE_BREAK_AFTER = 1114792294,
        /** Page break before image. */
        PAGE_BREAK_BEFORE = 1114792550,
        /** Page break before and after image. */
        PAGE_BREAK_BEFORE_AND_AFTER = 1114792545,
    }

    enum JPEGOptionsFormat {
        /** Uses baseline encoding to download the image in one pass. */
        BASELINE_ENCODING = 1785751394,
        /** Uses progressive encoding to download the image in a series of passes, with the first pass at low resolution and each successive pass adding resolution to the image. */
        PROGRESSIVE_ENCODING = 1785751408
    }

    enum JPEGOptionsQuality {
        /** Low quality. */
        LOW = 1701727351,
        /** Medium quality. */
        MEDIUM = 1701727588,
        /** High quality. */
        HIGH = 1701726313,
        /** Maximum quality. */
        MAXIMUM = 1701727608,
    }

    enum NumberedListExportOption {
        /** Convert to text. */
        AS_TEXT = 1700946804,
        /** Map to html ordered list. */
        ORDERED_LIST = 1700949359
    }

    enum UseSVGAsEnum {
        /** SVG will be exported as embed code */
        EMBED_CODE = 1936548193,
        /** SVG will be exported as object tags */
        OBJECT_TAGS = 1936548192
    }

    enum EpubVersion {
        EPUB2 = 1702257970,
        EPUB3 = 1702257971
    }

    enum EpubCover {
        /** Use external image as cover image. */
        EXTERNAL_IMAGE = 1700952169,
        /** Rasterize first page as cover image. */
        FIRST_PAGE = 1700947536,
        /** No cover image. */
        NONE = 1852796517
    }

    enum EpubNavigationStyle {
        /** File name based navigation */
        FILENAME_NAVIGATION = 1701211766,
        /** TOC style based navigation */
        TOC_STYLE_NAVIGATION = 1702129270
    }

    enum ExportFormat {
        EPS_TYPE = 1952400720,
        EPUB = 1701868898,
        FIXED_LAYOUT_EPUB = 1701865080,
        HTML = 1213484364,
        HTMLFXL = 1213490808,
        INCOPY_MARKUP = 1768123756,
        INDESIGN_MARKUP = 1768189292,
        INDESIGN_SNIPPET = 1936617588,
        INTERACTIVE_PDF = 1952409936,
        JPG = 1246775072,
        PDF_TYPE = 1952403524,
        PNG_FORMAT = 1699761735,
        RTF = 1381254688,
        TAGGED_TEXT = 1416066168,
        TEXT_TYPE = 1952412773,
        XML = 1481460768
    }

    type Book = any;

    // Additional possible types and enums
    interface Layer { /* Layer properties and methods */ }
    interface Page { /* Page properties and methods */ }
    interface Spread { /* Spread properties and methods */ }
    interface MasterSpread { /* MasterSpread properties and methods */ }
    interface Story { /* Story properties and methods */ }
    interface TextFrame { /* TextFrame properties and methods */ }
    interface Font { /* Font properties and methods */ }
    interface Link { /* Link properties and methods */ }
    interface Color { /* Color properties and methods */ }
    interface Swatch { /* Swatch properties and methods */ }
    interface ParagraphStyle {
        alignment?: any;
        appliedFont?: any;
        appliedLanguage?: any;
        appliedNumberingList?: any;
        appliedParagraphStyle?: any;
        autoLeading?: any;
        balanceRaggedLines?: any;
        baselineShift?: any;
        bulletsCharacterStyle?: any;
        bulletsTextAfter?: any;
        capitalization?: any;
        composer?: any;
        desiredWordSpacing?: any;
        dropCapCharacters?: any;
        dropCapLines?: any;
        dropCapStyle?: any;
        firstLineIndent?: any;
        fontStyle?: any;
        hyphenWeight?: any;
        hyphenateAcrossColumns?: any;
        hyphenateCapitalizedWords?: any;
        hyphenateLastWord?: any;
        hyphenateWordsLongerThan?: any;
        hyphenation?: any;
        hyphenationZone?: any;
        keepAllLinesTogether?: any;
        keepFirstLines?: any;
        keepLastLines?: any;
        keepLinesTogether?: any;
        keepOption?: any;
        keepWithNext?: any;
        kinsokuSet?: any;
        leading?: any;
        leftIndent?: any;
        ligatures?: any;
        maximumLetterSpacing?: any;
        maximumWordSpacing?: any;
        minimumLetterSpacing?: any;
        minimumWordSpacing?: any;
        name?: string;
        nextStyle?: any;
        noBreak?: any;
        numberingCharacterStyle?: any;
        numberingContinue?: any;
        numberingLevel?: any;
        numberingRestartPolicies?: any;
        numberingStartAt?: any;
        numberingStyle?: any;
        parent?: any;
        pointSize?: any;
        position?: any;
        rightIndent?: any;
        ruleAbove?: any;
        ruleAboveColor?: any;
        ruleAboveGapColor?: any;
        ruleAboveGapOverprint?: any;
        ruleAboveLeftIndent?: any;
        ruleAboveLineWeight?: any;
        ruleAboveOffset?: any;
        ruleAboveOverprint?: any;
        ruleAboveRightIndent?: any;
        ruleBelow?: any;
        ruleBelowColor?: any;
        ruleBelowGapColor?: any;
        ruleBelowGapOverprint?: any;
        ruleBelowLeftIndent?: any;
        ruleBelowLineWeight?: any;
        ruleBelowOffset?: any;
        ruleBelowOverprint?: any;
        ruleBelowRightIndent?: any;
        singleWordJustification?: any;
        spaceAfter?: any;
        spaceBefore?: any;
        startParagraph?: any;
        storyDirection?: any;
        styleExportTagMaps?: any;
        tabList?: any;
        underline?: any;
        underlineColor?: any;
        underlineGapColor?: any;
        underlineGapOverprint?: any;
        underlineOffset?: any;
        underlineOverprint?: any;
        underlineWeight?: any;
        verticalScale?: any;
        warichu?: any;
        warichuAlignment?: any;
        warichuCharsAfterBreak?: any;
        warichuCharsBeforeBreak?: any;
        warichuEnabled?: any;
        warichuLineSpacing?: any;
        warichuSize?: any;
        wordSpacing?: any;
    }
    interface CharacterStyle { /* CharacterStyle properties and methods */ }
    interface Guide { /* Guide properties and methods */ }
    interface Grid { /* Grid properties and methods */ }
    interface DocumentPreference { /* DocumentPreference properties and methods */ }
    interface ViewPreference { /* ViewPreference properties and methods */ }
    interface TextPreference { /* TextPreference properties and methods */ }
    interface TransparencyPreference { /* TransparencyPreference properties and methods */ }
    interface TransformPreference { /* TransformPreference properties and methods */ }
    interface ScriptPreference { /* ScriptPreference properties and methods */ }
    interface IndexingPreference { /* IndexingPreference properties and methods */ }
    interface ObjectExportOption { /* ObjectExportOption properties and methods */ }
    interface XmlPreference { /* XmlPreference properties and methods */ }

    interface SaveFormat { }

    interface ObjectStyle {
        readonly name: string;
    }

    interface TextStyle {
        readonly name: string;
    }

    interface SaveOptions { }
    interface Paragraph { appliedParagraphStyle: ParagraphStyle }

    const document: Document;
}

