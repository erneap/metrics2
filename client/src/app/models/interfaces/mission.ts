import { IMissionData, MissionData } from "./missionSensor";

export interface IMission {
    id?: string;
    missionDate: Date;
    platformID: string;
    sortieID: number;
    encryptedMissionData?: string;
    missionData?: IMissionData;
    _id?: string;
}

export class Mission implements IMission{
    public id?: string;
    public missionDate: Date;
    public platformID: string;
    public sortieID: number;

    public encryptedMissionData?: string;
    public missionData?: MissionData;

    constructor(iMission?: IMission) {
        this.id = (iMission && iMission.id) 
            ? iMission.id : '';
        this.missionDate = (iMission && iMission.missionDate) 
            ? new Date(iMission.missionDate) : new Date(0);
        this.platformID = (iMission && iMission.platformID) 
            ? iMission.platformID : '';
        this.sortieID = (iMission && iMission.sortieID) 
            ? iMission.sortieID : 0;
        this.encryptedMissionData = undefined;
        this.missionData = undefined;
        if (iMission && iMission.encryptedMissionData) {
            this.encryptedMissionData = iMission.encryptedMissionData;
            this.missionData = undefined;
        } else if (iMission && iMission.missionData) {
            this.encryptedMissionData = undefined;
            this.missionData = new MissionData(iMission.missionData);
        }
    }
}