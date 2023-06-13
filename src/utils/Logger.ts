import * as flatted from "flatted";

export class Logger {
    public static log(message: string, logLabel?: any): void {
        console.log(flatted.stringify({ severity: "INFO", message, labels: logLabel }));
    }

    public static notice(message: string, logLabel?: any): void {
        console.log(flatted.stringify({ severity: "NOTICE", message, labels: logLabel }));
    }

    public static warn(message: string, logLabel?: any): void {
        console.warn(flatted.stringify({ severity: "WARN", message, labels: logLabel }));
    }

    public static error(message: string, logLabel?: any): void {
        console.error(flatted.stringify({ severity: "ERROR", message, labels: logLabel }));
    }
}
