import { app, Paragraph, ParagraphStyle } from "indesign"; // UXP API

export class DocumentService {
    private readonly _specialSimonPreprocessClassPrefix = "simon_preprocess_class_";

    constructor() { }

    public markUnderlinedBackgroundParagraphsStyles = (): void => {
        /**
        There is a way how to make a colored background under text using a very wide underline for the text. But this trick is issue for the export to EPUB.
        This method finds all styles with this trick and marks them with a  special css class containing a defined value for the background color for later processing in the Simon application
        */
        try {
            const doc = app.activeDocument;
            // find styles with underline and weight >= font-size
            const underlinedStyles: ParagraphStyle[] = doc.paragraphStyles.everyItem().properties.filter((style: any) => style.underline && style.underlineWeight >= style.pointSize);

            const stories = doc.stories.everyItem().getElements();

            let paragraphs: Paragraph[] = [];

            underlinedStyles.forEach(underlineStyle => {
                for (let i = 0; i < stories.length; i++) {
                    let paras = stories[i].paragraphs.everyItem().getElements();

                    for (let j = 0; j < paras.length; j++) {
                        if (paras[j].appliedParagraphStyle.name === underlineStyle.name) {
                            paragraphs.push(paras[j].properties);
                        }
                    }
                }
            });

            paragraphs.forEach(paragraph => {
                const underlineColor = paragraph.appliedParagraphStyle.underlineColor;
                let colorValue = underlineColor?.colorValue ? underlineColor.colorValue.join("_") : null;

                if (!colorValue) {
                    // if underlineColor is "Text Color", we have to get the actual fill color value
                    if (underlineColor === "Text Color" && (paragraph.appliedParagraphStyle as any).fillColor?.colorValue.length > 0)
                        colorValue = (paragraph.appliedParagraphStyle as any).fillColor.colorValue.join("_");
                }

                const suffix = "simon-bg__" + colorValue;
                const actualExportClass = paragraph.appliedParagraphStyle.styleExportTagMaps.everyItem()["exportClass"];
                if (actualExportClass.length === 0 || actualExportClass?.[0].includes(this.getSpecialSimonPreprocessClass(suffix)) === false) {
                    paragraph.appliedParagraphStyle.styleExportTagMaps.everyItem()["exportClass"] += ` ${this.getSpecialSimonPreprocessClass(suffix)}`;
                }
            });
        } catch (error) {
            console.error("Error during processing problematic paragraphs:", error);
        }
    }

    public clearTemporaryCssClasses() {
        /**
        This is a very important method for clearing temporary css classes
        from the export tags mapping.
        We don't want to keep these classes in the document after the
        export to EPUB.
        */
        try {
            console.log("Start clearing temporary css classes...");
            // get all paragraphs with our special class
            const stories = app.activeDocument.stories.everyItem().getElements();
            const regex = new RegExp(`\\b${this._specialSimonPreprocessClassPrefix}\\S*\\b`, "g");

            for (let i = 0; i < stories.length; i++) {
                let paras = stories[i].paragraphs.everyItem().getElements();

                for (let j = 0; j < paras.length; j++) {
                    const exportTagMaps = paras[j].properties.appliedParagraphStyle.styleExportTagMaps.everyItem();
                    if (exportTagMaps["exportClass"].length > 0 && exportTagMaps["exportClass"][0].includes(this._specialSimonPreprocessClassPrefix)) {
                        exportTagMaps["exportClass"] = exportTagMaps["exportClass"][0].replaceAll(regex, "").trim();
                        // console.log("Clearing...:", exportTagMaps["exportClass"]);
                    }
                }
            }
            console.log("Temporary css classes cleared.");
        } catch (error) {
            console.error("Error during clearing temporary css classes:", error);
        }
    }


    public get isExistNotAnchoredGraphic(): boolean {
        return app.activeDocument.allGraphics.some(graphic => {
            const image = graphic as any;
            return image.parent.parent.constructorName === "Spread";
        });
    }

    // public anchorImagesToText() {
    //     // mark not anchored images for later processing in the Simon application

    //     // get all graphic elements
    //     let allGraphics = app.activeDocument.allGraphics;

    //     // console.log("allGraphics", allGraphics);

    //     allGraphics.forEach(graphic => {
    //         const image = graphic as any;

    //         console.log("image", image);
    //         let nearestTextFrame: any = null;
    //         const imageName = image.itemLink.name;

    //         // this means img is not anchored
    //         if (image.parent.parent.constructorName === "Spread") {

    //             const bounds = image.geometricBounds; // [y1, x1, y2, x2]
    //             const xPos = bounds[1]; // X position
    //             const yPos = bounds[0]; // Y position

    //             // iterate over all text frames and find the nearest one to the image
    //             let minDistance = Number.MAX_VALUE;
    //             const page = image.parentPage; // Získáme stránku obrázku

    //             (app.activeDocument.textFrames as any).everyItem().getElements().forEach(textFrame => {

    //                 // console.log("textFrame.parentPage", textFrame.parentPage)
    //                 // console.log("page", page)

    //                 if (textFrame.parentPage?.name !== page?.name)
    //                     return;

    //                 if (textFrame?.paragraphs?.length === 0)
    //                     return;

    //                 const textBounds = textFrame.geometricBounds; // [y1, x1, y2, x2]

    //                 // get distance between image and text frame
    //                 const distance = Math.sqrt(Math.pow(xPos - (textBounds[1] + textBounds[3]) / 2, 2) +
    //                     Math.pow(yPos - (textBounds[0] + textBounds[2]) / 2, 2));

    //                 // if this text frame is closer, update nearestTextFrame
    //                 if (distance < minDistance) {
    //                     minDistance = distance;
    //                     nearestTextFrame = textFrame;
    //                 }
    //             });

    //             // if we found a text frame, add mark to the image
    //             // console.log("nearestTextFrame:", nearestTextFrame);
    //             if (nearestTextFrame) {

    //                 const firstParagraph = nearestTextFrame.paragraphs.everyItem().getElements()?.[0];
    //                 console.log("firstParagraph:", firstParagraph);

    //                 // firstParagraph.contents += "1111 ";

    //             } else {
    //                 console.log("Nebyl nalezen žádný textový rámec.");
    //             }
    //         }
    //     });
    // }

    private getSpecialSimonPreprocessClass = (suffix: string): string => {
        return this._specialSimonPreprocessClassPrefix + suffix;
    }

}