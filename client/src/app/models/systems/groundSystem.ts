export interface IGroundSystem {
    id: string;
    enclaves: string[];
    showOnGEOINT: boolean;
    showOnGSEG: boolean;
    showOnMIST: boolean;
    showOnXINT: boolean;
    exploitations: GroundSystemExploitation[];
}
export class GroundSystem implements IGroundSystem{
    public id: string;
    public enclaves: string[];
    public showOnGEOINT: boolean;
    public showOnGSEG: boolean;
    public showOnMIST: boolean;
    public showOnXINT: boolean;
    public exploitations: GroundSystemExploitation[];

    constructor(gs? :IGroundSystem) {
        this.id = (gs) ? gs.id : '';
        this.enclaves = (gs) ? gs.enclaves : [];
        this.showOnGEOINT = (gs) ? gs.showOnGEOINT : false;
        this.showOnGSEG = (gs) ? gs.showOnGSEG : false;
        this.showOnMIST = (gs) ? gs.showOnMIST : false;
        this.showOnXINT = (gs) ? gs.showOnXINT : false;
        this.exploitations = (gs) ? gs.exploitations : [];
    }

    useMissionSensor(platform: string, sensor: string, exploit: string, 
        comm: string): boolean {
        let answer: boolean = false;
        if (this.exploitations.length === 0) {
            answer = true;
        } else {
            this.exploitations.forEach(function (exp) {
                if (exp.platformID === platform && exp.sensorType === sensor
                    && exp.exploitation === exploit 
                    && exp.communicationID === comm) {
                    answer = true;
                }
            });
        }
        return answer;
    }
}

export interface IGroundSystemExploitation {
    platformID: string;
    sensorType: string;
    exploitation: string;
    communicationID: string;
}

export class GroundSystemExploitation implements IGroundSystemExploitation {
    public platformID: string;
    public sensorType: string;
    public exploitation: string;
    public communicationID : string;

    constructor(gse?: IGroundSystemExploitation) {
        this.platformID = (gse) ? gse.platformID : '';
        this.sensorType = (gse) ? gse.sensorType : '';
        this.exploitation = (gse) ? gse.exploitation : '';
        this.communicationID = (gse) ? gse.communicationID : '';
    }
}