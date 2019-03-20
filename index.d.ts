/// <reference types="@types/yauzl" />

declare namespace Unzipper {
    export interface ConstructorOptions {
        dir: string;
        log: boolean;
        logFile: boolean;
    }
}
declare function Unzipper(filePath: string, options?: Unzipper.ConstructorOptions): void;

export as namespace Unzipper;
export = Unzipper;
