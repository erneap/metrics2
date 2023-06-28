export abstract class Sensor {
    constructor() {}

    convertMinutesToTimeString(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remaining = minutes - (hours * 60);
        if (remaining < 10) {
            return `${hours}:0${remaining}`;
        } else {
            return `${hours}:${remaining}`;
        }
    }

    convertTimeStringToMinutes(time: string): number {
        const parts = time.split(":");
        return (Number(parts[0]) * 60) + Number(parts[1]);
    }
}