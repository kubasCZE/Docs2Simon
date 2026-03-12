import React from "react";

import { PanelController } from "./controllers/PanelController";
import { MainPanel } from "./panels/MainPanel";

import { entrypoints } from "uxp";
import { DataStore } from "./services/dataStore";
import "./styles/all.scss";

const mainService = new DataStore();

const mainController = new PanelController(() => <MainPanel dataStore={mainService} />, {
    id: "mainPanel" // Updated to match the key in entrypoints.setup
});

entrypoints.setup({
    plugin: {
        create(this: any) {
            /* optional */
            return Promise.resolve();
        },
        destroy() {
            /* optional */
            console.log("destroyed");
            return Promise.resolve();
        }
    },
    panels: {
        // @ts-ignore
        mainPanel: mainController
    }
});
