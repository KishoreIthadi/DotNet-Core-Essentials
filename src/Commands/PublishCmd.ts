'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import { ChildProcessUtility } from '../Utilities/ChildProcessUtility';
import { FileExplorerUtility } from '../Utilities/FileExplorerUtility';
import { FileUtility } from '../Utilities/FileUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { OutputChannelUtility } from '../Utilities/OutputChannelUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { UserOptionsEnum } from '../Enums/UserOptionsEnum';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import * as XMLMapping from 'xml-mapping';

export class PublishCmd {
    constructor() {
    }

    public ExecutePublishCmd(): void {

        try {
            // checking workspace is empty or not
            if (vscode.workspace.workspaceFolders.length > 0) {
                // checking for dotnet cli is installed 
                if (ValidationUtility.CheckDotnetCli()) {
                    let rootFolders = ValidationUtility.SelectRootPath();
                    // select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                let rootPath = rootFolders.get(response);
                                PublishCmd.GetProjectPath(rootPath);
                            }
                        })

                }
                // dotnet cli is not installed
                else {
                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliNotFound, []);
                }
            }
            // workspace is empty
            else {
                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, []);
            }
        }
        catch {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, [])
        }
    }

    // Get Project Path
    public static GetProjectPath(rootPath) {
        let csprojNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());

        if (csprojNameNPathList.size > 0) {
            QuickPickUtility.ShowQuickPick(Array.from(csprojNameNPathList.keys()), StringUtility.SelectPublishProject)
                .then(csprojName => {
                    if (typeof csprojName != StringUtility.Undefined) {
                        let projectPath: string = csprojNameNPathList.get(csprojName);
                        // Check Whether the project selected is csproj or not
                        if (ValidationUtility.CheckCliVersion(projectPath)) {
                            let csprojJsonObj: any = XMLMapping.load(fs.readFileSync(projectPath + '\\' + csprojName).toString());
                            ValidationUtility.ValidateProjectType(csprojJsonObj)
                                ? PublishCmd.PublishProject(projectPath, csprojName)
                                : MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.NotProject, [])
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

    public static PublishProject(projectPath: string, csprojName: string) {
        // Info bar to select the browse option.
        MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.SelectPublishPath,
            [UserOptionsEnum.Browse])
            .then(response => {
                if (typeof response != StringUtility.Undefined) {
                    // Opening file explorer to select the path to publish the output.
                    FileExplorerUtility.OpenFolder()
                        .then(fileUri => {
                            if (typeof fileUri != StringUtility.Undefined) {
                                if (!fs.existsSync(fileUri[0].fsPath + '\\PublishOutput')) {

                                    // Publishes a project.
                                    let publisher: any = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
                                        ['publish', csprojName, '-o', fileUri[0].fsPath + '\\PublishOutput'], projectPath);
                                    
                                    if (publisher.stdout.includes('error')) {
                                        MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.Error, [UserOptionsEnum.ShowOutput])
                                            .then(response => {
                                                if (response == UserOptionsEnum.ShowOutput) {
                                                    OutputChannelUtility.outputChannel.show();
                                                    OutputChannelUtility.outputChannel.appendLine(`${publisher.stdout}`);
                                                }
                                            });
                                    }
                                    // Showing the output that the operation is successful.
                                    else {
                                        MessageUtility.ShowMessage(MessageTypeEnum.Info,
                                            `Published successfully at ${fileUri[0].fsPath}`, []);
                                    }
                                }
                                // Error when the selected folder has the same folder name already exists.
                                else {
                                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.PublishExists, []);
                                }
                            }
                            // Error,If the path is not selected in the file explorere window 
                            else {
                                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.UnspecifiedFilePath, [])
                            }
                        });
                }
            });
    }
}