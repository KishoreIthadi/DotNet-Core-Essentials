import * as vscode from 'vscode';

export class StringUtility {

    public static WorkspaceEmpty: string = 'Workspace is empty. Open the folder.';
    public static SelectWorkspaceFolder: string = 'Select the folder to which you want to target on';
    public static NotProject: string = 'The csproj selected is not a core or standard project';
    public static CliNotFound: string = 'Please ensure that dotnet core 2.x SDK is installed and added to environment variable path';
    public static CliVersionError: string = 'Need Cli version 2.x or higher';
    public static SelectFW: string = 'Select .Net Framework';
    public static InvalidProjectName: string = 'Invalid project name. Press close to type again';
    public static InvalidSolutionName: string = 'Invalid solution name. Press close to type again';
    public static FolderExists: string = `A folder with same name already exists at {0}.`;
    public static SolutionExists: string = `A solution with same name already exists at {0}`;
    public static Undefined: string = 'undefined';
    public static SelectVersion: string = 'Select a version';
    public static SelectAppType: string = 'Select appliction type';
    public static EnterAppName: string = 'Enter project name';
    public static EnterSolutionName: string = 'Enter solution name';
    public static SelectSolution: string = "Select the solution file(.sln)";
    public static SelectSourceCsproj: string = `Select the source project`;
    public static SelectDestinationCsproj: string = `Select the destination project`;
    public static SolutionDoesntExists: string = "Solution file doesn't exist in current workspace.";
    public static AddProjRefCopyWarning: string = 'This will copy the selecting project to current solution path';
    public static DllRefSuccess: string = 'dll reference added successfully';
    public static AddDllExistsError: string = 'Cannot add dll of same project';
    public static SameDllReference: string = 'dll with same name already referred';
    public static UnspecifiedFilePath: string = 'Path not specified';
    public static CircularDepError: string = 'Circular dependency occured';
    public static SelectRefType: string = 'Select the reference type';
    public static CreateSln: string = "Create new solution file";
    public static SelectPublishPath: string = "Click 'Browse' to select path for publish output";
    public static SelectPublishProject: string = "Select publish project";
    public static ProjectNotFound: string = 'No project found';
    public static Error: string = 'Something went wrong';
    public static PublishExists: string = "A folder with 'PublishOutput' already exists";
    public static FormatString(value, args) {
        args = typeof args === 'object' ? args : Array.prototype.slice.call(arguments, 1);

        return value.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
            if (m == "{{") { return "{"; }
            if (m == "}}") { return "}"; }
            return args[n];
        });
    }

    public static FormatXML(input: any, indent: any) {

        indent = indent || '\t';
        // PART 1: Add \n where necessary.
        // Trim it (just in case) {method trim() not working in IE8}.
        let xmlString: any = input.replace(/^\s+|\s+$/g, '');

        xmlString = input
            // Add \n after tag if not followed by the closing tag of pair or text node.
            .replace(/(<([a-zA-Z]+\b)[^>]*>)(?!<\/\2>|[\w\s])/g, "$1\n")
            // Add \n after closing tag.
            .replace(/(<\/[a-zA-Z]+[^>]*>)/g, "$1\n")
            // Add \n between sets of angled brackets and text node between them.
            .replace(/>\s+(.+?)\s+<(?!\/)/g, ">\n$1\n<")
            // Add \n between angled brackets and text node between them.
            .replace(/>(.+?)<([a-zA-Z])/g, ">\n$1\n<$2")
            // Detect a header of XML.
            .replace(/\?></, "?>\n<");

        // Split it into an array (for analise each line separately).
        let xmlArr: any = xmlString.split('\n');

        // PART 2: indent each line appropriately.
        // Store the current indentation.
        let tabs: string = '';
        let start: number = 0;

        // If the first line is a header, ignore it.
        if (/^<[?]xml/.test(xmlArr[0])) start++;

        for (let i: number = start; i < xmlArr.length; i++) {
            // Trim it (just in case).
            let line: any = xmlArr[i].replace(/^\s+|\s+$/g, '');

            if (/^<[/]/.test(line))  // If the line is a closing tag.
            {
                // Remove one indent from the store.
                tabs = tabs.replace(indent, '');
                // Add the tabs at the beginning of the line.
                xmlArr[i] = tabs + line;
            }
            else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) {
                // If the line contains an entire node.
                // Leave the store as is.
                // Add the tabs at the beginning of the line.
                xmlArr[i] = tabs + line;
            }
            else if (/<.*>/.test(line)) {
                // If the line starts with an opening tag and does not contain an entire node.
                // Add the tabs at the beginning of the line.
                xmlArr[i] = tabs + line;
                // Add one indent to the store.
                tabs += indent;
            }
            else {
                // If the line contain a text node.
                // Add the tabs at the beginning of the line.
                xmlArr[i] = tabs + line;
            }
        }

        // PART 3: Return formatted string (source).
        // Rejoin the array to a string and return it.
        return xmlArr.join('\n');
    }
}