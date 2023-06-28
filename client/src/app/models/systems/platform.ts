import { IImageType, ImageType } from "./imageTypes";

export interface ISensorStandardTimes {
    preflightMinutes: number;
    scheduledMinutes: number;
    postflightMinutes: number;
}

export class SensorStandardTimes implements ISensorStandardTimes {
    public preflightMinutes: number;
    public scheduledMinutes: number;
    public postflightMinutes: number;

    constructor(sst?: ISensorStandardTimes) {
        this.preflightMinutes = (sst) ? sst.preflightMinutes : 0;
        this.scheduledMinutes = (sst) ? sst.scheduledMinutes : 0;
        this.postflightMinutes = (sst) ? sst.postflightMinutes : 0;
    }
}

export interface ISensorExploitation {
    exploitation: string;
    showOnGEOINT: boolean;
    showOnGSEG: boolean;
    showOnMIST: boolean;
    showOnXINT: boolean;
    standardTimes: SensorStandardTimes;
}

export class SensorExploitation implements ISensorExploitation {
    public exploitation: string;
    public showOnGEOINT: boolean;
    public showOnGSEG: boolean;
    public showOnMIST: boolean;
    public showOnXINT: boolean;
    public standardTimes: SensorStandardTimes;

    constructor(se?: ISensorExploitation) {
        this.exploitation = (se) ? se.exploitation : '';
        this.showOnGEOINT = (se) ? se.showOnGEOINT : false;
        this.showOnGSEG = (se) ? se.showOnGSEG : false;
        this.showOnMIST = (se) ? se.showOnMIST : false;
        this.showOnXINT = (se) ? se.showOnXINT : false;
        this.standardTimes = (se) 
            ? new SensorStandardTimes(se.standardTimes) 
            : new SensorStandardTimes();
    }
}

export enum GeneralSensorType {
    GEOINT = 1,
    XINT = 2,
    MIST = 3,
    ADMIN = 9,
    OTHER = 99
}

export enum ExploitationReportTypes {
    ALL = 0,
    GEOINT = 1,
    SYERS = 2,
    XINT = 3,
    MIST = 4
}

export enum PermissionGroup {
    GEOINT = "GEOINT",
    XINT = "XINT",
    MIST = "MIST",
    ADMIN = "ADMIN"
}

export interface IPlatformSensor {
    id: string;
    association: string;
    generalType: GeneralSensorType;
    showTailNumber: boolean;
    sortID: number;
    exploitations: ISensorExploitation[];
    imageTypes: IImageType[];
}

export class PlatformSensor implements IPlatformSensor {
    public id: string;
    public association: string;
    public generalType: GeneralSensorType;
    public showTailNumber: boolean;
    public sortID: number;
    public exploitations: SensorExploitation[];
    public imageTypes: ImageType[];

    constructor(ps?: IPlatformSensor) {
        this.id = (ps) ? ps.id : '';
        this.association = (ps) ? ps.association : '';
        this.generalType = (ps) ? ps.generalType : GeneralSensorType.GEOINT;
        this.showTailNumber = (ps) ? ps.showTailNumber : false;
        this.sortID = (ps) ? ps.sortID : 0;
        this.exploitations = [];
        if (ps && ps.exploitations && ps.exploitations.length > 0) {
            ps.exploitations.forEach(pse => {
                this.exploitations.push(new SensorExploitation(pse));
            });
        }
        this.imageTypes = [];        
        if (ps && ps.imageTypes && ps.imageTypes.length > 0) {
            ps.imageTypes.forEach(itype => {
                this.imageTypes.push(new ImageType(itype));
            });
        }
    }

    useForExploitation(exploit: string, rpt?: ExploitationReportTypes): boolean {
        if (!rpt) {
            rpt = ExploitationReportTypes.ALL;
        }
        if (rpt > ExploitationReportTypes.MIST) {
            rpt = ExploitationReportTypes.ALL;
        }
        let answer: boolean = false;
        this.exploitations.forEach(function (exp) {
            if (exp.exploitation.toLowerCase().indexOf(exploit.toLowerCase()) > -1
                && (rpt == ExploitationReportTypes.ALL
                    || (rpt === ExploitationReportTypes.XINT && exp.showOnXINT)
                    || (rpt === ExploitationReportTypes.GEOINT && exp.showOnGEOINT)
                    || (rpt === ExploitationReportTypes.SYERS && exp.showOnGSEG)
                    || (rpt === ExploitationReportTypes.MIST && exp.showOnMIST))) {
                answer = true;
            }
        });
        return answer;
    }
}

export interface IPlatform {
    id: string;
    sensors: IPlatformSensor[];
    sortID: number;
}

export class Platform implements IPlatform {
    public id: string;
    public sensors: PlatformSensor[];
    public sortID: number;

    constructor(platform?: IPlatform) {
        this.id = (platform) ? platform.id : '';
        this.sensors = [];
        if (platform && platform.sensors && platform.sensors.length > 0) {
            platform.sensors.forEach(sen => {
                this.sensors.push(new PlatformSensor(sen));
            });
        }
        this.sortID = (platform) ? platform.sortID : 0;
    }

    showOnSummary(exploit: string, rpt?: ExploitationReportTypes) {
        if (!rpt) {
            rpt = ExploitationReportTypes.ALL;
        }
        let answer = false;
        this.sensors.forEach(sen => {
            if (sen.useForExploitation(exploit, rpt)) {
                answer = true;
            }
        });
        return answer;
    }
}