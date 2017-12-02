import * as vscode from 'vscode';

export class StringUtility {

    public static WorkspaceEmpty: string = 'Workspace is empty. Open the folder.';
    public static SelectWorkspaceFolder: string = 'Select the folder to which you want to target on';
    public static NotProject: string = 'DTG: The csproj selected is not a core or standard project';
    public static CliNotFound: string = 'Please ensure that dotnet core 2.x SDK is installed and added to environment variable path';
    public static CliVersionError: string = 'DTG: Need Cli version 2.x or higher';
    public static SelectFW: string = 'Select .Net Framework';
    public static InvalidProjectName: string = 'DTG: Invalid project name. Press close to type again';
    public static InvalidSolutionName: string = 'DTG: Invalid solution name. Press close to type again';
    public static FolderExists: string = `DTG: A folder with same name already exists at {0}.`;
    public static SolutionExists: string = `DTG: A solution with same name already exists at {0}`;
    public static Undefined: string = 'undefined';
    public static SelectVersion: string = 'Select a version';
    public static SelectAppType: string = 'Select appliction type';
    public static EnterAppName: string = 'Enter project name';
    public static EnterSolutionName: string = 'Enter solution name';
    public static SelectSolution: string = "Select the solution file(.sln)";
    public static SelectSourceCsproj: string = `Select the source project`;
    public static SelectDestinationCsproj: string = `Select the destination project`;
    public static SolutionDoesntExists: string = "DTG: Solution file doesn't exist in current workspace.";
    public static DllRefSuccess: string = 'DTG: Dll reference added successfully';
    public static AddDllExistsError: string = 'DTG: Cannot add dll of same project';
    public static SameDllReference: string = 'DTG: Dll with same name already referred';
    public static UnspecifiedFilePath: string = 'DTG: Path not specified';
    public static CircularDepError: string = 'DTG: Circular dependency occured';
    public static SelectRefType: string = 'Select the reference type';
    public static CreateSln: string = "Create new solution file";
    public static SelectPublishPath: string = "DTG: Click 'Browse' to select path for publish output";
    public static SelectPublishProject: string = "Select publish project";
    public static ProjectNotFound: string = 'DTG: No project found';
    public static Error: string = 'DTG: Something went wrong';
    public static PublishExists: string = "DTG: A folder with 'PublishOutput' already exists";
    public static StartupError: string = 'DTG: Cannot add this project as a startup project';
    public static StartupProject: string = 'Select the startup Project';
    public static RelativeDllPath: string = '\\bin\\debug\\netcoreapp2.0\\';
    public static RelativeVscodePath: string = '\\.vscode';
    public static LaunchPath: string = '\\.vscode\\launch.json';
    public static TasksPath: string = '\\.vscode\\tasks.json';
    public static StartupProjectSet = 'DTG: Start up Project  set to {0}';
    public static Core: string = 'core';
    public static Standard: string = 'standard';
    public static SDK: string = 'Sdk';
    public static RunNpm: string = 'DTG: Run \'npm install\' in the project path to restore npm packages';
    public static DTG: string = 'DTG: ';
    public static PublishSuccess: string = 'DTG: Publised successfully at {0}';
    public static ProjectCreationSuccess: string = 'DTG: {0} created successfully';
    
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