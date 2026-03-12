import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataStore } from "../services/dataStore";
import { observer } from "mobx-react";
import { storage } from "uxp";
import { app } from "indesign";

interface IExportSettingDialog {
    dataStore: DataStore
}

export const ExportSettingDialog = observer(({ dataStore }: IExportSettingDialog) => {
    // paragraph styles
    const [styles, setStyles] = useState<string[]>([]);
    // preselected style for splitting
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    const [coverSrc, setCoverSrc] = useState<string>("");

    const [imageIsLoading, setImageIsLoading] = useState<boolean>(false);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const submitButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        // console.log("submitButtonRef", submitButtonRef)
        if (submitButtonRef.current)
            submitButtonRef.current.disabled = false;
        if (imageIsLoading && submitButtonRef.current) {
            submitButtonRef.current.disabled = true;
        }
    }, [imageIsLoading])

    useEffect(() => {
        if (dialogRef.current)
            dataStore.simonService.setExportSettingsDialog(dialogRef.current);
    }, [dataStore.simonService, dialogRef])

    useEffect(() => {
        if (app.documents.length === 0)
            return;

        setStyles(app?.activeDocument?.paragraphStyles.everyItem().name as string[])
    },
        [dataStore.simonService.exportSettingsDialogKey])

    useEffect(() => {

        if (!styles || styles.length === 0)
            return;

        if (app.documents.length === 0)
            return;

        try {
            // try to find style for heading 1 to preselect it for document splitting
            const styles = app.activeDocument.paragraphStyles.everyItem().properties;

            // first check if there is a style marked to split the document
            // highest priority
            const splitStyle = styles.find((style: any) => style.splitDocument);
            if (splitStyle) {
                setSelectedStyle(splitStyle.name);
                dataStore.setStyleNameForPartSplitting(splitStyle.name);
                return;
            }

            // now try to find style by font-size (only on style contains allowed text in its name)
            const allowedNames = ["head", "nadpis"];
            const stylesWithFontSize = (styles as any[]).filter(style => allowedNames.some(alName => style.name.toLowerCase().includes(alName))).map((style: any) => {
                return {
                    name: style.name,
                    fontSize: style.pointSize
                }
            }).sort((a: any, b: any) => b.fontSize - a.fontSize);
            if (stylesWithFontSize.length > 0) {
                setSelectedStyle(stylesWithFontSize[0].name);
                dataStore.setStyleNameForPartSplitting(stylesWithFontSize[0].name);
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }, [dataStore, dataStore.simonService.exportSettingsDialogKey, styles]);

    const clean = useCallback(() => {
        setStyles([]);
        setCoverSrc("");
        setSelectedStyle(null);
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageIsLoading) {
            alert(dataStore.localizationService.getLocalizationString("CoverImageIsLoading"));
            return;
        }

        try {
            dialogRef?.current?.close();
            if (dataStore.simonService.submitExportSettings === "export") {
                await dataStore.fileservice.handleExportToEpub();
            }
            else if (dataStore.simonService.submitExportSettings === "send") {
                await dataStore.fileservice.handleSendToSimon();
            }
            dataStore.simonService.hideExportSettingsDialog();
            clean();
        } catch (e) {
            console.log(e);
        }
    }, [clean, dataStore.fileservice, dataStore.localizationService, dataStore.simonService, imageIsLoading])

    const loadImage = useCallback(async (file: storage.File) => {
        try {
            setImageIsLoading(true);
            const arrayBuffer = await file.read({ format: storage.formats.binary }) as ArrayBuffer;
            const base64String = dataStore.fileservice.arrayBufferToBase64(arrayBuffer);
            setCoverSrc(`data:image/png;base64,${base64String}`);
        } catch (e) {
            console.log(e);
        }
        finally {
            setImageIsLoading(false);
        }

    }, [dataStore.fileservice])

    useEffect(() => {
        if (dataStore.cover) {
            loadImage(dataStore.cover as any);
        }
    }, [dataStore.cover, loadImage]);

    const handleClose = useCallback(() => {
        clean();
        dataStore.simonService.hideExportSettingsDialog();
    }, [clean, dataStore.simonService])

    return (
        <dialog id="export-settings-dialog" ref={dialogRef} className="export-settings-dialog"
            onClose={handleClose}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <form style={{ width: "90%", maxWidth: "21rem", margin: "auto" }}
                onSubmit={e => handleSubmit(e)}
            >
                <sp-heading>
                    <span>{dataStore.localizationService.getLocalizationString("ExportSettingsDialogTitle")}</span>
                </sp-heading>
                <sp-divider size="medium" style={{ marginBottom: "0.9375rem" }} />
                {/* BOOK COVER */}
                <sp-label>
                    {dataStore.localizationService.getLocalizationString("CoverLabel")}
                </sp-label>
                <div className="cover-simon">
                    <div className="cover-image-simon">
                        <img src={coverSrc} width={64} height={64} id="cover_image" style={{ visibility: coverSrc?.length > 0 ? "visible" : "hidden" }} />
                    </div>
                    <div className="cover-image-inputs">
                        <sp-button
                            onClick={async () => await dataStore.fileservice.selectCoverFile()}
                            variant="secondary"
                            style={{ marginBottom: "0.625rem", width: "100%" }}
                        >
                            {dataStore.localizationService.getLocalizationString("ChooseCover")}
                        </sp-button>
                        <div className="cover-buttons-simon">
                            <sp-textfield
                                type="text"
                                readOnly={true}
                                value={dataStore.cover?.nativePath ?? ""}
                            />
                            <sp-button
                                onClick={() => {
                                    dataStore.fileservice.resetCoverFile();
                                    setCoverSrc("");
                                }}
                                className="reset-simon"
                                variant="warning"
                                style={{ marginLeft: "0.625rem", width: "1.875rem" }}
                            >
                                X
                            </sp-button>
                        </div>
                    </div>
                </div>
                {/* SPLIT ELEMENT */}
                <sp-divider size="medium" style={{ marginBottom: "0.9375rem" }} />
                <sp-label>
                    {dataStore.localizationService.getLocalizationString("SplitElementLabel")}
                </sp-label>
                <sp-picker
                    // onInput={(e) => dataStore.setStyleNameForPartSplitting(e.target.value)}
                    // value={selectedStyle ?? undefined}
                    style={{ width: "100%" }}
                    class="sp-picker"
                >
                    <sp-menu slot="options">
                        {
                            styles.map((style) => (
                                <sp-menu-item key={style}
                                    onClick={(e) => dataStore.setStyleNameForPartSplitting((e.target as HTMLInputElement).value)}
                                    selected={selectedStyle === style ? true : null}
                                >{style}</sp-menu-item>
                            ))
                        }
                    </sp-menu>
                </sp-picker>
                <div
                    style={{
                        margin: "1.25rem 0",
                    }}
                >
                    <sp-button variant="secondary" onClick={handleClose} style={{ marginRight: "0.625rem" }}>
                        {dataStore.localizationService.getLocalizationString("ExportSettingsDialogCloseButton")}
                    </sp-button>
                    <sp-button onClick={handleSubmit} variant="cta" ref={submitButtonRef}>
                        {dataStore.localizationService.getLocalizationString("ExportSettingsDialogSubmit")}
                    </sp-button>
                </div>
            </form>
        </dialog>
    )
});
