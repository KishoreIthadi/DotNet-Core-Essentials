'use strict'
export class GenerateCmdDTO {
    public FrameWork: string;
    public AppName: string;
    public AppType: string;
    public Version: string;
    public SlnName: string;
    public SolutionPath: string;
    public ProjectPath: string;
    public IsSlnExists: boolean = false;
    public RootPath: string;
    public Language: string;
}