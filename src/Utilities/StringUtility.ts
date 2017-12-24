import * as vscode from 'vscode';

export class StringUtility {

    public static WorkspaceEmpty: string = 'Workspace is empty. Open a folder';
    public static SelectWorkspaceFolder: string = 'Select the target workspace folder';
    public static NotProject: string = 'DCE: The selected csproj is not a core or standard framework';
    public static CliNotFound: string = 'Please ensure that dotnet core 2.0.3 or higher SDK is installed and added to environment variable path';
    public static CliVersionError: string = 'DCE: Need Core SDK 2.0.3 or higher';
    public static SelectFW: string = 'Select .Net framework';
    public static InvalidProjectName: string = 'DCE: Invalid project name. Select close to try again';
    public static InvalidSolutionName: string = 'DCE: Invalid solution name. Select close to try again';
    public static FolderExists: string = `DCE: A folder with same name already exists at {0}.`;
    public static SolutionExists: string = `DCE: A solution with same name already exists at {0}`;
    public static Undefined: string = 'undefined';
    public static SelectVersion: string = 'Select a version';
    public static SelectAppType: string = 'Select appliction type';
    public static EnterAppName: string = 'Enter project name';
    public static EnterSolutionName: string = 'Enter solution name';
    public static SelectSolution: string = "Select the solution file(.sln)";
    public static SelectSourceCsproj: string = `Select the source project`;
    public static SelectDestinationCsproj: string = `Select the destination project`;
    public static SolutionDoesntExists: string = "DCE: Current workspace folder doesn't have a .sln file";
    public static DllRefSuccess: string = 'DCE: Dll reference added successfully';
    public static AddDllExistsError: string = 'DCE: Cannot add dll of same project';
    public static SameDllReference: string = 'DCE: Dll with same name already referred';
    public static UnspecifiedFilePath: string = 'DCE: Path not specified';
    public static CircularDepError: string = 'DCE: Circular dependency occured';
    public static SelectRefType: string = 'Select the reference type';
    public static CreateSln: string = "Create new solution file";
    public static SelectPublishPath: string = "DCE: Click 'Browse' to select publishing path";
    public static SelectPublishProject: string = "Select a project to publish";
    public static ProjectNotFound: string = 'DCE: No project found';
    public static Error: string = 'DCE: Something went wrong';
    public static PublishExists: string = "DCE: A folder with 'PublishOutput' already exists";
    public static StartupError: string = 'DCE: Cannot add this project as a startup project';
    public static StartupProject: string = 'Select the startup project';
    public static RelativeDllPath: string = '\\bin\\debug\\netcoreapp2.0\\';
    public static RelativeVscodePath: string = '\\.vscode';
    public static LaunchPath: string = '\\.vscode\\launch.json';
    public static TasksPath: string = '\\.vscode\\tasks.json';
    public static StartupProjectSet = 'DCE: Start up project set to {0}';
    public static Core: string = 'core';
    public static Standard: string = 'standard';
    public static SDK: string = 'Sdk';
    public static RunNpm: string = 'DCE: Run \'npm install\' in the project path to restore npm packages';
    public static DCE: string = 'DCE: ';
    public static PublishSuccess: string = 'DCE: Publised successfully at {0}';
    public static ProjectCreationSuccess: string = 'DCE: {0} created successfully';
    public static BrowseDLLPath: string = "DCE: Click 'Browse' to select .dll file";
    public static StartUpProjError: string = "DCE:  Cannot set starup project since multiple folders are added to workspace";

    public static FormatString(value, args) {
        args = typeof args === 'object' ? args : Array.prototype.slice.call(arguments, 1);

        return value.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
            if (m == "{{") { return "{"; }
            if (m == "}}") { return "}"; }
            return args[n];
        });
    }

    public static LaunchASPNet = `{
        "version": "0.2.0",
        "configurations": [
            {
                "name": ".NET Core Launch (web)",
                "type": "coreclr",
                "request": "launch",
                "preLaunchTask": "build",
                "program": "\${{workspaceFolder}}{0}",
                "args": [],
                "cwd": "\${{workspaceFolder}}{1}",
                "stopAtEntry": false,
                "internalConsoleOptions": "openOnSessionStart",
                "launchBrowser": {
                    "enabled": true,
                    "args": "\${auto-detect-url}",
                    "windows": {
                        "command": "cmd.exe",
                        "args": "/C start \${auto-detect-url}"
                    },
                    "osx": {
                        "command": "open"
                    },
                    "linux": {
                        "command": "xdg-open"
                    }
                },
                "env": {
                    "ASPNETCORE_ENVIRONMENT": "Development"
                },
                "sourceFileMap": {
                    "/Views": "\${{workspaceFolder}}/Views"
                }
            },
            {
                "name": ".NET Core Attach",
                "type": "coreclr",
                "request": "attach",
                "processId": "\${command:pickProcess}"
            }
        ]
    }`;

    public static LaunchConsole = `{

        "version": "0.2.0",
        "configurations": [
             {
                 "name": ".NET Core Launch (console)",
                 "type": "coreclr",
                 "request": "launch",
                 "preLaunchTask": "build",
                 "program": "\${{workspaceFolder}}{0}",
                 "args": [],
                 "cwd": "\${{workspaceFolder}}{1}",
                 "console": "externalTerminal",
                 "stopAtEntry": false,
                 "internalConsoleOptions": "openOnSessionStart"
             },
             {
                 "name": ".NET Core Attach",
                 "type": "coreclr",
                 "request": "attach",
                 "processId": "\${command:pickProcess}"
             }
         ]
     }`;

    public static Tasks = `{
        "version": "2.0.0",
        "tasks": [
            {
                "taskName": "build",
                "command": "dotnet",
                "type": "process",
                "args": [
                    "build",
                    "\${{workspaceFolder}}{0}"
                ],
                "problemMatcher": "$msCompile"
            }
        ]
    }`;
}