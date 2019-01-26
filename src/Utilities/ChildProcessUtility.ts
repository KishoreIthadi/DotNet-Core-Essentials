'use strict'

import { spawnSync } from 'child_process';

export class ChildProcessUtility {

    static RunChildProcess(app: string, args: string[], path: string) {
        return spawnSync(app, args, { cwd: path });
    }
}