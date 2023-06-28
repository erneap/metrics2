export interface ICommunication {
    id: string;
    explanation: string;
    sortID: number;
}

export class Communication implements ICommunication {
    public id: string;
    public explanation: string;
    public sortID: number;

    constructor(comm?: ICommunication) {
        this.id = (comm) ? comm.id : '';
        this.explanation = (comm) ? comm.explanation : '';
        this.sortID = (comm) ? comm.sortID : 0;
    }
}