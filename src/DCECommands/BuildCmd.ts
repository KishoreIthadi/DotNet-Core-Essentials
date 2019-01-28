'use strict';

import { FileUtility } from '../Utilities/FileUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { TerminalUtility } from '../Utilities/TerminalUtility';

export class BuildCmd {

    public ExecuteBuildCmd(args) {

        if (typeof args == StringUtility.Undefined) {

            if (ValidationUtility.WorkspaceValidation()) {

                let rootFolders = ValidationUtility.SelectRootPath();

                if (rootFolders.size > 1) {
                    // Select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()),
                        StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                let rootPath = rootFolders.get(response);
                                BuildCmd.ValidateProject(rootPath);
                            }
                        });
                }
                else {
                    let rootPath = rootFolders.values().next().value;
                    BuildCmd.ValidateProject(rootPath);
                }
            }
        }
        else {
            BuildCmd.BuildProject(args.fsPath);
        }
    }

    public static ValidateProject(rootPath) {

        let csprojNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Proj, new Map<string, string>());

        let slnNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.SLN, new Map<string, string>());

        // adding sln list into csprojlist
        slnNameNPathList.forEach(function (value, key) {
            csprojNameNPathList.set(key, value);
        });

        if (csprojNameNPathList.size > 0) {

            QuickPickUtility.ShowQuickPick(Array.from(csprojNameNPathList.keys()),
                StringUtility.SelectBuild)
                .then(selected => {
                    if (typeof selected != StringUtility.Undefined) {

                        let projectPath: string = csprojNameNPathList.get(selected);

                        // Checking CLI version
                        if (ValidationUtility.CheckCliVersion(projectPath)) {
                            BuildCmd.BuildProject(projectPath);
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

    public static BuildProject(projectPath: string) {
        TerminalUtility.ShowMessageOnTerminal(projectPath, `dotnet build  "${projectPath}"`);
    }
}