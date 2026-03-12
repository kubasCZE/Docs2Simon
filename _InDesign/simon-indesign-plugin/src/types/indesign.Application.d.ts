declare module "indesign" {

    interface Application {
        readonly activeDocument: Document;
        readonly documents: Document[];
        readonly version: string;
        readonly name: string;
        readonly id: number;
        readonly isValid: boolean;
        readonly layoutWindows: LayoutWindow[];
        readonly menuActions: MenuAction[];
        readonly menuBars: MenuBar[];
        readonly menus: Menu[];
        readonly panels: Panel[];
        readonly parent: Application;
        readonly preferences: Preferences;
        readonly properties: any;
        readonly scriptMenuActions: ScriptMenuAction[];
        readonly scriptPreferences: ScriptPreference;
        readonly selection: any[];
        readonly tools: Tool[];
        readonly transformPreferences: TransformPreference;
        readonly transparencyPreferences: TransparencyPreference;
        readonly userInteractionLevel: UserInteractionLevels;
        readonly viewPreferences: ViewPreference;
        readonly windows: Window[];

        activate(): void;
        addEventListener(eventType: string, handler: Function): void;
        applyMenuCustomization(): void;
        applyShortcutSet(shortcutSet: string): void;
        applyWorkspace(workspace: string): void;
        cancelAllTasks(): void;
        cascadeWindows(): void;
        changeColor(color: string): void;
        changeGlyph(glyph: string): void;
        changeGrep(grep: string): void;
        changeObject(object: string): void;
        changeText(text: string): void;
        changeTransliterate(): void;
        clearFrameFittingOptions(): void;
        colorTransform(): void;
        copy(): void;
        createCustomMiniFolio(): void;
        createTemporaryCopy(): void;
        cut(): void;
        deleteCloudDocument(): void;
        deleteFindChangeQuery(query: string): void;
        deleteUnusedTags(): void;
        doScript(scriptName: File | string | Function, language?: any, withArguments?: any, undoMode?: any, undoName?: string): void;
        dumpBetweenMemoryMarks(): void;
        dumpFromMemoryMark(): void;
        exportArticleFolio(): void;
        exportDpsArticle(): void;
        exportFolioToDirectory(): void;
        exportFolioToDirectoryPackage(): void;
        exportFolioToPackage(): void;
        exportMiniFolio(): void;
        exportPresets(): void;
        exportSelectionForCloudLibrary(): void;
        exportSettings(): void;
        exportStrokeStyles(): void;
        extractLabel(): void;
        findColor(): void;
        findGlyph(): void;
        findGrep(): void;
        findKeyStrings(): void;
        findObject(): void;
        findText(): void;
        findTransliterate(): void;
        generateIDMLSchema(): void;
        getAllOverlays(): void;
        getCCXUserJSONData(): void;
        getContextMathMLDescription(): void;
        getDigpubArticleVersion(): void;
        getDigpubVersion(): void;
        getElements(): void;
        getPathToExportMml2svg(): void;
        getStyleConflictResolutionStrategy(): void;
        getSupportedArticleViewerVersions(): void;
        getSupportedViewerVersions(): void;
        getUntitledCount(): void;
        getUserChoiceForCloudTextAddition(): void;
        handleMathMLMessage(): void;
        importAdobeSwatchbookProcessColor(): void;
        importAdobeSwatchbookSpotColor(): void;
        importFile(): void;
        importSettings(): void;
        importStyles(): void;
        insertLabel(): void;
        internalMethod(): void;
        invokeColorPicker(): void;
        isAppInTouchMode(): boolean;
        isUserSharingAppUsageData(): boolean;
        loadConditions(): void;
        loadFindChangeQuery(): void;
        loadMotionPreset(): void;
        loadPreflightProfile(): void;
        loadSwatches(): void;
        loadXMLTags(): void;
        memoryStatistics(): void;
        mountProject(): void;
        open(): void;
        openCloudAssetForEdit(): void;
        openCloudDocument(): void;
        openPanel(): void;
        packageUCF(): void;
        paste(): void;
        pasteInPlace(): void;
        pasteInto(): void;
        pasteWithoutFormatting(): void;
        performanceMetric(): void;
        performanceMetricLongName(): string;
        performanceMetricShortName(): string;
        place(): void;
        print(): void;
        quit(): void;
        redo(): void;
        removeEventListener(): void;
        removeFileFromRecentFiles(): void;
        resetPreference(): void;
        saveFindChangeQuery(): void;
        saveSwatches(): void;
        saveXMLTags(): void;
        select(): void;
        setApplicationPreferences(): void;
        setCloudLibraryCollection(): void;
        setCloudLibraryOptions(): void;
        setUntitledCount(): void;
        tileWindows(): void;
        toSource(): string;
        toSpecifier(): string;
        togglePanelSystemVisibility(): void;
        translateKeyString(): void;
        undo(): void;
        unpackageUCF(): void;
        updateFonts(): void;
        waitForAllTasks(): void;
    }

    interface LayoutWindow { }
    interface MenuAction { }
    interface MenuBar { }
    interface Menu { }
    interface Panel { }
    interface Preferences { }
    interface ScriptMenuAction { }
    interface ScriptPreference { }
    interface Tool { }
    interface TransformPreference { }
    interface TransparencyPreference { }
    interface ViewPreference { }
    interface Window { }
    interface Entry {
        /**
         * Returns the details of the given entry like name, type and native path in a readable string format.
         */
        toString(): string;

        /**
         * Copies this entry to the specified folder.
         * @param folder The folder to which to copy this entry.
         * @param options
         * @throws EntryExists If the attempt would overwrite an entry and overwrite is false.
         * @throws PermissionDenied If the underlying file system rejects the attempt.
         * @throws OutOfSpace If the file system is out of storage space.
         * @return File or Folder.
         */
        copyTo(
            folder: Folder,
            options: {
                /**
                 * If true, allows overwriting existing entries.
                 */
                overwrite?: boolean;
                /**
                 * If true, allows copying the folder.
                 */
                allowFolderCopy?: boolean;
            },
        ): Promise<File | Folder>;

        /**
         * Moves this entry to the target folder, optionally specifying a new name.
         * @param folder The folder to which to move this entry.
         * @param options
         */
        moveTo(
            folder: Folder,
            options: {
                /**
                 * If true allows the move to overwrite existing files.
                 */
                overwrite?: boolean;
                /**
                 * If specified, the entry is renamed to this name.
                 */
                newName?: string;
            },
        ): Promise<void>;

        /**
         * Removes this entry from the file system.
         * If the entry is a folder, all the contents will also be removed.
         * @return The number is 0 if succeeded, otherwise throws an Error.
         */
        delete(): Promise<number>;

        /**
         * Returns this entry's metadata.
         * @return This entry's metadata.
         */
        getMetadata(): Promise<EntryMetadata>;

        /**
         * Indicates that this instance is an Entry.
         * Useful for type-checking.
         */
        readonly isEntry: boolean;

        /**
         * Indicates that this instance is not a File.
         * Useful for type-checking.
         */
        readonly isFile: boolean;

        /**
         * Indicates that this instance is not a folder.
         * Useful for type-checking.
         */
        readonly isFolder: boolean;

        /**
         * The name of this entry.
         * Read-only.
         */
        readonly name: string;

        /**
         * The associated provider that services this entry.
         * Read-only.
         */
        readonly provider: FileSystemProvider;

        /**
         * The url of this entry.
         * You can use this url as input to other entities of the extension system like for eg: set as src attribute of a
         * Image widget in UI.
         * Read-only.
         */
        readonly url: string;

        /**
         * The platform native file-system path of this entry.
         * Read-only
         */
        readonly nativePath: string;
    }
    interface Folder { }
    interface FileSystemProvider { }
    interface EntryMetadata { }
    interface Language { }
    interface SaveOptions { }
    interface UndoModes { }
    interface SelectionOptions { }
    interface UserInteractionLevels { }

    const app: Application;
}

