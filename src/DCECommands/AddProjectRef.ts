import { AddReferenceDTO } from '../DTO/AddReferenceDTO';
import { MessageUtility } from '../Utilities/MessageUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { FileUtility } from '../Utilities/FileUtility';
import { QuickPickUtility } from '../Utilities/QuickPickUtility';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { UserOptionsEnum } from '../Enums/UserOptionsEnum';
import { AddRefCmd } from './AddRefCmd';
import { DataSource } from '../DataSource';
import { FileTypeEnum } from '../Enums/FileTypeEnum';

export class AddProjectRef {
    public ExecuteAddRef(args) {
        let referenceDTO: AddReferenceDTO = new AddReferenceDTO();
        if (typeof args == StringUtility.Undefined) {
            let obj: AddRefCmd = new AddRefCmd();
            referenceDTO.ReferenceType = DataSource.GetReferenceTypes()[0];
            obj.ExecuteAddRefCmd(referenceDTO);
        }
        else {
            let projName = args.fsPath.substring(args.fsPath.lastIndexOf(StringUtility.PathSeperator) + 1);
            referenceDTO.Path = args.fsPath.substring(0, args.fsPath.lastIndexOf(StringUtility.PathSeperator));
            referenceDTO.SourcePath = args.fsPath;
            referenceDTO.Path = referenceDTO.Path.substring(0, referenceDTO.Path.lastIndexOf(StringUtility.PathSeperator));
            let SolutionsList = FileUtility.GetFilesbyExtension(referenceDTO.Path, FileTypeEnum.SLN, new Map<string, string>());
            if (SolutionsList.size > 0) {
                QuickPickUtility.ShowQuickPick(Array.from(SolutionsList.keys()), StringUtility.SelectSolution)
                    .then(slnName => {
                        if (typeof slnName != StringUtility.Undefined) {
                            referenceDTO.Path = SolutionsList.get(slnName);
                            referenceDTO.SlnName = slnName;
                            referenceDTO.FileType = FileTypeEnum.Csproj;
                            AddRefCmd.BrowseProject(referenceDTO, projName);
                        }
                    });
            }
            else {
                MessageUtility.ShowMessage(MessageTypeEnum.Error, StringUtility.SolutionDoesntExists, []);
            }
        }
    }
}