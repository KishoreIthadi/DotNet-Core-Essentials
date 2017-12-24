import * as vscode from 'vscode';
import * as fs from 'fs';

import { FileUtility } from '../Utilities/FileUtility';
import { InputBoxUtility } from '../Utilities/InputBoxUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';

import { ChildProcessUtility } from '../Utilities/ChildProcessUtility';
import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { OutputChannelUtility } from '../Utilities/OutputChannelUtility';
import { TerminalUtility } from '../Utilities/TerminalUtility';

export class NugetPackageCmd {

    public ExecuteAddNugetPackageCmd(args) {
        if (typeof args == StringUtility.Undefined) {
            if (ValidationUtility.WorkspaceValidation()) {
                let rootFolders = ValidationUtility.SelectRootPath();
                if (rootFolders.size > 1) {
                    // Select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                let rootPath = rootFolders.get(response);
                                NugetPackageCmd.ValidateProject(rootPath);
                            }
                        });
                }
                else {
                    let rootPath = rootFolders.values().next().value;
                    NugetPackageCmd.ValidateProject(rootPath);
                }
            }
        }
        else {
            NugetPackageCmd.AddPackage(args.fsPath);
        }
    }

    public static ValidateProject(rootPath) {
        let csprojNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());
        if (csprojNameNPathList.size > 0) {
            QuickPickUtility.ShowQuickPick(Array.from(csprojNameNPathList.keys()), StringUtility.SelectPublishProject)
                .then(csprojName => {
                    if (typeof csprojName != StringUtility.Undefined) {
                        let projectPath: string = csprojNameNPathList.get(csprojName);
                        // Check Whether the project selected is csproj or not.
                        if (ValidationUtility.CheckCliVersion(projectPath)) {
                            NugetPackageCmd.AddPackage(projectPath);
                        }
                        else {
                            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliVersionError, []);
                        }
                    }
                });
        }
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.ProjectNotFound, []);
        }
    }

    public static AddPackage(projectPath: string) {
        InputBoxUtility.ShowInputBox('Enter the Nuget Package name').
            then(response => {
                if (response != StringUtility.Undefined) {
                    TerminalUtility.ShowMessageOnTerminal
                        (projectPath, `dotnet add "${projectPath}" package ${response}`);
                }
            })

    }

    public static RemovePackage(projectPath: string) {
        // ToDO : 
    }
}
