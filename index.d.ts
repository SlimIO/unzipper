/// <reference types="@types/yauzl" />

declare namespace Unzipper {
    export interface unzipOptions {
        dir: string;
        log: boolean;
        logFile: boolean;
    }
    export function unzip(filePath: string, options?: unzipOptions): void;
}

export as namespace Unzipper;
export = Unzipper;