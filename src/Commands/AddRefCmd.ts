'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import { ChildProcessUtility } from '../Utilities/ChildProcessUtility';
import { FileUtility } from '../Utilities/FileUtility';
import { FileExplorerUtility } from '../Utilities/FileExplorerUtility';
import { MessageUtility } from '../Utilities/MessageUtility';
import { OutputChannelUtility } from '../Utilities/OutputChannelUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { ValidationUtility } from '../Utilities/ValidationUtility';

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { UserOptionsEnum } from '../Enums/UserOptionsEnum';

import { AddReferenceDTO } from '../DTO/AddReferenceDTO';
import { DataSource } from '../DataSource';

import * as fs_extra from 'fs-extra';
import * as XMLMapping from 'xml-mapping';

export class AddRefCmd {

    constructor() {
    }

    public ExecuteAddRefCmd(): void {
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
                                let referenceDTO: AddReferenceDTO = new AddReferenceDTO();
                                referenceDTO.Path = rootFolders.get(response);
                                // Lists reference types.
                                QuickPickUtility.ShowQuickPick(DataSource._referenceTypeList, StringUtility.SelectRefType)
                                    .then(selectedReferenceType => {
                                        if (typeof selectedReferenceType != StringUtility.Undefined) {

                                            selectedReferenceType == DataSource._referenceTypeList[0]
                                                ? referenceDTO.FileType = FileTypeEnum.Csproj
                                                : referenceDTO.FileType = FileTypeEnum.Dll;

                                            referenceDTO.FileType == FileTypeEnum.Csproj
                                                ? AddRefCmd.SolutionSelecter(referenceDTO)
                                                : AddRefCmd.GetPaths(referenceDTO);
                                        }
                                    });
                            }
                        })
                }
                // dotnet cli is not installed.
                else {
                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliNotFound, [])
                }
            }
            // Workspace is empty.
            else {
                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, [])
            }
        }
        catch {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.WorkspaceEmpty, [])
        }
    }

    /**
    * Select solution for ADDProject Reference.
    */
    public static SolutionSelecter(referenceDTO) {

        let slnNPathList: Map<string, string> = FileUtility.GetFilesbyExtension(referenceDTO.Path,
            FileTypeEnum.SLN, new Map<string, string>());

        if (slnNPathList.size > 0) {
            // Lists all .sln files under current root folder.
            QuickPickUtility.ShowQuickPick(Array.from(slnNPathList.keys()), StringUtility.SelectSolution)
                .then(slnName => {
                    if (typeof slnName != StringUtility.Undefined) {
                        referenceDTO.Path = slnNPathList.get(slnName);
                        referenceDTO.SlnName = slnName;
                        AddRefCmd.GetPaths(referenceDTO);
                    }
                });
        }
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.SolutionDoesntExists, []);
        }
    }

    /**
    * Select the project(.csproj) or dll path.
    */
    public static GetPaths(referenceDTO) {

        // Get the list of projects under given path.
        let sourcecsprojList: Map<string, string> = FileUtility.GetFilesbyExtension(referenceDTO.Path,
            FileTypeEnum.Csproj, new Map<string, string>());

        if (sourcecsprojList.size > 0) {

            // Display .csproj files under selected path.
            QuickPickUtility.ShowQuickPick(Array.from(sourcecsprojList.keys()),
                StringUtility.SelectSourceCsproj)
                .then(sourceCSprojName => {
                    if (typeof sourceCSprojName != StringUtility.Undefined) {

                        referenceDTO.SourcePath = sourcecsprojList.get(sourceCSprojName) + '\\' + sourceCSprojName;
                        referenceDTO.CSProjName = sourceCSprojName.substring(0, sourceCSprojName.lastIndexOf('.'));
                        // Check whether the project is valid project or not
                        let SourceCsprojJsonObj: any = XMLMapping.load(fs.readFileSync(referenceDTO.SourcePath).toString());
                        if (ValidationUtility.ValidateProjectType(SourceCsprojJsonObj)) {
                            // Checking for dotnet 2.x cli version.
                            if (ValidationUtility.CheckCliVersion(sourcecsprojList.get(sourceCSprojName))) {
                                // Get the list of projects under the given path.
                                let destcsprojList: Map<string, string> = FileUtility.GetFilesbyExtension(referenceDTO.Path,
                                    referenceDTO.FileType, new Map<string, string>());

                                // Adding browse option to the list.
                                destcsprojList.set(UserOptionsEnum.Browse, UserOptionsEnum.Browse);

                                // Removing the selected source project name to avoid circular dependency.
                                if (referenceDTO.FileType == FileTypeEnum.Csproj) {
                                    destcsprojList.delete(sourceCSprojName);
                                }

                                QuickPickUtility.ShowQuickPick(Array.from(destcsprojList.keys()),
                                    StringUtility.SelectDestinationCsproj)
                                    .then(fileName => {
                                        if (typeof fileName != StringUtility.Undefined) {
                                            // Check if Browse option is selected.
                                            if (fileName != UserOptionsEnum.Browse) {
                                                referenceDTO.DestinationPath = destcsprojList.get(fileName) + '\\' + fileName;
                                                referenceDTO.DLLName = fileName.substring(0, fileName.lastIndexOf('.'));
                                                // Check Whether the project selected is csproj or not
                                                let DestCsprojJsonObj: any = XMLMapping.load(fs.readFileSync(referenceDTO.DestinationPath).toString());
                                                ValidationUtility.ValidateProjectType(DestCsprojJsonObj)
                                                    ? referenceDTO.FileType == FileTypeEnum.Csproj
                                                        ? AddRefCmd.AddProjectReference(referenceDTO)
                                                        : AddRefCmd.AddAssemblyReference(referenceDTO)
                                                    : MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.NotProject, []);
                                            }
                                            else {
                                                referenceDTO.FileType == FileTypeEnum.Csproj
                                                    ? AddRefCmd.CopyProject(referenceDTO)
                                                    : AddRefCmd.BrowseDllPath(referenceDTO);
                                            }
                                        }
                                    });
                            }
                            // Error if cli version is not 2.x or higher.
                            else {
                                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.CliVersionError, []);
                            }
                        }
                        // Error if the project selected is not the valid project
                        else {
                            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.NotProject, [])
                        }

                    }
                });
        }
        else {
            // Error message if no project is found with in the rootpath of the selected solution.
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.ProjectNotFound, []);
        }
    }

    /**
    * Copy Project to current working folder if doesn't exist.
    */
    public static CopyProject(referenceDTO) {
        // Warning the user the operation cause copying the  the folder to the current solution path.
        MessageUtility.ShowMessage(MessageTypeEnum.Warning, StringUtility.AddProjRefCopyWarning,
            [UserOptionsEnum.Yes])
            .then(response => {
                if (response == UserOptionsEnum.Yes) {
                    // Opening file explorer to select the project.
                    FileExplorerUtility.OpenFile(DataSource._filterCsproj)
                        .then(referalFileUri => {
                            if (typeof referalFileUri != StringUtility.Undefined) {
                                referenceDTO.DestinationPath = referalFileUri[0].fsPath;
                                // Check Whether the project selected is csproj or not
                                let DestCsprojJsonObj: any = XMLMapping.load(fs.readFileSync(referenceDTO.DestinationPath).toString());
                                if (ValidationUtility.ValidateProjectType(DestCsprojJsonObj)) {
                                    let copyPath: string = referalFileUri[0].fsPath
                                        .substring(0, referalFileUri[0].fsPath.lastIndexOf('\\'));

                                    // Circular Dependency check.
                                    if (AddRefCmd.CircularDependencyCheck(referenceDTO)) {
                                        MessageUtility.ShowMessage(MessageTypeEnum.Error,
                                            StringUtility.CircularDepError, []);
                                    }
                                    // Copy project folder to current root folder if no circular dependency exists.
                                    else {
                                        fs_extra.copySync(copyPath, referenceDTO.Path + '\\' + copyPath.substring(copyPath.lastIndexOf('\\') + 1));
                                        AddRefCmd.AddProjectReference(referenceDTO);
                                    }
                                }
                                // Error if the project selected is not the valid project.
                                else {
                                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.NotProject, [])
                                }
                            }
                            // Error if the file is not selected when the windows explorer is opened.
                            else {
                                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.UnspecifiedFilePath, []);
                            }
                        });
                }
            });
    }

    /**
    * Adding the Project reference.
    */
    public static AddProjectReference(referenceDTO) {

        // Add source project to solution.
        ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
            ['sln', referenceDTO.SlnName, 'add', referenceDTO.SourcePath], referenceDTO.Path);

        // Add destination project to solution.
        ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
            ['sln', referenceDTO.SlnName, 'add', referenceDTO.DestinationPath], referenceDTO.Path);

        // Adding referece of destination project to source project.
        let addReference: any = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
            ['add', referenceDTO.SourcePath, 'reference', referenceDTO.DestinationPath],
            referenceDTO.Path);

        // Displaying output if any error occurs.
        if (addReference.stderr.byteLength > 0) {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.Error, [UserOptionsEnum.ShowOutput])
                .then(response => {
                    if (response == UserOptionsEnum.ShowOutput) {
                        OutputChannelUtility.outputChannel.show();
                        OutputChannelUtility.outputChannel.appendLine(`${addReference.stderr.toString()}`);
                    }
                })

        }
        // Showing the info bar after the reference is successfully added.
        else {
            MessageUtility.ShowMessage(MessageTypeEnum.Info, addReference.stdout.toString(), []);
        }
    }

    /**
    * Browse dll path.
    */
    public static BrowseDllPath(referenceDTO) {
        FileExplorerUtility.OpenFile(DataSource._filterDLL)
            .then(dllUri => {
                if (typeof dllUri != StringUtility.Undefined) {
                    referenceDTO.DestinationPath = dllUri[0].fsPath;
                    AddRefCmd.AddAssemblyReference(referenceDTO);
                }
                else {
                    MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.UnspecifiedFilePath, []);
                }
            });
    }

    /**
    * Add assembly reference (.dll Refernce).
    */
    public static AddAssemblyReference(referenceDTO) {

        referenceDTO.DLLName = referenceDTO.DestinationPath
            .substring(referenceDTO.DestinationPath.lastIndexOf('\\') + 1);

        // Checking for circular dependency.
        // Checking if same project dll is selected.
        if (referenceDTO.CSProjName == referenceDTO.DLLName.substring(0, referenceDTO.DLLName.lastIndexOf('.'))) {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.AddDllExistsError, []);
        }
        // Checking if selected dll is already referred. 
        else if (fs.readFileSync(referenceDTO.SourcePath).includes(referenceDTO.DLLName)) {
            MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.SameDllReference, []);
        }
        else {
            // Reading source csproj file and converting it to json object.
            let jsonData: any = XMLMapping.load(fs.readFileSync(referenceDTO.SourcePath).toString());

            // Getting JsonObjects. 
            let referenceJsonObj: any = DataSource.GetJsonObject(referenceDTO.DLLName
                .substring(0, referenceDTO.DLLName.lastIndexOf('.')), referenceDTO.DestinationPath, true);
            let itemGroupJsonObj: any = DataSource.GetJsonObject(referenceDTO.DLLName
                .substring(0, referenceDTO.DLLName.lastIndexOf('.')), referenceDTO.DestinationPath, false);

            // Finding whether the itemgroup tag is present or not. If not present create the item group and reference tags.
            if (jsonData.Project.ItemGroup == null) {
                jsonData.Project['ItemGroup'] = {};
                jsonData.Project.ItemGroup['Reference'] = referenceJsonObj;
            }
            // Finding whether the itemgroup is array or not. If not an array move the object to array and add to the itemgroup array. 
            else if (typeof jsonData.Project.ItemGroup.length == StringUtility.Undefined) {
                let jsonObjArr: Array<typeof jsonData.Project.ItemGroup> = [];
                jsonObjArr.push(jsonData.Project.ItemGroup);
                jsonObjArr.push(itemGroupJsonObj);
                jsonData.Project['ItemGroup'] = jsonObjArr;
            }
            // If the itemgroup is an array then push the reference to the array.
            else {
                let index: number = jsonData.Project.ItemGroup.length;
                jsonData.Project.ItemGroup[index] = itemGroupJsonObj;
            }
            // Converting json data to xml.
            let xmlData: any = XMLMapping.dump(jsonData);
            // Formatting the data i.e indentation.
            xmlData = StringUtility.FormatXML(xmlData, '\t');
            // Open the csproj file in write mode.
            let file: any = fs.openSync(referenceDTO.SourcePath, 'r+');
            fs.writeSync(file, new Buffer(xmlData));
            fs.close(file);
            MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.DllRefSuccess, []);
        }
    }

    /**
    * Circular dependency checking.
    */
    public static CircularDependencyCheck(referenceDTO): any {
        if (referenceDTO.SourcePath == referenceDTO.DestinationPath ||
            fs.readFileSync(referenceDTO.DestinationPath).
                includes(referenceDTO.SourcePath.substring(referenceDTO.SourcePath.lastIndexOf('\\') + 1))) {
            return true;
        }
        return false;
    }
}
