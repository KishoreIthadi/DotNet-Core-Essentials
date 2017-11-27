'use strict';

import { FrameworkTypeEnum } from './Enums/FrameworkTypeEnum';

export class DataSource {

    public static _frameworksList: string[] = ['DotNet Core', 'DotNet Standard'];
    public static _coreVersionList: Map<string, string> = new Map([['Version 2.x', 'netcoreapp2.0']]);
    public static _standardVersionList: Map<string, string> = new Map([['V2.0', 'netstandard2.0']]);
    public static _appTypeList: Map<string, string> = new Map([
        ['Console application', 'console'],
        ['Class Library', 'classlib'],
        ['ASP.NET Core Web App (Model-View-Controller)', 'mvc'],
        ['ASP.NET Core Web API', 'webapi']
    ]);
    public static _referenceTypeList: string[] = ['Add Project Reference', 'Add Assembly Refernce (.dll Reference)'];
    public static _validationList: string[] = ['con', 'aux', 'prn', 'com1', 'new', 'lpt2', '', ' ', null];
    public static _filterCsproj: { [name: string]: string[] } = { 'Project files(*.csproj)': ['csproj'] };
    public static _filterDLL: { [name: string]: string[] } = { 'Project files(*.dll,*.exe)': ['dll', 'exe'] };


    /**
    * Returns the Frameworks List
    */
    static GetFrameworks(): string[] {
        return DataSource._frameworksList;
    }

    /**
    * Returns the Versions List
    */
    static GetVersions(selected: string) {

        if (selected == FrameworkTypeEnum.NetCore) {
            return DataSource._coreVersionList;
        }
        else if (selected == FrameworkTypeEnum.NetStandard) {
            return DataSource._standardVersionList;
        }
    }

    /**
    * Returns the Application types list
    */
    static GetApplicationTypes() {
        return DataSource._appTypeList;
    }

    /**
    * Returns the JsonObjects for add assembly reference
    */
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
}