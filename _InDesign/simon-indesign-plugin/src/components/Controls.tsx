import React from "react";
import "../styles/global.scss";
import { DataStore } from "../services/dataStore";
import { observer } from "mobx-react";
import { Loader } from "./Loader";

interface IControls {
    dataStore: DataStore;
}

export const Controls = observer(({ dataStore }: IControls) => {

    if (dataStore.isProcessing)
        return <Loader dataStore={dataStore} />;

    return (
        <>
            {/* SEND TO SIMON */}
            <sp-button
                onClick={() => dataStore.simonService.showExportSettingsDialog("send")}
                variant="secondary"
                style={{ width: "100%", margin: "1.25rem 0 0.625rem 0" }}
                disabled={dataStore.simonService.exportSettingsDialogIsOpen ? true : undefined}
            >
                {dataStore.localizationService.getLocalizationString("SendToSimon")}
            </sp-button>
            {/* EXPORT TO EPUB */}
            {/* <sp-button
                onClick={() => dataStore.simonService.showExportSettingsDialog("export")}
                variant="secondary"
                style={{ width: "100%" }}
                disabled={dataStore.simonService.exportSettingsDialogIsOpen ? true : undefined}
            >
                {dataStore.localizationService.getLocalizationString("ExportToEpub")}
            </sp-button> */}
        </>
    );
});
