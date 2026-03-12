
import { makeObservable, observable, runInAction } from "mobx";
import { DataStore } from "./dataStore";
import { LoginEndpoint } from "../settings/GlobalSettings";
import { storage } from "uxp"; // UXP API
import { jwtDecode } from "jwt-decode";
import { app } from "indesign";

export class SimonService {

    private _authorized = false;
    private _loginDialogRef: HTMLDialogElement | null = null;
    private _exportSettingsDialogRef: HTMLDialogElement | null = null;
    private _sendToSimon = false; // mark for sending book to Simon after login
    private _username: string | null = null;
    private _submitExportSettings: SubmitExportSettingsType = null; // mark for callback fn after export settings submit
    public exportSettingsDialogKey = 0;
    private _isExportSettingsDialogOpen = false;

    constructor(private dataStore: DataStore) {
        makeObservable<SimonService, "_username" | "_authorized" | "_isExportSettingsDialogOpen">(this, {
            _username: observable,
            _authorized: observable,
            _isExportSettingsDialogOpen: observable,
            exportSettingsDialogKey: observable
        });
        this._loginFromToken();
    }

    private _loginFromToken = async (): Promise<void> => {
        const token = await this.getAuthToken();
        if (token) {
            this._setIsAuthorized(true);
            this._setDataFromToken(token);
        }
    }

    private _setDataFromToken = async (token: string): Promise<void> => {
        const decodedToken = jwtDecode(token);
        this._setUsername((decodedToken as any).username);
    }

    public handleLogin = async (login: string, password: string, dialog: HTMLDialogElement): Promise<LoginResponse> => {
        try {
            const request: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Login: login,
                    Password: password
                })
            };

            const response = await fetch(LoginEndpoint, request);
            const responseData = await response.json();

            if (responseData.Type === "DATA") {
                const token = responseData.Data;
                this._setAuthToken(token);
                this._setIsAuthorized(true);
                this._setDataFromToken(token);
                dialog.close();

                if (this._sendToSimon) {
                    this.dataStore.fileservice.handleSendToSimon();
                }

                this.setSendToSimonMark(false);

                return "success";
            }
            else if (responseData.Type === "FAILED_VALIDATION") {
                return "invalid_form";
            }
            else if (responseData.Type === "ERROR") {

                if (responseData.ErrorKey === "login_invalid_credentials")

                    switch (responseData.ErrorKey) {
                        case "login_invalid_credentials":
                            return "invalid_credentials";
                        case "login_disabled":
                            return "disabled";
                        case "login_locked_out":
                            return "locked_out";
                        default:
                    }
            }
            this.setSendToSimonMark(false);
            return "unknown_error";

        } catch (error) {
            console.log("error", error)
            this.setSendToSimonMark(false);
            return "request_to_server_failed";
        }
    }

    public setLoginDialogRef = (dialogRef: HTMLDialogElement) => {
        this._loginDialogRef = dialogRef;
    }

    public showLoginDialog = (): void => {
        // @ts-ignore
        this._loginDialogRef?.showModal({
            resize: "both",
            size: {
                width: 600,
                height: 400,
            },
            minSize: {
                width: 600,
                height: 400,
            },
            maxSize: {
                width: 600,
                height: 400,
            },
        });
    }

    public hideLoginDialog = (): void => {
        this._loginDialogRef?.close();
    }

    public get exportSettingsDialogIsOpen() {
        return this._isExportSettingsDialogOpen;
    }

    public setExportSettingsDialog(dialogRef: HTMLDialogElement) {
        this._exportSettingsDialogRef = dialogRef;
    }

    public showExportSettingsDialog = (submitType: SubmitExportSettingsType): void => {
        if (submitType === "send" && !this.isAuthorized) {
            this.showLoginDialog();
            return;
        }

        if (app.documents.length === 0) {
            alert(this.dataStore.localizationService.getLocalizationString("NoActiveDocument"));
            return;
        }

        this.setSubmitExportSettings(submitType);
        this.dataStore.setCover(null);
        setTimeout(() => {
            runInAction(() => this.exportSettingsDialogKey++);
            // @ts-ignore
            this._exportSettingsDialogRef?.showModal({
                resize: "both",
                size: {
                    width: 600,
                    height: 400,
                },
                minSize: {
                    width: 600,
                    height: 400,
                },
                maxSize: {
                    width: 600,
                    height: 400,
                },
            });
            runInAction(() => this._isExportSettingsDialogOpen = true);
        }, 50);
    }

    public hideExportSettingsDialog = (): void => {
        this.setSubmitExportSettings(null);
        runInAction(() => this._isExportSettingsDialogOpen = false);
        this._exportSettingsDialogRef?.close();
    }

    public logout = (): void => {
        this._setIsAuthorized(false);
        this._clearAuthToken();
    }

    public get isAuthorized() {
        return this._authorized;
    }

    public get submitExportSettings() {
        return this._submitExportSettings;
    }

    public setSubmitExportSettings(submitType: SubmitExportSettingsType) {
        this._submitExportSettings = submitType;
    }

    public setSendToSimonMark = (state: boolean) => {
        this._sendToSimon = state;
    }

    private _setIsAuthorized = (state: boolean) => {
        runInAction(() => this._authorized = state);
    }

    private _setAuthToken = async (token: string): Promise<void> => {
        storage.secureStorage.setItem("authToken", token)
    }

    public getAuthToken = async (): Promise<string | null> => {
        const token = await storage.secureStorage.getItem("authToken");
        return String.fromCharCode(...Array.from(token));
    }

    private _clearAuthToken = async (): Promise<void> => {
        storage.secureStorage.removeItem("authToken");
    }

    private _setUsername = (username: string) => {
        runInAction(() => this._username = username);
    }

    public get username(): string | null {
        return this._username;
    }
}

export type SubmitExportSettingsType = "send" | "export" | null;

export type LoginResponse = "success" | "invalid_form" | "invalid_credentials" | "disabled" | "locked_out" | "request_to_server_failed" | "unknown_error";