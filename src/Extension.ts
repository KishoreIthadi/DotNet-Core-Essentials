'use strict';

import * as vscode from 'vscode';

import { AddRefCmd } from './commands/AddRefCmd';
import { GenerateCmd } from './commands/GenerateCmd';
import { PublishCmd } from './commands/PublishCmd';
import { StartUpProjectCmd } from './Commands/StartupProjectCmd';
import { BuildCmd } from './Commands/BuildCmd';
import { CleanCmd } from './Commands/CleanCmd';

/**
* Activating extension
*/
export function activate(context: vscode.ExtensionContext) {

  let addRefObj: AddRefCmd = new AddRefCmd();
  let generateCmdObj: GenerateCmd = new GenerateCmd();
  let publishCmdObj: PublishCmd = new PublishCmd();
  let startUpCmdObj: StartUpProjectCmd = new StartUpProjectCmd();
  let buildCmdObj: BuildCmd = new BuildCmd();
  let cleanCmdObj: CleanCmd = new CleanCmd();

  // Registering Commands.
  let createTemplateCmd: vscode.Disposable = vscode.commands.registerCommand('extension.createTemplate', generateCmdObj.ExecuteGenerateCmd);
  let addReferenceCmd: vscode.Disposable = vscode.commands.registerCommand('extension.addReference', addRefObj.ExecuteAddRefCmd);
  let startUpProjectCmd: vscode.Disposable = vscode.commands.registerCommand('extension.startup', (args) => { startUpCmdObj.ExecuteStartupCmd(args) });
  let publishCmd: vscode.Disposable = vscode.commands.registerCommand('extension.publish', publishCmdObj.ExecutePublishCmd);
  let buildCmd: vscode.Disposable = vscode.commands.registerCommand('extension.build', (args) => { buildCmdObj.ExecuteBuildCmd(args) });
  let cleanCmd: vscode.Disposable = vscode.commands.registerCommand('extension.clean', (args) => { cleanCmdObj.ExecuteCleanCmd(args) });

  // Disposing the objects.
  context.subscriptions.push(createTemplateCmd, addReferenceCmd, startUpProjectCmd, publishCmd, buildCmd, cleanCmd);
}
/**
* Deactivating extension
*/
export function deactivate() {
}