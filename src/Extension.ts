'use strict';

import * as vscode from 'vscode';

import { AddRefCmd } from './DCECommands/AddRefCmd';
import { GenerateCmd } from './DCECommands/GenerateCmd';
import { PublishCmd } from './DCECommands/PublishCmd';
import { StartUpProjectCmd } from './DCECommands/StartupProjectCmd';
import { BuildCmd } from './DCECommands/BuildCmd';
import { CleanCmd } from './DCECommands/CleanCmd';
import { NugetPackageCmd } from './DCECommands/NugetPackageCmd';
import { RemoveProjectReference } from './DCECommands/RemoveProjectReference';
import { RemoveNugetPackage } from './DCECommands/RemoveNugetPackage'

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
  let nugetPackageCmdObj: NugetPackageCmd = new NugetPackageCmd();
  let removeProjectReferenceObj:RemoveProjectReference = new RemoveProjectReference();
  let removePackageObj:RemoveNugetPackage = new RemoveNugetPackage();

  // Registering Commands.
  let createTemplateCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.createTemplate', generateCmdObj.ExecuteGenerateCmd);
  let addReferenceCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.addReference', addRefObj.ExecuteAddRefCmd);
  let startUpProjectCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.startup', (args) => { startUpCmdObj.ExecuteStartupCmd(args) });
  let publishCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.publish', publishCmdObj.ExecutePublishCmd);
  let buildCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.build', (args) => { buildCmdObj.ExecuteBuildCmd(args) });
  let cleanCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.clean', (args) => { cleanCmdObj.ExecuteCleanCmd(args) });
  let nugetPackageCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.addNugetPackage',
      (args) => { nugetPackageCmdObj.ExecuteAddNugetPackageCmd(args) });
  let removeProjectReferenceCmd: vscode.Disposable =
      vscode.commands.registerCommand('extension.removeProjectReference',
        (args) => { removeProjectReferenceObj.ExecuteRemoveReferenceCmd(args) });
  let removeNugetPackageCmd: vscode.Disposable =
        vscode.commands.registerCommand('extension.removeNugetPackage',
          (args) => { removePackageObj.ExecuteRemoveNugetPackageCmd(args) });

  // Disposing the objects.
  context.subscriptions.push(createTemplateCmd, addReferenceCmd, startUpProjectCmd,
    publishCmd, buildCmd, cleanCmd, nugetPackageCmd,removeProjectReferenceCmd,removeNugetPackageCmd);
}
/**
* Deactivating extension
*/
export function deactivate() {
}