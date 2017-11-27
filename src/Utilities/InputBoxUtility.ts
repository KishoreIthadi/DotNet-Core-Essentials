'use strict';

import * as vscode from 'vscode';

export class InputBoxUtility {

    static ShowInputBox(message: string, ignoreFocusOut = true) {

        return vscode.window.showInputBox({
            prompt: message,
            ignoreFocusOut: ignoreFocusOut,
        });
    }
}