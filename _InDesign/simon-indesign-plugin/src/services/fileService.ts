import { storage } from "uxp"; // UXP API
import { app, ExportFormat, Entry } from "indesign"; // UXP API
import { epubExportPreferences } from "../preferences/epubExportPreferences";
import { DataStore } from "./dataStore";
import { UploadEndpoint } from "../settings/GlobalSettings";

export class FileService {

    constructor(private dataStore: DataStore) { }

    public selectCoverFile = async (): Promise<void> => {
        try {
            const file: Entry = await storage.localFileSystem.getFileForOpening({
                types: ["jpg", "png", "gif"],
                allowMultiple: false
            }) as Entry;

            if (file) {
                this.dataStore.setCover(file);
            }
        } catch (err) {
            console.error("Error during file loading:", err);
        }
    }

    public resetCoverFile = (): void => {
        this.dataStore.setCover(null);
    }

    public handleSendToSimon = async () => {
        this.dataStore.simonService.setSubmitExportSettings(null);

        if (app.documents.length === 0)
            alert(this.dataStore.localizationService.getLocalizationString("NoActiveDocument"));

        if (this.dataStore.simonService.isAuthorized) {

            let canProceed = true;

            if (this.dataStore.documentService.isExistNotAnchoredGraphic) {
                canProceed = confirm(this.dataStore.localizationService.getLocalizationString("ConfirmNotAnchoredImagesSendToServer"));
            }

            if (canProceed) {
                this.dataStore.setIsProcessing(true);

                // setTimeout is important due to rerender of the UI with the loader
                setTimeout(async () => {
                    try {
                        this._prepareEpubSettings();
                        await this.sendFileToServer();
                    }
                    catch (error) {
                        console.error("Export was not succesfull:", error);
                        this.dataStore.setIsProcessing(false);
                    }
                    finally {
                        this.dataStore.documentService.clearTemporaryCssClasses();
                        this.dataStore.setIsProcessing(false);
                    }
                }, 50);
            }
        }
        else {
            // set mark for send book to Simon after succesfull login
            this.dataStore.simonService.setSendToSimonMark(true);
            this.dataStore.simonService.showLoginDialog();
        }
    }

    public handleExportToEpub = async (): Promise<void> => {
        this.dataStore.simonService.setSubmitExportSettings(null);
        if (app.documents.length === 0)
            alert(this.dataStore.localizationService.getLocalizationString("NoActiveDocument"));

        let canProceed = true;

        if (this.dataStore.documentService.isExistNotAnchoredGraphic) {
            canProceed = confirm(this.dataStore.localizationService.getLocalizationString("ConfirmNotAnchoredImagesEPUB"));
        }

        if (canProceed) {
            try {
                app.doScript(async () => {
                    this.dataStore.setIsProcessing(true);
                    let writableFile = null;
                    try {
                        writableFile = await storage.localFileSystem.getFileForSaving(this._createFilename(), { types: ["epub"] });
                    } catch (error) {
                        console.error("Export failed:", error);
                        setTimeout(() => {
                            alert(this.dataStore.localizationService.getLocalizationString("CannotGetFileForSaving"));
                        }, 100);
                        this.dataStore.setIsProcessing(false);
                    }
                    if (writableFile) {
                        this._prepareEpubSettings();
                        app.activeDocument.exportFile(ExportFormat.EPUB, writableFile as any, false);
                        // clear temporary css classes from export tags mapping
                        this.dataStore.documentService.clearTemporaryCssClasses();
                    }
                    this.dataStore.setIsProcessing(false);
                }, undefined, undefined, 1699963733)
            } catch (error) {
                console.error("Export failed:", error);
                setTimeout(() => {
                    alert(this.dataStore.localizationService.getLocalizationString("ExportFailed"));
                }, 100);
                this.dataStore.setIsProcessing(false);
            }
        }
    };

