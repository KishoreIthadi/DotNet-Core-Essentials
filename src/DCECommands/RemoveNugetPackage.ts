'use strict'

import * as vscode from 'vscode';
import * as fs from 'fs';

import { ChildProcessUtility } from '../Utilities/ChildProcessUtility';
import { FileUtility } from '../Utilities/FileUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';
import {GetReferenceUtility} from '../Utilities/GetReferenceUtility'

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';



export class RemoveNugetPackage{
    public ExecuteRemoveNugetPackageCmd(args){
        let rootPath;
        if(typeof args == StringUtility.Undefined){
            if (ValidationUtility.WorkspaceValidation()) {
                let rootFolders = ValidationUtility.SelectRootPath();
                
                if (rootFolders.size > 1) {
                    // Select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                rootPath = rootFolders.get(response);
                                RemoveNugetPackage.GetCsprojList(rootPath);
                            }
                        });
                }
                else {
                    rootPath = rootFolders.values().next().value;
                    RemoveNugetPackage.GetCsprojList(rootPath);
                }
            }
        }
        else{
            rootPath=args.fsPath.substring(0,args.fsPath.lastIndexOf('\\'))
            RemoveNugetPackage.RemoveReference(args.fsPath,rootPath)
        }
        
    }

    public static GetCsprojList(rootPath){
        let csprojNameList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());
        QuickPickUtility.ShowQuickPick(Array.from(csprojNameList.keys()),StringUtility.SelectCsproj)
        .then(response => {
            if(typeof response != StringUtility.Undefined){
                let csprojPath = csprojNameList.get(response);
                csprojPath=csprojPath+StringUtility.PathSeperator+response;
                RemoveNugetPackage.RemoveReference(csprojPath,rootPath);  
            }
        })
    }

    public static RemoveReference(csprojPath,rootPath){
        let referredPackageList = GetReferenceUtility.GetReferredList(csprojPath,rootPath,'PackageReference')
        if(referredPackageList.size > 0){
            QuickPickUtility.ShowQuickPick(Array.from(referredPackageList.keys()),StringUtility.SelectPackage)
            .then(response => {
                if(typeof response != StringUtility.Undefined){
                    let output = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,['remove',csprojPath,'reference',referredPackageList.get(response) ],rootPath);
                    MessageUtility.ShowMessage(MessageTypeEnum.Info,StringUtility.FormatString(StringUtility.RemovePackageSuccess,response),[])
                }
            })
        }
        else{
            MessageUtility.ShowMessage(MessageTypeEnum.Error,StringUtility.PackageNotFound,[])
        }
    }
}