import * as CircularJSON from "circular-json";

export class Logger {
    public static log(message: string, logLabel?: any): void {
        console.log(CircularJSON.stringify({ severity: "INFO", message, labels: logLabel }));
    }

    public static notice(message: string, logLabel?: any): void {
        console.log(CircularJSON.stringify({ severity: "NOTICE", message, labels: logLabel }));
    }

    public static warn(message: string, logLabel?: any): void {
        console.warn(CircularJSON.stringify({ severity: "WARN", message, labels: logLabel }));
    }

    public static error(message: string, logLabel?: any): void {
        console.error(CircularJSON.stringify({ severity: "ERROR", message, labels: logLabel }));
    }
}
