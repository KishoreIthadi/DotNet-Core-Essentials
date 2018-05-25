import * as vscode from 'vscode';


export class StringUtility {

    public static PathSeperator = /^win/.test(process.platform) ? '\\' : '/';
    // separator oppsite to pathseperator to deal with linux
    public static PathBackSlash = /^win/.test(process.platform) ? '/' : '\\';
    public static WorkspaceEmpty: string = 'Workspace is empty. Open a folder';
    public static SelectWorkspaceFolder: string = 'Select the target workspace folder';
    public static NotProject: string = 'DCE: The selected csproj is not a core or standard framework';
    public static CliNotFound: string = 'Please ensure that dotnet core 2.0.3 or higher SDK is installed and added to environment variable path';
    public static CliVersionError: string = 'DCE: Need Core SDK 2.0.3 or higher';
    public static SelectFW: string = 'Select .Net framework';
    public static InvalidProjectName: string = 'DCE: Invalid project name.';
    public static InvalidSolutionName: string = 'DCE: Invalid solution name.';
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
    public static RelativeDllPath: string = StringUtility.PathSeperator + 'bin' + StringUtility.PathSeperator + 'Debug' + StringUtility.PathSeperator + 'netcoreapp2.0' + StringUtility.PathSeperator;
    public static RelativeVscodePath: string = StringUtility.PathSeperator + '.vscode';
    public static LaunchPath: string = StringUtility.PathSeperator + '.vscode' + StringUtility.PathSeperator + 'launch.json';
    public static TasksPath: string = StringUtility.PathSeperator + '.vscode' + StringUtility.PathSeperator + 'tasks.json';
    public static StartupProjectSet = 'DCE: Start up project set to {0}';
    public static Core: string = 'core';
    public static Standard: string = 'standard';
    public static SDK: string = 'Sdk';
    public static RunNpm: string = 'DCE: Run \'npm install\' in the project path to restore npm packages';
    public static DCE: string = 'DCE: ';
    public static PublishSuccess: string = 'DCE: Publised successfully at {0}';
    public static ProjectCreationSuccess: string = 'DCE: {0} created successfully';
    public static BrowseDLLPath: string = "DCE: Click 'Browse' to select .dll file";
    public static StartUpProjError: string = "DCE: Cannot set starup project since multiple folders are added to workspace";
    public static SelectBuild: string = "DCE: Select csproj or sln to build";
    public static SelectClean: string = "DCE: Select csproj or sln to clean";
    public static EnterNugetPackageName: string = "DCE: Enter the Nuget Package name";
    public static SelectNugetPackage: string = "DCE:  Select csproj or sln for installing nuget package";
    public static InvalidPackageName: string = 'DCE: Invalid package name';
    public static PackageNotFound: string = 'DCE: No nuget package found';
    public static ProjectRefNotFound: string = 'DCE: No project reference found';
    public static SelectPackage: string = 'Select the package to remove';
    public static SelectProject: string = 'Select the project to remove';
    public static SelectCsproj: string = 'Select the Project';
    public static RemovePackageSuccess: string = 'DCE: Package reference `{0}` removed';
    public static PressBrowse: string = 'Press "Browse" to select destination {0} path';
    public static Project: string = 'Project';
    public static AssemblyRefNotFound: string = 'No Assembly reference found';
    public static SelectDll: string = 'Select dll to remove reference';
    public static RemoveDllSuccess: string = 'DCE: Dll reference `{0}` removed';



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