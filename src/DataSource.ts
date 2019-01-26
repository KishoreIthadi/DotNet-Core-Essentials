'use strict';

import { FrameworkTypeEnum } from './Enums/FrameworkTypeEnum';
import { FileTypeEnum } from './Enums/FileTypeEnum';
import { ChildProcessUtility } from './Utilities/ChildProcessUtility';
import { CLITypeEnum } from './Enums/CLITypeEnum';

export class DataSource {

    private static _frameworksList: string[] = ['DotNet Core', 'DotNet Standard'];
    //private static _coreVersionList: Map<string, string> = new Map([['Version 2.x', 'netcoreapp2.0']]);
    //private static _standardVersionList: Map<string, string> = new Map([['Version 2.x', 'netstandard2.0']]);

    private static _appTypeListCSharp: Map<string, string> = new Map([
        ['Console application', 'console'],
        ['Class Library', 'classlib'],
        ['ASP.NET Core Web App (Model-View-Controller)', 'mvc'],
        ['ASP.NET Core Web API', 'webapi'],
        ['ASP.NET Core empty', 'web'],
        ['ASP.NET Core with Angular', 'angular'],
        ['ASP.NET Core Web App with Razor', 'razor'],
        ['ASP.NET Core with React.js', 'react'],
        ['ASP.NET Core with React.js and Redux', 'reactredux']
        // ['Unit Test Project', 'mstest'],
        // ['xUnit Test Project','xunit']
    ]);

    private static _appTypeListFSharp: Map<string, string> = new Map([
        ['Console application', 'console'],
        ['Class Library', 'classlib'],
        ['ASP.NET Core Web App (Model-View-Controller)', 'mvc'],
        ['ASP.NET Core Web API', 'webapi'],
        ['ASP.NET Core empty', 'web']
        // ['Unit Test Project', 'mstest'],
        // ['xUnit Test Project','xunit']
    ]);

    private static _appTypeListVB: Map<string, string> = new Map([
        ['Console application', 'console'],
        ['Class Library', 'classlib']
        // ['Unit Test Project', 'mstest'],
        // ['xUnit Test Project','xunit']
    ]);

    // private static _authenticationTypeWebList: Map<string, string> = new Map([
    //     ['None', ' -au None'],
    //     ['IndividualB2C', ' -au IndividualB2C'],
    //     ['SingleOrg', ' -au SingleOrg'],
    //     ['MultiOrg',' -au MultiOrg'],
    //     ['Individual',' -au Individual']
    // ]);
    // private static _authenticationTypeApiList: Map<string, string> = new Map([
    //     ['None', ' -au None'],
    //     ['IndividualB2C', ' -au IndividualB2C'],
    //     ['SingleOrg', ' -au SingleOrg'],
    //     ['MultiOrg',' -au MultiOrg'],

    // ]);

    private static _referenceTypeList: string[] = ['Add Project Reference', 'Add Assembly Reference (.dll Reference)'];
    private static _validationList: string[] = ['con', 'aux', 'prn', 'com1', 'new', 'lpt2', '', ' ', null, 'console', 'web'];

    // private static _filterCsproj: { [name: string]: string[] } = { 'Project files(*.csproj)': ['csproj'] };
    // private static _filterFsproj: { [name: string]: string[] } = { 'Project files(*.fsproj)': ['fsproj'] };
    // private static _filterVBproj: { [name: string]: string[] } = { 'Project files(*.vbproj)': ['vbproj'] };

    private static _filterProj: { [name: string]: string[] } = { 'Project files(*.csproj,*.fsproj,*.vbproj)': ['vbproj', 'fsproj', 'csproj'] };
    private static _filterDLL: { [name: string]: string[] } = { 'Project files(*.dll,*.exe)': ['dll', 'exe'] };
    private static _npmReqList: string[] = ['angular', 'react', 'reactredux'];
    private static _langList: string[] = ['C#', 'F#', 'VB'];

    //private static _optionAppType:string[] = ['mvc','webapi','razor']; 

    //Returns the Frameworks List
    static GetFrameworks(): string[] {
        return DataSource._frameworksList;
    }

    //Returns the languages List
    static GetLanguageList(): string[] {
        return DataSource._langList;
    }

    //Returns the Versions List
    static GetVersion(rootPath: string) {
        let version = FrameworkTypeEnum.NetCoreApp +
            ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet, ["--version"], rootPath)
                .stdout.toString();
        return version.substring(0, version.lastIndexOf('.'));

        // let version
        // if (selected == FrameworkTypeEnum.NetCore) {
        //     let version = ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet, ["--version"], rootPath)
        //         .stdout.toString();
        //     version.substring(0, version.lastIndexOf('.'));
        // }
        // return version;
        // else if (selected == FrameworkTypeEnum.NetStandard) {
        //     return DataSource._standardVersionList;
        // }
    }

    //Returns the Application types list
    static GetApplicationTypes(langType: string) {
        if (langType === "C#") {
            return DataSource._appTypeListCSharp;
        }
        else if (langType === "F#") {
            return DataSource._appTypeListFSharp;
        }
        else if (langType === "VB") {
            return DataSource._appTypeListVB;
        }
    }

    //Returns the JsonObjects for add assembly reference
    static GetJsonObject(projectName, DllPath, isItemGroup) {

        let jsonObj: any = {
            "Include": projectName,
            "HintPath": {
                "$t": DllPath
            }
        };

        if (isItemGroup) {
            return jsonObj;
        }
        else {
            return {
                "Reference": jsonObj
            };
        }
    }

    //Returns reference type list.
    static GetReferenceTypes(): string[] {
        return DataSource._referenceTypeList;
    }

    //Returns validation list.
    static GetValidationList(): string[] {
        return DataSource._validationList;
    }

    //Returns filters for file explorerutility.
    static GetCsprojFilter() {
        return DataSource._filterProj;
    }

    //Returns filters for file explorerutility.
    static GetDllFilter() {
        return DataSource._filterDLL;
    }

    //npm required list.
    static GetNPMReqList(): string[] {
        return DataSource._npmReqList;
    }

    static GetFileTypeByProject(ProjectType: string) {
        switch (ProjectType) {
            case "C#": return FileTypeEnum.Csproj;
            case "F#": return FileTypeEnum.Fsproj;
            case "VB": return FileTypeEnum.VBproj
        }
    }

    // static GetOptions(type:string){
    //     if(type==='webapi'){
    //         return this._authenticationTypeApiList;
    //     }
    //     else{
    //         return this._authenticationTypeWebList;
    //     }
    // }
    // static GetOptionAppType(): string[] {
    //     return this._optionAppType;
    // }
}