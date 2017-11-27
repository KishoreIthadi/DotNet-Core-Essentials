import * as vscode from 'vscode';

import { ChildProcessUtility } from './ChildProcessUtility';
import { QuickPickUtility } from './QuickPickUtility';
import { StringUtility } from './StringUtility';
import { MessageUtility } from './MessageUtility';

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';

import { DataSource } from '../DataSource';

export class ValidationUtility {

    public static ValidateSlnAndProjectName(name: any): boolean {
        return /^[a-zA-Z0-9_ ]*$/.test(name) && !(DataSource._validationList.indexOf(name) > -1);
    }

    // To check whether dotnet core 2.x sdk is installed.
    public static CheckDotnetCli(): boolean {
        let ls: any = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet, ['--version'], __dirname);
        if (typeof ls.error != StringUtility.Undefined || !(/^[2]/g.test(ls.stdout.toString()))) {
            return false;
        }
        return true;
    }

    // To check whether dotnet cli is 2.x.
    public static CheckCliVersion(solutionPath): boolean {
        let ls: any = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet, ['--version'], solutionPath);
        if (!(/^[2]/g.test(ls.stdout.toString()))) {
            return false;
        }
        return true;
    }

    // To return workspace Folders.
    public static SelectRootPath() {
        let rootFolders: Map<string, string> = new Map<string, string>();
        for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {
            rootFolders.set(vscode.workspace.workspaceFolders[i].name, vscode.workspace.workspaceFolders[i].uri.fsPath)
        }
        return rootFolders;
    }

    // Validate whether the project is core or standard.
    public static ValidateProjectType(jsonObj) {
        try {
            if (jsonObj.Project.PropertyGroup instanceof Array) {
                for (let i = 0; i < jsonObj.Project.PropertyGroup.length; i++) {
                    if (jsonObj.Project.PropertyGroup[i].TargetFramework['$t'].includes('core') ||
                        jsonObj.Project.PropertyGroup.TargetFramework['$t'].includes('standard')) {
                        return true;
                    }
                }
                return false;
            }
            else if (jsonObj.Project.PropertyGroup.TargetFramework != null) {
                return jsonObj.Project.PropertyGroup.TargetFramework['$t'].includes('core')
                    || jsonObj.Project.PropertyGroup.TargetFramework['$t'].includes('standard');
            }
            return false;

        }
        catch{
            return false;
        }
    }
}