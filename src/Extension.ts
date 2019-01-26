'use strict';

import * as vscode from 'vscode';

import { GenerateCmd } from './DCECommands/GenerateCmd';
import { PublishCmd } from './DCECommands/PublishCmd';
import { StartUpProjectCmd } from './DCECommands/StartupProjectCmd';
import { BuildCmd } from './DCECommands/BuildCmd';
import { CleanCmd } from './DCECommands/CleanCmd';
import { NugetPackageCmd } from './DCECommands/NugetPackageCmd';
import { RemoveProjectReference } from './DCECommands/RemoveProjectReference';
import { RemoveNugetPackage } from './DCECommands/RemoveNugetPackage'
import { AddProjectRef } from './DCECommands/AddProjectRef';
import { AddDllRef } from './DCECommands/AddDllRef';
import { RemoveDllReference } from './DCECommands/RemoveDllReference';
// import { AddClassCmd } from './DCECommands/AddClassCmd';

/**
* Activating extension
*/
export function activate(context: vscode.ExtensionContext) {

  let generateCmdObj: GenerateCmd = new GenerateCmd();
  let publishCmdObj: PublishCmd = new PublishCmd();
  let startUpCmdObj: StartUpProjectCmd = new StartUpProjectCmd();
  let buildCmdObj: BuildCmd = new BuildCmd();
  let cleanCmdObj: CleanCmd = new CleanCmd();
  let nugetPackageCmdObj: NugetPackageCmd = new NugetPackageCmd();
  let removeProjectReferenceObj: RemoveProjectReference = new RemoveProjectReference();
  let removePackageObj: RemoveNugetPackage = new RemoveNugetPackage();
  let addProjectRefObj: AddProjectRef = new AddProjectRef();
  let addDllRefObj: AddDllRef = new AddDllRef();
  let removeDllReferenceObj: RemoveDllReference = new RemoveDllReference();
  // let addClassObj: AddClassCmd = new AddClassCmd();

  // Registering Commands.
  let createTemplateCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.createTemplate', generateCmdObj.ExecuteGenerateCmd);
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
  let removeDllReferenceCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.removeDllReference',
      (args) => { removeDllReferenceObj.ExecuteRemoveDllReferenceCmd(args) });
  let removeNugetPackageCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.removeNugetPackage',
      (args) => { removePackageObj.ExecuteRemoveNugetPackageCmd(args) });
  let addProjectRefCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.addProjectReference',
      (args) => { addProjectRefObj.ExecuteAddRef(args) });
  let addDllRefCmd: vscode.Disposable =
    vscode.commands.registerCommand('extension.addDllReference',
      (args) => { addDllRefObj.ExecuteAddRef(args) });
  // let addClassCmd: vscode.Disposable =
  //   vscode.commands.registerCommand('extension.addClass',
  //     (args) => { addClassObj.ExecuteAddClassCmd(args) });

  // Disposing the objects.
  context.subscriptions.push(createTemplateCmd, startUpProjectCmd,
    publishCmd, buildCmd, cleanCmd, nugetPackageCmd, removeProjectReferenceCmd,
    removeNugetPackageCmd, removeDllReferenceCmd, addProjectRefCmd, addDllRefCmd);
}
/**
* Deactivating extension
*/
export function deactivate() {
}