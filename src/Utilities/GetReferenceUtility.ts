'use strict'

import * as XMLMapping from 'xml-mapping';
import * as fs from 'fs';

export class GetReferenceUtility {
    public static GetReferredList(csprojPath, rootPath, referenceType) {
        let jsonData: any = XMLMapping.load(fs.readFileSync(csprojPath).toString(), { comments: false });
        let referredProjectList: Map<string, string> = new Map<string, string>();
        let referred: string;
        try {
            if (jsonData.Project.ItemGroup instanceof Array) {

                for (let i = 0; i < jsonData.Project.ItemGroup.length; i++) {
                    if (jsonData.Project.ItemGroup[i][referenceType] instanceof Array) {
                        for (let j = 0; j < jsonData.Project.ItemGroup[i][referenceType].length; j++) {
                            referred = jsonData.Project.ItemGroup[i][referenceType][j]['Include'];
                            referredProjectList.set(referred.substring(referred.lastIndexOf('\\') + 1), referred);
                        }
                    }
                    else if (jsonData.Project.ItemGroup[i][referenceType] != null) {
                        referred = jsonData.Project.ItemGroup[i][referenceType]['Include'];
                        referredProjectList.set(referred.substring(referred.lastIndexOf('\\') + 1), referred);
                    }
                }
            }
            else
                if (jsonData.Project.ItemGroup[referenceType] instanceof Array) {
                    for (let j = 0; j < jsonData.Project.ItemGroup[referenceType].length; j++) {
                        referred = jsonData.Project.ItemGroup[referenceType][j]['Include'];
                        referredProjectList.set(referred.substring(referred.lastIndexOf('\\') + 1), referred);
                    }
                }
                else {
                    referred = jsonData.Project.ItemGroup[referenceType]['Include'];
                    referredProjectList.set(referred.substring(referred.lastIndexOf('\\') + 1), referred);
                }
        }
        catch{
            return referredProjectList;
        }
        return referredProjectList;
    }
}