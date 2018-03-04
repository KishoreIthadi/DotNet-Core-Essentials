'use strict';

import { FrameworkTypeEnum } from './Enums/FrameworkTypeEnum';

export class DataSource {

    private static _frameworksList: string[] = ['DotNet Core', 'DotNet Standard'];
    private static _coreVersionList: Map<string, string> = new Map([['Version 2.x', 'netcoreapp2.0']]);
    private static _standardVersionList: Map<string, string> = new Map([['Version 2.0', 'netstandard2.0']]);
    private static _appTypeList: Map<string, string> = new Map([
        ['Console application', 'console'],
        ['Class Library', 'classlib'],
        ['ASP.NET Core Web App (Model-View-Controller)', 'mvc'],
        ['ASP.NET Core Web API', 'webapi'],
        ['ASP.NET Core empty', 'web'],
        ['ASP.NET Core with Angular', 'angular'],
        ['ASP.NET Core Web App with Razor', 'razor'],
        ['ASP.NET Core with React.js', 'react'],
        ['ASP.NET Core with React.js and Redux', 'reactredux'],
        ['Unit Test Project', 'mstest'],
        ['xUnit Test Project','xunit']
    ]);
    private static _referenceTypeList: string[] = ['Add Project Reference', 'Add Assembly Reference (.dll Reference)'];
    private static _validationList: string[] = ['con', 'aux', 'prn', 'com1', 'new', 'lpt2', '', ' ', null,'console','web'];
    private static _filterCsproj: { [name: string]: string[] } = { 'Project files(*.csproj)': ['csproj'] };
    private static _filterDLL: { [name: string]: string[] } = { 'Project files(*.dll,*.exe)': ['dll', 'exe'] };
    private static _npmReqList: string[] = ['angular', 'react', 'reactredux'];

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
    // Returns reference type list.
    static GetReferenceTypes(): string[] {
        return DataSource._referenceTypeList;
    }
    // Returns validation list.
    static GetValidationList(): string[] {
        return DataSource._validationList;
    }
    // Returns filters for file explorerutility.
    static GetCsprojFilter() {
        return DataSource._filterCsproj;
    }
    // Returns filters for file explorerutility.
    static GetDllFilter() {
        return DataSource._filterDLL;
    }
    // npm required list.
    static GetNPMReqList(): string[] {
        return DataSource._npmReqList;
    }
}