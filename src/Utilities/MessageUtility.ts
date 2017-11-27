'use strict';

import * as vscode from 'vscode';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';

export class MessageUtility {

    static ShowMessage(type: Number, message: string, items: string[]) {

        if (type == MessageTypeEnum.Error) {
            return vscode.window.showErrorMessage(message, ...items);
        }
        if (type == MessageTypeEnum.Info) {
            return vscode.window.showInformationMessage(message, ...items);
        }
        if (type == MessageTypeEnum.Warning) {
            return vscode.window.showWarningMessage(message, ...items);
        }
    }
}