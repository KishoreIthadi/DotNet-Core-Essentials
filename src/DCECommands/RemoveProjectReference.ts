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


export class RemoveProjectReference{
    public ExecuteRemoveReferenceCmd(args){
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
                                RemoveProjectReference.GetCsprojList(rootPath);
                            }
                        });
                }
                else {
                    rootPath = rootFolders.values().next().value;
                    RemoveProjectReference.GetCsprojList(rootPath);
                }
            }
        }
        else{
            rootPath=args.fsPath.substring(0,args.fsPath.lastIndexOf('\\'))
            RemoveProjectReference.RemoveReference(args.fsPath,rootPath)
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
                RemoveProjectReference.RemoveReference(csprojPath,rootPath);  
            }
        })
    }

    public static RemoveReference(csprojPath,rootPath){
        let referredProjectsList = GetReferenceUtility.GetReferredList(csprojPath,rootPath,'ProjectReference');
        if(referredProjectsList.size > 0){
            QuickPickUtility.ShowQuickPick(Array.from(referredProjectsList.keys()),StringUtility.SelectProject)
            .then(response => {
                if(typeof response != StringUtility.Undefined){
                    let output = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,['remove',csprojPath,'reference',referredProjectsList.get(response) ],rootPath);
                    MessageUtility.ShowMessage(MessageTypeEnum.Info,output.stdout.toString(),[])
                }
            })
        }
        else{
            MessageUtility.ShowMessage(MessageTypeEnum.Error,StringUtility.ProjectRefNotFound,[])
        }
    }
}