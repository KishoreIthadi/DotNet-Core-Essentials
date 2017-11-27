'use strict';

import * as vscode from 'vscode';

import { AddRefCmd } from './commands/AddRefCmd';
import { GenerateCmd } from './commands/GenerateCmd';
import { PublishCmd } from './commands/PublishCmd';

/**
* Activating extension
*/
export function activate(context: vscode.ExtensionContext) {

  let addRefObj: AddRefCmd = new AddRefCmd();
  let generateCmdObj: GenerateCmd = new GenerateCmd();
  let publishCmdObj: PublishCmd = new PublishCmd();

  // Registering Commands.
  let createTemplateCmd: vscode.Disposable = vscode.commands.registerCommand('extension.createTemplate', generateCmdObj.ConfirmCreationPath);
  let addReferenceCmd: vscode.Disposable = vscode.commands.registerCommand('extension.addReference', addRefObj.ExecuteAddRefCmd);
  let publishCmd: vscode.Disposable = vscode.commands.registerCommand('extension.publish', publishCmdObj.ExecutePublishCmd);
  // Disposing the objects.
  context.subscriptions.push(createTemplateCmd, addReferenceCmd, publishCmd);
}
/**
* Deactivating extension
*/
export function deactivate() {
}