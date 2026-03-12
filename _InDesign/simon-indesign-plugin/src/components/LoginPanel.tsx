import React from "react";
import { DataStore } from "../services/dataStore";
import { observer } from "mobx-react";
import { classNames } from "../globalFuncs";
import { Login } from "./Login";
import { Row, Col } from "reactstrap";

interface ILoginPanel {
    dataStore: DataStore;
}

export const LoginPanel = observer(({ dataStore }: ILoginPanel) => {

    return (
        <>
            <Row>
                <Col xs="auto" className="login-panel">
                    <sp-label>
                        {dataStore.localizationService.getLocalizationString(
                            dataStore.simonService.isAuthorized ? "isLogged" : "isNotedLogged")
                        }
                        {dataStore.simonService.isAuthorized && ` ${dataStore.simonService.username}`}
                        <span className={classNames(dataStore.simonService.isAuthorized, "is-logged", "not-logged") + " login-state"} />
                    </sp-label>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Login dataStore={dataStore} />
                </Col>
            </Row>
        </>
    )
});
