'use strict'

import * as vscode from 'vscode';
import * as fs from 'fs';

import { ChildProcessUtility } from '../Utilities/ChildProcessUtility';
import { FileUtility } from '../Utilities/FileUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';
import { GetReferenceUtility } from '../Utilities/GetReferenceUtility'

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';

import * as XMLMapping from 'xml-mapping';

export class RemoveDllReference {
    public ExecuteRemoveDllReferenceCmd(args) {
        // Todo
        let rootPath;
        if (typeof args == StringUtility.Undefined) {
            if (ValidationUtility.WorkspaceValidation()) {
                let rootFolders = ValidationUtility.SelectRootPath();

                if (rootFolders.size > 1) {
                    // Select the workspace folder.
                    QuickPickUtility.ShowQuickPick(Array.from(rootFolders.keys()), StringUtility.SelectWorkspaceFolder)
                        .then(response => {
                            if (typeof response != StringUtility.Undefined) {
                                rootPath = rootFolders.get(response);
                                RemoveDllReference.GetCsprojList(rootPath);
                            }
                        });
                }
                else {
                    rootPath = rootFolders.values().next().value;
                    RemoveDllReference.GetCsprojList(rootPath);
                }
            }
        }
        else {
            rootPath = args.fsPath.substring(0, args.fsPath.lastIndexOf(StringUtility.PathSeperator))
            RemoveDllReference.RemoveReference(args.fsPath, rootPath)
        }
    }
    public static GetCsprojList(rootPath) {
        let csprojNameList: Map<string, string> = FileUtility.GetFilesbyExtension(rootPath,
            FileTypeEnum.Csproj, new Map<string, string>());
        QuickPickUtility.ShowQuickPick(Array.from(csprojNameList.keys()), StringUtility.SelectCsproj)
            .then(response => {
                if (typeof response != StringUtility.Undefined) {
                    let csprojPath = csprojNameList.get(response);
                    csprojPath = csprojPath + StringUtility.PathSeperator + response;
                    RemoveDllReference.RemoveReference(csprojPath, rootPath);
                }
            })
    }

    public static RemoveReference(csprojPath, rootPath) {
        let referredPackageList = GetReferenceUtility.GetReferredList(csprojPath, rootPath, 'Reference')
        if (referredPackageList.size > 0) {
            QuickPickUtility.ShowQuickPick(Array.from(referredPackageList.keys()), StringUtility.SelectDll)
                .then(response => {
                    if (typeof response != StringUtility.Undefined) {
                        let jsonData: any = XMLMapping.load(fs.readFileSync(csprojPath).toString(), { comments: false });

                        try {
                            if (jsonData.Project.ItemGroup instanceof Array) {

                                for (let i = 0; i < jsonData.Project.ItemGroup.length; i++) {
                                    if (jsonData.Project.ItemGroup[i]['Reference'] instanceof Array) {
                                        for (let j = 0; j < jsonData.Project.ItemGroup[i]['Reference'].length; j++) {
                                            if (jsonData.Project.ItemGroup[i]['Reference'][j]['Include'] == response) {
                                                jsonData.Project.ItemGroup[i]['Reference'].splice(j, 1);
                                            }

                                        }
                                    }
                                    else if (jsonData.Project.ItemGroup[i]['Reference'] != null) {

                                        if (jsonData.Project.ItemGroup[i]['Reference']['Include'] == response) {
                                            jsonData.Project.ItemGroup.splice(i, 1);

                                        }
                                    }
                                }
                            }
                            else
                                if (jsonData.Project.ItemGroup['Reference'] instanceof Array) {
                                    for (let j = 0; j < jsonData.Project.ItemGroup['Reference'].length; j++) {

                                        if (jsonData.Project.ItemGroup['Reference'][j]['Include'] == response) {
                                            jsonData.Project.ItemGroup['Reference'].splice(j, 1);
                                        }
                                    }
                                }
                                else {
                                    if (jsonData.Project.ItemGroup['Reference']['Include'] == response) {
                                        jsonData.Project.ItemGroup = null;
                                    }
                                }
                        }

                        catch{
                            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.Error, []);
                        }
                        // Converting json data to xml.
                        let xmlData: any = XMLMapping.dump(jsonData, { indent: true });
                        // Open the csproj file in write mode.
                        fs.writeFileSync(csprojPath, xmlData)
                        MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.FormatString(StringUtility.RemoveDllSuccess, response), []);

                    }
                })
        }
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.AssemblyRefNotFound, [])
        }
    }
}