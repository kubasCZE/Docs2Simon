import { makeObservable, observable, runInAction } from "mobx";
import uxp from "uxp"; // UXP API
import { FileService } from "./fileService";
import { LocalizationService } from "./localizationService";
import { Entry } from "indesign";
import { DocumentService } from "./documentService";
import { SimonService } from "./simonService";

export class DataStore {
    private _cover: Entry | null = null;
    private _styleNameForPartSplitting: string | null = null;
    private _isbnSourcePages: string | null = null;
    private _isProcessing: boolean = false;

    constructor() {
        makeObservable<DataStore, "_cover" | "_styleNameForPartSplitting" | "_isProcessing">(this, {
            _cover: observable,
            _styleNameForPartSplitting: observable,
            _isProcessing: observable,
        });
    }

    public fileservice: FileService = new FileService(this);
    public simonService: SimonService = new SimonService(this);
    public documentService: DocumentService = new DocumentService();
    public localizationService: LocalizationService = new LocalizationService();

    public get cover(): Entry | null {
        return this._cover;
    }

    public setCover = (cover: Entry | null) => {
        runInAction(() => this._cover = cover);
    };

    public get styleNameForPartSplitting(): string | null {
        return this._styleNameForPartSplitting;
    }

    public setStyleNameForPartSplitting = (styleName: string) => {
        runInAction(() => this._styleNameForPartSplitting = styleName);
    };

    public get isbnSourcePages(): string | null {
        return this._isbnSourcePages;
    }

    public setIsbnSourcePages = (pages: string) => {
        runInAction(() => this._isbnSourcePages = pages);
    };

    public get isProcessing(): boolean {
        return this._isProcessing;
    }

    public setIsProcessing = (isProcessing: boolean) => {
        runInAction(() => this._isProcessing = isProcessing);
    };

    public getTheme() {
        console.log("Theme:", uxp);
    }
}