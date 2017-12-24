import * as fs from 'fs'
import * as vscode from 'vscode'
import * as XMLMapping from 'xml-mapping';

import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility'
import { QuickPickUtility } from '../Utilities/QuickPickUtility'
import { MessageTypeEnum } from '../Enums/MessageTypeEnum'
import { MessageUtility } from '../Utilities/MessageUtility'
import { FileUtility } from '../Utilities/FileUtility'
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { ProjectTypeEnum } from '../Enums/ProjectTypeEnum';

export class StartUpProjectCmd {

    public ExecuteStartupCmd(args) {

        if (typeof args == StringUtility.Undefined) {
            if (ValidationUtility.WorkspaceValidation()) {
                let rootFolders = ValidationUtility.SelectRootPath();
                if (rootFolders.size > 1) {
                    // Select workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                let rootPath = rootFolders.get(response);
                                StartUpProjectCmd.SelectProject(rootPath);
                            }
                        });
                }
                else {
                    let rootPath = rootFolders.values().next().value;
                    StartUpProjectCmd.SelectProject(rootPath);
                }
            }
        }
        else {
            var csprojName = args.fsPath.substring(args.fsPath.lastIndexOf('\\') + 1);
            var csprojfolderPath = args.fsPath.toString().replace(csprojName, "")
            let rootPath = '';

            if (vscode.workspace.workspaceFolders.length == 1) {
                rootPath = vscode.workspace.rootPath;
                StartUpProjectCmd.SetSatrtup(csprojName, csprojfolderPath, rootPath);
            }
            else {
                let index = 0;

                for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {

                    // Check if folder name exist in args.path
                    // There is a chance of having the same folder in multiple paths
                    // Check the first occurance of the folder

                    let tempIndex = args.fsPath.toString().lastIndexOf(vscode.workspace.workspaceFolders[i].name);

                    if (index == 0 || index < tempIndex) {
                        index = tempIndex;
                        rootPath = vscode.workspace.workspaceFolders[i].uri.fsPath;
                    }
                }
            }

            StartUpProjectCmd.SetSatrtup(csprojName, csprojfolderPath, rootPath);
        }
    }

    public static SelectProject(rootPath) {
        // Get the list of projects under given path.
        let csprojList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());

        if (csprojList.size > 0) {
            // Display .csproj files under selected path.
            QuickPickUtility.ShowQuickPick(Array.from(csprojList.keys()),
                StringUtility.StartupProject)
                .then(csprojName => {

                    if (typeof csprojName != StringUtility.Undefined) {

                        let csprojPath = csprojList.get(csprojName);

                        StartUpProjectCmd.SetSatrtup(csprojName, csprojPath, rootPath);
                    }
                });
        }
        // No project found in current workspace.
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.ProjectNotFound, []);
        }
    }

    public static SetSatrtup(csprojName: string, csprojPath: string, rootPath: string) {

        // Deleting all the .vscode folders in workspace
        for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {

            var path = vscode.workspace.workspaceFolders[i].uri.fsPath + "\\.vscode";
            if (fs.existsSync(path)) {
                FileUtility.DeleteFolderRecursive(path);
            }
        }

        if (typeof csprojName != StringUtility.Undefined) {
            // Capturing csproj path.
            let completecsprojPath = csprojPath + '\\' + csprojName;
            // Converting the file to csproj.
            let csprojJsonData = XMLMapping.tojson(fs.readFileSync(completecsprojPath).toString())
            // Validating csproj.
            if (ValidationUtility.ValidateProjectType(csprojJsonData)) {
                // Capturing the type of application.
                let projectType = ValidationUtility.GetProjectType(csprojJsonData);
                // Validting the path. 
                if (typeof projectType != StringUtility.Undefined) {
                    // Deriving paths.
                    let dllPath = csprojPath + StringUtility.RelativeDllPath + csprojName.substring(0, csprojName.lastIndexOf('.')) + FileTypeEnum.Dll;
                    let relativeCSprojpath = completecsprojPath.substring(rootPath.length).replace(/\\/g, '/');
                    let relativeDllPath = dllPath.substring(rootPath.length).replace(/\\/g, '/');
                    let workDirPath = csprojPath.substring(rootPath.length).replace(/\\/g, '/');
                    // Checking the project type.
                    if (projectType == ProjectTypeEnum.Console || projectType == ProjectTypeEnum.WebApp) {
                        // Checking for .vscode file.
                        if (!fs.existsSync(rootPath + StringUtility.RelativeVscodePath)) {
                            fs.mkdirSync(rootPath + StringUtility.RelativeVscodePath);
                        }
                        // Writing launch.json.
                        fs.writeFileSync(rootPath + StringUtility.LaunchPath, StringUtility.FormatString(projectType == ProjectTypeEnum.Console
                            ? StringUtility.LaunchConsole
                            : StringUtility.LaunchASPNet, [relativeDllPath, workDirPath]));
                        // Writing tasks.json.
                        fs.writeFileSync(rootPath + StringUtility.TasksPath, StringUtility.FormatString(StringUtility.Tasks, [relativeCSprojpath]));
                        MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.FormatString(StringUtility.StartupProjectSet, [csprojName]), []);
                    }
                    // Not a valid project to set as startup project.
                    else {
                        MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.StartupError, []);
                    }
                }
                // Not a valid project to set as startup project.
                else {
                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.StartupError, []);
                }
            }
            // Not a valid csproj project.
            else {
                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.NotProject, []);
            }
        }
    }
}