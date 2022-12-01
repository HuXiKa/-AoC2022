import * as fs from 'fs';

export function readFile(file: string, delim: string = '\r\n') {
    return fs.readFileSync(file)
        .toString('utf8')
        .split(delim);
}