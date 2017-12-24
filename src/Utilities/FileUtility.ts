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

    // public static DeleteFolderRecursive = function (path) {
    //     if (fs.existsSync(path)) {
    //         fs.readdirSync(path).forEach(function (file, index) {
    //             var curPath = path + "/" + file;
    //             if (fs.lstatSync(curPath).isDirectory()) { // recurse
    //                 FileUtility.DeleteFolderRecursive(curPath);
    //             } else { // delete file
    //                 fs.unlinkSync(curPath);
    //             }
    //         });
    //         fs.rmdirSync(path);
    //     }
    // };
}