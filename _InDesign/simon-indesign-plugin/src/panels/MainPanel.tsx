import React from "react";

import { Main } from "../components/Main";
import { DataStore } from "../services/dataStore";

interface IMainPanel {
    dataStore: DataStore;
}

export const MainPanel = ({ dataStore }: IMainPanel) => {
    return (<Main dataStore={dataStore} />)
}
