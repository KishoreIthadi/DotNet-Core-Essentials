'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import { FileUtility } from '../Utilities/FileUtility';
import { InputBoxUtility } from '../Utilities/InputBoxUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { ProjectCreationUtility } from '../Utilities/ProjectCreationUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { FrameworkTypeEnum } from '../Enums/FrameworkTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { ProjectTypeEnum } from '../Enums/ProjectTypeEnum';

import { DataSource } from '../DataSource';
import { GenerateCmdDTO } from '../DTO/GenerateCmdDTO';

export class GenerateCmd {

    constructor() {
    }

    public ExecuteGenerateCmd() {
        if (ValidationUtility.WorkspaceValidation()) {
            let rootFolders = ValidationUtility.SelectRootPath();
            let GenerateCmdObj: GenerateCmdDTO = new GenerateCmdDTO();
            if (rootFolders.size > 1) {
                // Select the workspace folder.
                QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                    .then(response => {
                        if (typeof response != StringUtility.Undefined) {

                            GenerateCmdObj.RootPath = rootFolders.get(response);
                            GenerateCmd.SelectFramework(GenerateCmdObj);
                        }
                    });
            }
            else {
                GenerateCmdObj.RootPath = rootFolders.values().next().value;
                GenerateCmd.SelectFramework(GenerateCmdObj);
            }
        }
    }

    private static SelectFramework(GenerateCmdObj) {
        // Lists Framework types.
        QuickPickUtility
            .ShowQuickPick(DataSource.GetFrameworks(), StringUtility.SelectFW)
            .then(frameWork => {
                if (typeof frameWork != StringUtility.Undefined) {

                    GenerateCmdObj.FrameWork = frameWork;
                    GenerateCmd.SelectVersion(GenerateCmdObj);
                }
            });
    }

    private static SelectVersion(GenerateCmdObj: GenerateCmdDTO) {
        let versionsMap: Map<string, string> = DataSource.GetVersions(GenerateCmdObj.FrameWork);
        // Lists available versions.
        QuickPickUtility
            .ShowQuickPick(Array.from(versionsMap.keys()), StringUtility.SelectVersion)
            .then(fwVersion => {
                if (typeof fwVersion != StringUtility.Undefined) {
                    GenerateCmdObj.Version = versionsMap.get(fwVersion);
                    if (GenerateCmdObj.FrameWork == FrameworkTypeEnum.NetStandard) {
                        GenerateCmdObj.AppType = ProjectTypeEnum.Classlib;
                        GenerateCmd.SlnFinder(GenerateCmdObj);
                    }
                    else {
                        GenerateCmd.SelectApplicationType(GenerateCmdObj);
                    }
                }
            });
    }

    private static SelectApplicationType(GenerateCmdObj: GenerateCmdDTO) {
        let applicationTypeMap: Map<string, string> = DataSource.GetApplicationTypes();
        // Displays types of application.
        QuickPickUtility
            .ShowQuickPick(Array.from(applicationTypeMap.keys()), StringUtility.SelectAppType)
            .then(fwAppType => {
                if (typeof fwAppType != StringUtility.Undefined) {
                    GenerateCmdObj.AppType = applicationTypeMap.get(fwAppType);
                    GenerateCmd.SlnFinder(GenerateCmdObj);
                }
            });
    }

