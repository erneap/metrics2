export interface ICommunication {
    id: string;
    explanation: string;
    exploitations?: string[];
    sortID: number;
}

export class Communication implements ICommunication {
    public id: string;
    public explanation: string;
    public exploitations: string[];
    public sortID: number;

    constructor(comm?: ICommunication) {
        console.log(comm);
        this.id = (comm) ? comm.id : '';
        this.explanation = (comm) ? comm.explanation : '';
        this.exploitations = [];
        if (comm && comm.exploitations) {
            comm.exploitations.forEach(exp => {
                this.exploitations.push(exp);
            })
        }
        this.sortID = (comm) ? comm.sortID : 0;
    }

    hasExploitation(exp: string): boolean {
        let answer = false;
        if (this.exploitations) {
            this.exploitations.forEach(exploit => {
                if (exploit && exploit.toLowerCase() === exp.toLowerCase()) {
                    answer = true;
                }
            });
        }
        return answer;
    }
}