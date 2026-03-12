import React from "react";
import { Wrapper } from "./Wrapper";
import { Logo } from "./Logo";
import { DataStore } from "../services/dataStore";
import { Controls } from "./Controls";
import { LoginPanel } from "./LoginPanel";
import { LoginDialog } from "./LoginDialog";
import { ExportSettingDialog } from "./ExportSettingDialog";

// https://www.indesignjs.de/extendscriptAPI/indesign-latest/

interface IMain {
    dataStore: DataStore;
}

export const Main = ({ dataStore }: IMain) => {

    return (
        <>
            <div>
                <Wrapper>
                    <Logo />
                    <LoginPanel dataStore={dataStore} />
                    <Controls dataStore={dataStore} />
                </Wrapper>
            </div>
            <LoginDialog dataStore={dataStore} />
            <ExportSettingDialog dataStore={dataStore} />
        </>
    );
};
