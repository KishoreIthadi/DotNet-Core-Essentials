'use strict';

import * as vscode from 'vscode';

export class QuickPickUtility {

    static ShowQuickPick(list: string[], placeHolder: string, ignoreFocusOut = true) {

        return vscode.window.showQuickPick(list, {
            ignoreFocusOut: ignoreFocusOut,
            placeHolder: placeHolder
        });
    }
}