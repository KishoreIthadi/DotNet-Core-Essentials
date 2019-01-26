'use strict'

import * as vscode from 'vscode';

import { ChildProcessUtility } from './ChildProcessUtility';
import { StringUtility } from './StringUtility';
import { MessageUtility } from './MessageUtility';

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { ProjectTypeEnum } from '../Enums/ProjectTypeEnum';

import { DataSource } from '../DataSource';

export class ValidationUtility {

    public static ValidateSlnAndProjectName(name: any): boolean {
        return /^[a-zA-Z0-9_. ]*$/.test(name) && !(DataSource.GetValidationList().indexOf(name) > -1);
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
                    if (jsonObj.Project.PropertyGroup[i].TargetFramework != null) {
                        if (jsonObj.Project.PropertyGroup[i].TargetFramework['$t'].includes(StringUtility.Core) ||
                            jsonObj.Project.PropertyGroup[i].TargetFramework['$t'].includes(StringUtility.Standard)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            else if (jsonObj.Project.PropertyGroup.TargetFramework != null) {
                return jsonObj.Project.PropertyGroup.TargetFramework['$t'].includes(StringUtility.Core)
                    || jsonObj.Project.PropertyGroup.TargetFramework['$t'].includes(StringUtility.Standard);
            }
            return false;
        }
        catch (exception) {
            return false;
        }
    }

    // Return the type of application to make it as a start up project.
    public static GetProjectType(jsonObj) {
        try {
            if (jsonObj.Project[StringUtility.SDK] == ProjectTypeEnum.WebApp) {
                return ProjectTypeEnum.WebApp;
            }
            else if (jsonObj.Project[StringUtility.SDK] == ProjectTypeEnum.ProjectSDK) {
                if (jsonObj.Project.PropertyGroup instanceof Array) {
                    for (let i = 0; i < jsonObj.Project.PropertyGroup.length; i++) {
                        if (jsonObj.Project.PropertyGroup[i].OutputType['$t'] != null) {
                            return jsonObj.Project.PropertyGroup[i].OutputType['$t'];
                        }
                    }
                    return undefined;
                }
                else if (jsonObj.Project.PropertyGroup.OutputType['$t'] != null) {
                    return jsonObj.Project.PropertyGroup.OutputType['$t'];
                }

                return undefined;

            }
        }
        catch (exception) {
            return undefined;
        }

    }

    public static WorkspaceValidation() {
        try {
            // Checking workspace is empty or not.
            if (vscode.workspace.workspaceFolders.length > 0) {
                // Checking whether dotnet cli is installed.
                if (ValidationUtility.CheckDotnetCli()) {
                    return true
                }
                // If dotnet cli is not installed.
                else {
                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliNotFound, []);
                    return false;
                }
            }

            // Workspace is empty.
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, []);
            return false;
        }
        catch (exception) {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, [])
            return false;
        }
    }

    // Used by Add Command
    // public static FirtLetterUpper(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }
}