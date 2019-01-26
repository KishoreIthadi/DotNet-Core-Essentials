'use strict'

import * as vscode from 'vscode';

export class FileExplorerUtility {

    public static OpenFile(fileType, selectMany = false) {
        let options: vscode.OpenDialogOptions = {
            canSelectMany: selectMany,
            filters: fileType
        };
        return vscode.window.showOpenDialog(options);
    }

    public static OpenFolder() {
        return vscode.window.showOpenDialog({ canSelectFolders: true });
    }
}