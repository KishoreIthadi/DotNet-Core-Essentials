import * as fs from 'fs';

export class FileUtility {

    // Returns files  if exists.
    public static GetFilesbyExtension(dir, fileExt, filelist: Map<string, string>): any {
        let reg: RegExp = new RegExp(fileExt + '$');
        let files: string[] = fs.readdirSync(dir);
        files.forEach(function (file) {
            if (fs.statSync(dir + '\\' + file).isDirectory()) {
                filelist = FileUtility.GetFilesbyExtension(dir + '\\' + file, fileExt, filelist);
            }
            else {
                if (reg.test(file)) {
                    filelist.set(file, dir);
                }
            }
        });

        return filelist;
    }
}