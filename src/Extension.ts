'use strict';

import * as vscode from 'vscode';

import { AddRefCmd } from './commands/AddRefCmd';
import { GenerateCmd } from './commands/GenerateCmd';
import { PublishCmd } from './commands/PublishCmd';
import { StartUpProject } from './Commands/StartupProject';

/**
* Activating extension
*/
export function activate(context: vscode.ExtensionContext) {

  let addRefObj: AddRefCmd = new AddRefCmd();
  let generateCmdObj: GenerateCmd = new GenerateCmd();
  let publishCmdObj: PublishCmd = new PublishCmd();
  let startUpCmdObj: StartUpProject = new StartUpProject();
  // Registering Commands.
  let createTemplateCmd: vscode.Disposable = vscode.commands.registerCommand('extension.createTemplate', generateCmdObj.ExecuteGenerateCmd);
  let addReferenceCmd: vscode.Disposable = vscode.commands.registerCommand('extension.addReference', addRefObj.ExecuteAddRefCmd);
  let startUpProjectCmd: vscode.Disposable = vscode.commands.registerCommand('extension.startup', startUpCmdObj.ExecuteStartupCmd);
  let publishCmd: vscode.Disposable = vscode.commands.registerCommand('extension.publish', publishCmdObj.ExecutePublishCmd);

  // Disposing the objects.
  context.subscriptions.push(createTemplateCmd, addReferenceCmd, startUpProjectCmd, publishCmd);
}
/**
* Deactivating extension
*/
export function deactivate() {
}