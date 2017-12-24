import { FileUtility } from '../Utilities/FileUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';

import { TerminalUtility } from '../Utilities/TerminalUtility';

export class CleanCmd {
    public ExecuteCleanCmd(args) {
        if (typeof args == StringUtility.Undefined) {
            if (ValidationUtility.WorkspaceValidation()) {
                let rootFolders = ValidationUtility.SelectRootPath();
                if (rootFolders.size > 1) {
                    // Select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                let rootPath = rootFolders.get(response);
                                CleanCmd.ValidateProject(rootPath);
                            }
                        });
                }
                else {
                    let rootPath = rootFolders.values().next().value;
                    CleanCmd.ValidateProject(rootPath);
                }
            }
        }
        else {
            CleanCmd.CleanProject(args.fsPath);
        }
    }
    
    public static ValidateProject(rootPath) {

        let csprojNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());

        let slnNameNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.SLN, new Map<string, string>());

        // adding sln list into csprojlist
        slnNameNPathList.forEach(function (value, key) {
            csprojNameNPathList.set(key, value);
        });

        if (csprojNameNPathList.size > 0) {
            QuickPickUtility.ShowQuickPick(Array.from(csprojNameNPathList.keys()), StringUtility.SelectPublishProject)
                .then(selected => {
                    if (typeof selected != StringUtility.Undefined) {
                        let projectPath: string = csprojNameNPathList.get(selected);
                        // Check Whether the project selected is csproj or not.
                        if (ValidationUtility.CheckCliVersion(projectPath)) {
                            CleanCmd.CleanProject(projectPath);
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

    public static CleanProject(projectPath: string) {
        TerminalUtility.ShowMessageOnTerminal(projectPath, `dotnet clean  "${projectPath}"`);
    }
}