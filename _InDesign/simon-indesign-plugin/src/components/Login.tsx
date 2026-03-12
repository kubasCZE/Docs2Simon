import React, { useCallback } from "react";
import { DataStore } from "../services/dataStore";
import { observer } from "mobx-react";

interface ILogin {
    dataStore: DataStore;
}

export const Login = observer(({ dataStore }: ILogin) => {

    const handleLogin = useCallback(() => {
        const userConfirm = confirm(dataStore.localizationService.getLocalizationString("ReallyLogout"));

        if (userConfirm) {
            dataStore.simonService.logout();
        }
    }, [dataStore.localizationService, dataStore.simonService])

    return <>
        <sp-button onClick={
            () => (
                dataStore.simonService.isAuthorized === false ?
                    dataStore.simonService.showLoginDialog() :
                    handleLogin()
            )
        }
            variant="secondary"
            size="s"
            disabled={dataStore.simonService.exportSettingsDialogIsOpen ? true : undefined}
        >
            {
                dataStore.simonService.isAuthorized ?
                    dataStore.localizationService.getLocalizationString("LogoutButton") :
                    dataStore.localizationService.getLocalizationString("LoginButton")
            }
        </sp-button>
    </>
});
