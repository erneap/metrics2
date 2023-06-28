export interface IGroundOutage {
    id?: string;
    outageDate: Date;
    groundSystem: string;
    classification: string;
    outageNumber: number;
    outageMinutes: number;
    subSystem: string;
    referenceId: string;
    majorSystem: string;
    problem: string;
    fixAction: string;
    missionOutage: boolean;
    _id?: string;
}

export class GroundOutage {
    public id?: string;
    public outageDate: Date;
    public groundSystem: string;
    public classification: string;
    public outageNumber: number;
    public outageMinutes: number;
    public subSystem: string;
    public referenceId: string;
    public majorSystem: string;
    public problem: string;
    public fixAction: string;
    public missionOutage: boolean;

    constructor(outage?: IGroundOutage) {
        this.id = (outage && outage.id) 
            ? outage.id : '';
        this.outageDate = (outage && outage.outageDate) 
            ? new Date(outage.outageDate) : new Date(0);
        this.groundSystem = (outage && outage.groundSystem) 
            ? outage.groundSystem : '';
        this.classification = (outage && outage.classification)
            ? outage.classification : '';
        this.outageNumber = (outage && outage.outageNumber)
            ? outage.outageNumber : 0;
        this.outageMinutes = (outage && outage.outageMinutes) 
            ? outage.outageMinutes : 0;
        this.subSystem = (outage && outage.subSystem) ? outage.subSystem : '';
        this.referenceId = (outage && outage.referenceId) 
            ? outage.referenceId : '';
        this.majorSystem = (outage && outage.majorSystem)
            ? outage.majorSystem : '';
        this.problem = (outage && outage.problem) ? outage.problem : '';
        this.fixAction = (outage && outage.fixAction) ? outage.fixAction : '';
        this.missionOutage = (outage && outage.missionOutage) 
            ? outage.missionOutage : false;
    }
}

export const DefaultGroundOutage: IGroundOutage = {
    id: undefined,
    outageDate: new Date(),
    groundSystem: "",
    classification: "",
    outageNumber: 0,
    outageMinutes: 0,
    subSystem: '',
    referenceId: '',
    majorSystem: '',
    problem: '',
    fixAction: '',
    missionOutage: false,    
}