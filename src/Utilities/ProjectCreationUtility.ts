'use strict';

import * as fs from 'fs';

import { ChildProcessUtility } from './ChildProcessUtility';
import { MessageUtility } from './MessageUtility';
import { StringUtility } from './StringUtility';

import { CLITypeEnum } from '../Enums/CLITypeEnum';
import { FileTypeEnum } from '../Enums/FileTypeEnum';
import { FrameworkTypeEnum } from '../Enums/FrameworkTypeEnum';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { ProjectTypeEnum } from '../Enums/ProjectTypeEnum';

import { DataSource } from '../DataSource';
import { GenerateCmdDTO } from '../DTO/GenerateCmdDTO';

export class ProjectCreationUtility {

    public static GenerateApp(GenerateCmdObj: GenerateCmdDTO) {

        // Creates sln file if it doesn't exist.
        if (!GenerateCmdObj.IsSlnExists) {
            // Paths.
            GenerateCmdObj.SolutionPath = GenerateCmdObj.RootPath + StringUtility.PathSeperator + GenerateCmdObj.SlnName;
            GenerateCmdObj.ProjectPath = GenerateCmdObj.SolutionPath + StringUtility.PathSeperator + GenerateCmdObj.AppName;

            fs.mkdirSync(GenerateCmdObj.SolutionPath);

            // Creating sloution.
            ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
                ['new', 'sln', '--name', GenerateCmdObj.SlnName], GenerateCmdObj.SolutionPath);
            GenerateCmdObj.SlnName = GenerateCmdObj.SlnName + '.sln';
        }
        else {
            GenerateCmdObj.ProjectPath = GenerateCmdObj.SolutionPath + StringUtility.PathSeperator + GenerateCmdObj.AppName;
        }

        // Creating class library for dotnet core framework.
        if (GenerateCmdObj.FrameWork == FrameworkTypeEnum.NetCore && GenerateCmdObj.AppType == ProjectTypeEnum.Classlib) {
            ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
                ['new', GenerateCmdObj.AppType, '-lang',GenerateCmdObj.Language, '-o', GenerateCmdObj.AppName, '-f', GenerateCmdObj.Version],
                GenerateCmdObj.SolutionPath);
        }
        else {
            // Application creator.
            ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
                ['new', GenerateCmdObj.AppType, '-lang',GenerateCmdObj.Language, '-o', GenerateCmdObj.AppName], GenerateCmdObj.SolutionPath);
        }

        let filepath: string = GenerateCmdObj.ProjectPath + '/' + GenerateCmdObj.AppName +
         DataSource.GetFileTypeByProject(GenerateCmdObj.Language);

        // Adding csproj to solution.
        ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
            ['sln', GenerateCmdObj.SlnName, 'add', filepath], GenerateCmdObj.SolutionPath);

        if (DataSource.GetNPMReqList().indexOf(GenerateCmdObj.AppType) > -1) {
            MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.RunNpm, []);
        }
        MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.FormatString(StringUtility.ProjectCreationSuccess, [GenerateCmdObj.AppName]), []);

        ChildProcessUtility.RunChildProcess(CLITypeEnum.dotnet,
            ['clean'], GenerateCmdObj.ProjectPath);
    }
}