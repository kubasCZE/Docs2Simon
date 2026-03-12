import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { DataStore } from "../services/dataStore";
import { observer } from "mobx-react";
import { LoginResponse } from "../services/simonService";

interface ILoginDialog {
    dataStore: DataStore
}

export const LoginDialog = observer(({ dataStore }: ILoginDialog) => {

    const [login, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current)
            dataStore.simonService.setLoginDialogRef(dialogRef.current);
    }, [dataStore.simonService, dialogRef])

    const clean = useCallback(() => {
        setUsername("");
        setPassword("");
        setLoginResponse(null);
    }, [])

    const handleLogin = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();
        if (dialogRef.current) {
            const result = await dataStore.simonService.handleLogin(login, password, dialogRef.current);
            if (result === "success") {
                dataStore.simonService.hideLoginDialog();
                clean();
            }
            else {
                setLoginResponse(result);
            }
        }
    }, [clean, dataStore.simonService, login, password])

    const handleClose = useCallback(() => {
        dataStore.simonService.hideLoginDialog();
        clean();
    }, [clean, dataStore.simonService])

    const getLoginResponseLocalizedString = useCallback(() => {
        switch (loginResponse) {
            case "invalid_form":
                return dataStore.localizationService.getLocalizationString("LoginDialogFormInvalid");
            case "invalid_credentials":
                return dataStore.localizationService.getLocalizationString("LoginDialogInvalidCredentials");
            case "disabled":
                return dataStore.localizationService.getLocalizationString("LoginDialogDisabled");
            case "locked_out":
                return dataStore.localizationService.getLocalizationString("LoginDialogLockedOut");
            case "request_to_server_failed":
                return dataStore.localizationService.getLocalizationString("RequestToServerFailed");
            default:
                return dataStore.localizationService.getLocalizationString("UnknownError");
        }
    }, [dataStore.localizationService, loginResponse])

    return (
        <dialog id="login-dialog" ref={dialogRef} className="login-dialog"
            style={{
                height: "100%",
            }}
        >
            <form style={{ width: "90%", maxWidth: "21rem", margin: "auto" }}
                onSubmit={e => handleLogin(e)}
            >
                <sp-heading className="h1">
                    <span>{dataStore.localizationService.getLocalizationString("LoginDialogTitle")}</span>
                </sp-heading>
                <sp-divider size="medium" />
                <sp-textfield
                    type="text"
                    value={login}
                    onInput={e => setUsername((e.target as HTMLInputElement).value)}
                    style={{ marginRight: "2%", width: "49%" }}
                >
                    <sp-label isrequired="true" slot="label">
                        {dataStore.localizationService.getLocalizationString("LoginDialogUsername")}
                    </sp-label>
                </sp-textfield>
                <sp-textfield
                    type="password"
                    value={password}
                    onInput={e => setPassword((e.target as HTMLInputElement).value)}
                    style={{ width: "49%" }}
                >
                    <sp-label isrequired="true" slot="label">
                        {dataStore.localizationService.getLocalizationString("LoginDialogPassword")}
                    </sp-label>
                </sp-textfield>
                <div className="login-failed-alert" style={{ visibility: loginResponse !== null ? "visible" : "hidden" }}>
                    {getLoginResponseLocalizedString()}
                </div>
                <div
                    style={{
                        margin: "1.25rem 0",
                        textAlign: "right",
                    }}
                >
                    <sp-button variant="secondary" onClick={handleClose} style={{ marginRight: "0.625rem" }}>
                        {dataStore.localizationService.getLocalizationString("LoginDialogCloseButton")}
                    </sp-button>
                    <sp-button onClick={handleLogin} variant="cta">
                        {dataStore.localizationService.getLocalizationString("LoginDialogLoginButton")}
                    </sp-button>
                </div>
            </form>
        </dialog>
    )
});