    public static SlnFinder(GenerateCmdObj: GenerateCmdDTO) {

        // Checks for sln files in the current folder.
        let slnNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(GenerateCmdObj.RootPath,
            FileTypeEnum.SLN, new Map<string, string>());

        // Adding "Create New Solution" at last in the list.
        slnNPathList.set(StringUtility.CreateSln, StringUtility.CreateSln);

        let slnNameList: string[] = Array.from(slnNPathList.keys());

        if (slnNPathList.size > 1) {

            // Lists all sln files and asks for app name if selected.
            QuickPickUtility.ShowQuickPick(Array.from(slnNPathList.keys()), StringUtility.SelectSolution)
                .then(slnName => {
                    if (typeof slnName != StringUtility.Undefined) {
                        if (slnName != StringUtility.CreateSln) {
                            GenerateCmdObj.IsSlnExists = true;
                            GenerateCmdObj.SlnName = slnName;
                            GenerateCmdObj.SolutionPath = slnNPathList.get(slnName);
                            GenerateCmd.ReadAppName(GenerateCmdObj);
                        }
                        else {
                            // Ask for sln name if 'Create new sln' is selected.
                            GenerateCmd.ReadSlnName(GenerateCmdObj);
                        }
                    }
                });
        }
        else {
            GenerateCmd.ReadSlnName(GenerateCmdObj);
        }
    }

    private static ReadSlnName(GenerateCmdObj: GenerateCmdDTO) {
        InputBoxUtility
            .ShowInputBox(StringUtility.EnterSolutionName)
            .then(slnName => {
                if (typeof slnName != StringUtility.Undefined) {

                    // Checks whether sln name is valid. 
                    if (ValidationUtility.ValidateSlnAndProjectName(slnName)) {
                        GenerateCmdObj.SlnName = slnName;
                        if (fs.existsSync(GenerateCmdObj.RootPath + '\\' + GenerateCmdObj.SlnName + '.sln')) {
                            MessageUtility.ShowMessage(MessageTypeEnum.Error,
                                StringUtility.FormatString(StringUtility.SolutionExists,
                                    [GenerateCmdObj.RootPath]), []);
                        }
                        // Checks whether folder exists.
                        else if (fs.existsSync(GenerateCmdObj.RootPath + '\\' + GenerateCmdObj.SlnName)) {
                            MessageUtility.ShowMessage(MessageTypeEnum.Error,
                                StringUtility.FormatString(StringUtility.FolderExists,
                                    [GenerateCmdObj.RootPath]), []);
                        }
                        else {
                            GenerateCmdObj.SlnName = GenerateCmdObj.SlnName.replace(/ /g, '_');
                            GenerateCmd.ReadAppName(GenerateCmdObj);
                        }

                    }
                    else {
                        MessageUtility.ShowMessage(MessageTypeEnum.Warning, StringUtility.InvalidSolutionName, [])
                            .then(() => {
                                // Ask for sln name if previous one is invalid.
                                GenerateCmd.ReadSlnName(GenerateCmdObj);
                            });
                    }
                }
            });
    }

    private static ReadAppName(GenerateCmdObj: GenerateCmdDTO) {
        if (ValidationUtility.CheckCliVersion(GenerateCmdObj.SolutionPath)) {
            InputBoxUtility
                .ShowInputBox(StringUtility.EnterAppName)
                .then(appName => {
                    if (typeof appName != StringUtility.Undefined) {
                        // Checks whether project name is valid.
                        if (ValidationUtility.ValidateSlnAndProjectName(appName)) {
                            GenerateCmdObj.AppName = appName;
                            // Replaces spaces with underscore.
                            GenerateCmdObj.AppName = GenerateCmdObj.AppName.replace(/ /g, '_');
                            if (fs.existsSync(GenerateCmdObj.SolutionPath + '\\' + appName)) {
                                MessageUtility.ShowMessage(MessageTypeEnum.Error,
                                    StringUtility.FormatString(StringUtility.FolderExists,
                                        [GenerateCmdObj.RootPath]), []);
                            }
                            else {
                                // Creates the application.
                                ProjectCreationUtility.GenerateApp(GenerateCmdObj);
                            }

                        }
                        else {
                            MessageUtility.ShowMessage(MessageTypeEnum.Warning, StringUtility.InvalidProjectName, [])
                                .then(() => {
                                    // Asks for app name if previous is invalid.
                                    GenerateCmd.ReadAppName(GenerateCmdObj);
                                });
                        }
                    }
                });
        }
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliVersionError, []);
        }
    }
}