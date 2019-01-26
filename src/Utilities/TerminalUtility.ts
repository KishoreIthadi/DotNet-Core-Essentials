'use strict'

import * as vscode from 'vscode';
import { Terminal } from 'vscode';

export class TerminalUtility {

    private static _terminalStack: vscode.Terminal[] = [];

    public static ShowMessageOnTerminal(path: string, message: string) {

        let temp: Terminal = this._terminalStack[0];

        if (this._terminalStack.length > 0) {
            this._terminalStack[0].hide();
            this._terminalStack[0].dispose();
            this._terminalStack.pop();
            this._terminalStack.push(vscode.window.createTerminal('DCE'));
        }
        else {
            this._terminalStack.push(vscode.window.createTerminal('DCE'));
        }

        this._terminalStack[0].show();
        this._terminalStack[0].sendText(message);
    }
}