    public arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    public sendFileToServer = async (): Promise<void> => {

        try {
            const token = await this.dataStore.simonService.getAuthToken();

            if (!token) {
                setTimeout(() => {
                    alert(this.dataStore.localizationService.getLocalizationString("LoginExpired"));
                }, 100);
                this.dataStore.simonService.logout();
                return;
            }

            console.log("Start creating temporary file...");

            const fileName = this._createFilename();

            console.log("fileName", fileName);

            const tempFolder = await storage.localFileSystem.getTemporaryFolder();
            const tempFile = await tempFolder.createFile(fileName, { overwrite: true });

            if (!tempFolder || !tempFile) {
                setTimeout(() => {
                    alert(this.dataStore.localizationService.getLocalizationString("CannotCreateTemporaryFileOrFolder"));
                }, 100);
                return;
            }

            console.log("Temporary file created:", tempFile.nativePath);

            console.log("Start exporting file to epub:");

            try {
                app.activeDocument.exportFile(ExportFormat.EPUB, tempFile as any, false);
                console.log("File was exported:", tempFile.nativePath);
            } catch (error) {
                console.error("Export failed:", error);
                setTimeout(() => {
                    alert(this.dataStore.localizationService.getLocalizationString("ExportFailed"));
                }, 100);
                this.dataStore.setIsProcessing(false);
                return;
            }

            console.log("File was exported:", tempFile);

            const fileData = await tempFile.read({ format: storage.formats.binary });
            console.log("Loaded from temporary file:", fileData);

            if (!fileData) {
                setTimeout(() => {
                    alert(this.dataStore.localizationService.getLocalizationString("CannotReadTemporaryFile"));
                }, 100);
                return;
            }

            const fileBlob = new Blob([fileData], { type: "application/octet-stream" });
            const formData = new FormData();
            formData.append(fileName, fileBlob);

            const request: RequestInit = {
                method: "POST",
                body: formData,
                headers: {
                    "X-Servantes-Token": token
                } as any
            };

            console.log("request", request);

            console.log("Start sending file to server...");
            try {
                const response = await fetch(UploadEndpoint, request);

                console.log("Server response:", response);

                if (response.status === 200) {
                    setTimeout(() => {
                        alert(this.dataStore.localizationService.getLocalizationString("SendSuccess"));
                    }, 100);
                    return;
                }

                else if (response.status === 401) {
                    this.dataStore.simonService.logout();
                    // important to show alert after logout
                    setTimeout(() => {
                        alert(this.dataStore.localizationService.getLocalizationString("SendFailedLoginExpired"));
                    }, 100);
                    return;
                }

                else {
                    setTimeout(() => {
                        alert(this.dataStore.localizationService.getLocalizationString("SendFailed"));
                    }, 100);
                    return;
                }
            } catch (error) {
                console.error("Export failed:", error);
            }
        }
        catch (error) {
            console.error("Export was not succesfull:", error);
        }
        finally {
            this.dataStore.setIsProcessing(false);
        }
    }

    private _prepareEpubSettings = (): void => {
        console.log("Preparing epub settings...");
        // set default epub preferences
        this._setEpubPreferences();
        // set cover image if selected
        this._setCoverImage();
        // set paragraph style for splitting into parts
        this._setStyleForSplitting();
        // process potentially problematic paragraph styles
        this.dataStore.documentService.markUnderlinedBackgroundParagraphsStyles();
        // anchor images to the text
        // TODO
        // this.dataStore.documentService.anchorImagesToText();
        console.log("Epub settings prepared.");
        console.log("app.activeDocument.epubExportPreferences", app.activeDocument.epubExportPreferences);
    }

    private _setEpubPreferences = (): void => {
        Object.assign(app.activeDocument.epubExportPreferences, epubExportPreferences);
    };

    private _setCoverImage = (): void => {
        app.activeDocument.epubExportPreferences.coverImageFile = this.dataStore.cover?.nativePath ?? "";
    }

    private _setStyleForSplitting = (): void => {
        app.activeDocument.epubExportPreferences.paragraphStyleName = this.dataStore.styleNameForPartSplitting ?? "";
    }

    private _createFilename(): string {
        return (app.activeDocument.name.split(".")[0] ?? this._generateFileName()) + ".epub"
    }

    private _generateFileName(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `simon_plugin_generated_${year}_${month}_${day}`;
    }

    // private _createFormData(input: Record<string, unknown>): FormData {
    //     return Object.keys(input || {}).reduce((formData, key) => {
    //         const property = input[key];
    //         const propertyContent: any[] = property instanceof Array ? property : [property];

    //         for (const formItem of propertyContent) {
    //             formData.append(key, formItem);
    //         }

    //         return formData;
    //     }, new FormData());
    // }

}