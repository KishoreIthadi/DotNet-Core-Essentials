import { AddReferenceDTO } from '../DTO/AddReferenceDTO';
import { MessageUtility } from '../Utilities/MessageUtility';
import { StringUtility } from '../Utilities/StringUtility';
import { MessageTypeEnum } from '../Enums/MessageTypeEnum';
import { UserOptionsEnum } from '../Enums/UserOptionsEnum';
import { AddRefCmd } from './AddRefCmd';
import { DataSource } from '../DataSource';
import { FileTypeEnum } from '../Enums/FileTypeEnum';

export class AddDllRef {
    public ExecuteAddRef(args) {
        let referenceDTO: AddReferenceDTO = new AddReferenceDTO();
        if (typeof args == StringUtility.Undefined) {
            let obj: AddRefCmd = new AddRefCmd();
            referenceDTO.ReferenceType = DataSource.GetReferenceTypes()[1];
            obj.ExecuteAddRefCmd(referenceDTO);
        }

        else {
            referenceDTO.CSProjName = args.fsPath.substring(args.fsPath.lastIndexOf(StringUtility.PathSeperator) + 1);
            referenceDTO.Path = args.fsPath.substring(0, args.fsPath.lastIndexOf(StringUtility.PathSeperator));
            referenceDTO.SourcePath = args.fsPath;
            referenceDTO.Path = referenceDTO.Path.substring(0, referenceDTO.Path.lastIndexOf(StringUtility.PathSeperator));
            MessageUtility.ShowMessage(MessageTypeEnum.Info, StringUtility.FormatString(StringUtility.PressBrowse, FileTypeEnum.Dll), [UserOptionsEnum.Browse])
                .then(resp => {
                    if (resp == UserOptionsEnum.Browse) {
                        AddRefCmd.BrowseDllPath(referenceDTO);
                    }
                })
        }
    }
}