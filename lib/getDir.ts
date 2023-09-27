import {join} from 'path';

export function getDir(dirName: string, fileName: string) {
    return join(
        __dirname,
        dirName,
        fileName,
    );
}