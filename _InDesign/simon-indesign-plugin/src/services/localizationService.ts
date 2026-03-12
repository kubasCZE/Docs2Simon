import uxp from "uxp"; // UXP API
import { cs } from "../localization/cs";
import { en } from "../localization/en";
import { ILocalizationTemplate } from "../localization/template";

export class LocalizationService {

    public getLocalizationString = (key: keyof ILocalizationTemplate): string => {
        if (this._getApplicationLanguage() === "cs_CZ")
            return cs[key];
        else
            return en[key];
    }

    private _getApplicationLanguage = (): string | undefined => {
        //  InDesign version < 19 = locale!
        return uxp.host.uiLocale ?? (uxp.host as any)?.locale;
    };

}