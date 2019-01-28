'use strict'

import * as vscode from 'vscode';

export class OutputChannelUtility {
    public static outputChannel = vscode.window.createOutputChannel('DotnetGen');
}