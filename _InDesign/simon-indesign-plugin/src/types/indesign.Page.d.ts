declare module "indesign" {

    interface Page {

    }

    interface Graphic {
        // Methods
        addEventListener(eventType: string, handler: Function): void;
        applyObjectStyle(objectStyle: any, clearingOverrides?: boolean): void;
        asynchronousExportFile(format: string, to: File): void;
        autoTag(): void;
        changeObject(source: Object, destination: Object): void;
        clearObjectStyleOverrides(clearingOverrides: boolean): void;
        clearTransformations(): void;
        contentPlace(content: any): void;
        convertShape(shapeType: any): void;
        createEmailQRCode(email: string): void;
        createHyperlinkQRCode(url: string): void;
        createPlainTextQRCode(text: string): void;
        createTextMsgQRCode(phoneNumber: string, message: string): void;
        createVCardQRCode(vcard: any): void;
        detach(): void;
        duplicate(to?: any, by?: any): Graphic;
        exportFile(format: string, to: File): void;
        exportForWeb(format: string, to: File): void;
        extractLabel(key: string): string;
        findObject(options?: any): any;
        fit(option: any): void;
        flipItem(direction: any): void;
        getElements(): any;
        insertLabel(key: string, value: string): void;
        markup(tag: string): void;
        move(to: any, by?: any): void;
        override(destinationPage: Page): void;
        place(file: File, showingOptions?: boolean, withProperties?: any): void;
        placeXML(xmlElement: any): void;
        redefineScaling(): void;
        reframe(insetAmount: any): void;
        remove(): void;
        removeEventListener(eventType: string, handler: Function): void;
        removeOverride(): void;
        resize(scaleX: number, scaleY: number, anchor?: any): void;
        resolve(): any;
        select(selectionOptions?: any): void;
        store(): void;
        toSource(): string;
        toSpecifier(): string;
        transform(matrix: any): void;
        transformAgain(): void;
        transformAgainIndividually(): void;
        transformSequenceAgain(): void;
        transformSequenceAgainIndividually(): void;
        transformValuesOf(transformType: any): void;

        // Objects
        animationSetting: any;
        arrowHead: any;
        arrowHeadAlignment: any;
        article: any;
        boolean: any;
        contentTransparencySetting: any;
        cornerOptions: any;
        dimensionsConstraints: any;
        displaySettingOptions: any;
        endCap: any;
        endJoin: any;
        eventListeners: any;
        events: any;
        fillTransparencySetting: any;
        flip: any;
        graphics: any;
        guide: any;
        layer: any;
        link: any;
        linkedPageItemOption: any;
        movie: any;
        number: any;
        page: any;
        pageItem: any;
        pageItems: any;
        preferences: any;
        svgs: any;
        sound: any;
        strokeAlignment: any;
        strokeCornerAdjustment: any;
        strokeStyle: any;
        strokeTransparencySetting: any;
        swatch: any;
        textWrapPreference: any;
        timingSetting: any;
        transparencySetting: any;
        xmlItem: any;
    }

    const page: Page;
}

