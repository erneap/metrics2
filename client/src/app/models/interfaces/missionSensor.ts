import { GeneralSensorType } from '../systems';
import { ImageType } from '../systems/imageTypes';

export interface IMissionSensorOutage {
    totalOutageMinutes: number;
    partialLBOutageMinutes: number;
    partialHBOutageMinutes: number;
}

export class MissionSensorOutage implements IMissionSensorOutage {
    public totalOutageMinutes: number;
    public partialLBOutageMinutes: number;
    public partialHBOutageMinutes: number;

    constructor(outage?: MissionSensorOutage) {
        this.totalOutageMinutes = (outage && outage.totalOutageMinutes)
            ? outage.totalOutageMinutes : 0;
        this.partialHBOutageMinutes = (outage && outage.partialHBOutageMinutes)
            ? outage.partialHBOutageMinutes : 0;
        this.partialLBOutageMinutes = (outage && outage.partialLBOutageMinutes)
            ? outage.partialLBOutageMinutes : 0;
    }
}

export interface IMissionSensor {
    sensorID: string;
    sensorType?: GeneralSensorType;
    preflightMinutes: number;
    scheduledMinutes: number;
    executedMinutes: number;
    postflightMinutes: number;
    additionalMinutes: number;
    finalCode: number;
    kitNumber: string;
    sensorOutage: IMissionSensorOutage;
    groundOutage: number;
    hasHap: boolean;
    towerID?: number;
    sortID: number;
    comments: string;
    images: ImageType[];
}

export class MissionSensor implements IMissionSensor {
    public sensorID: string;
    public sensorType?: GeneralSensorType;
    public preflightMinutes: number;
    public scheduledMinutes: number;
    public executedMinutes: number;
    public postflightMinutes: number;
    public additionalMinutes: number;
    public finalCode: number;
    public kitNumber: string;
    public sensorOutage: MissionSensorOutage;
    public groundOutage: number;
    public hasHap: boolean;
    public towerID?: number;
    public sortID: number;
    public comments: string;
    public images: ImageType[];

    constructor(sensor?: IMissionSensor) {
        this.sensorID = (sensor && sensor.sensorID) ? sensor.sensorID : '';
        this.sensorType = (sensor && sensor.sensorType) 
            ? sensor.sensorType : GeneralSensorType.OTHER;
        this.preflightMinutes = (sensor && sensor.preflightMinutes)
            ? sensor.preflightMinutes : 0;
        this.scheduledMinutes = (sensor && sensor.scheduledMinutes)
            ? sensor.scheduledMinutes : 0;
        this.executedMinutes = (sensor && sensor.executedMinutes)
            ? sensor.executedMinutes : 0;
        this.postflightMinutes = (sensor && sensor.postflightMinutes)
            ? sensor.postflightMinutes : 0;
        this.additionalMinutes = (sensor && sensor.additionalMinutes)
            ? sensor.additionalMinutes : 0;
        this.finalCode = (sensor && sensor.finalCode) ? sensor.finalCode : 0;
        this.kitNumber = (sensor && sensor.kitNumber) ? sensor.kitNumber : '';
        this.sensorOutage = (sensor && sensor.sensorOutage)
            ? new MissionSensorOutage(sensor.sensorOutage) 
            : new MissionSensorOutage();
        this.groundOutage = (sensor && sensor.groundOutage) 
            ? sensor.groundOutage : 0;
        this.hasHap = (sensor) ? sensor.hasHap : false;
        this.towerID = (sensor) ? sensor.towerID : undefined;
        this.comments = (sensor && sensor.comments) ? sensor.comments : '';
        this.sortID = (sensor && sensor.sortID) ? sensor.sortID : 0;

        this.images = [];
        if (sensor && sensor.images && sensor.images.length > 0) {
            for (let i=0; i < sensor.images.length; i++) {
                const img = sensor.images[i];
                this.images.push(new ImageType(img));
            }
        }
    }
}

export interface IMissionData {
    exploitation: string;
    tailNumber: string;
    communications: string;
    primaryDCGS: string;
    cancelled: boolean;
    aborted: boolean;
    indefDelay: boolean;
    missionOverlap: number;
    comments: string;
    sensors: IMissionSensor[];
}

export class MissionData implements IMissionData {
    public exploitation: string;
    public tailNumber: string;
    public communications: string;
    public primaryDCGS: string;
    public cancelled: boolean;
    public aborted: boolean;
    public indefDelay: boolean;
    public missionOverlap: number;
    public comments: string;
    public sensors: MissionSensor[];

    constructor(mData?: IMissionData) {
        this.exploitation = (mData && mData.exploitation) 
            ? mData.exploitation : 'Primary';
        this.tailNumber = (mData && mData.tailNumber) ? mData.tailNumber : '';
        this.communications = (mData && mData.communications) 
            ? mData.communications : 'LOS';
        this.primaryDCGS = (mData && mData.primaryDCGS) ? mData.primaryDCGS : '';
        this.cancelled = (mData && mData.cancelled) ? true : false;
        this.aborted = (mData && mData.aborted) ? true : false;
        this.indefDelay = (mData && mData.indefDelay) ? true : false;
        this.missionOverlap = (mData && mData.missionOverlap) 
            ? mData.missionOverlap : 0;
        this.comments = (mData && mData.comments) ? mData.comments : '';
        this.sensors = [];
        if (mData && mData.sensors && mData.sensors.length > 0) {
            for (let i=0; i < mData.sensors.length; i++) {
                let sen = mData.sensors[i];
                this.sensors.push(new MissionSensor(sen));
            }
        }
    }
}