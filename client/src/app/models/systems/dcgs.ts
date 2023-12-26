export interface IDcgs {
    id: string;
    exploitations?: string[];
    sortID: number;
}

export class Dcgs implements IDcgs{
    public id: string;
    public exploitations: string[];
    public sortID: number;

    constructor(dcgs?: IDcgs) {
        this.id = (dcgs) ? dcgs.id : '';
        this.exploitations = [];
        if (dcgs && dcgs.exploitations) {
            dcgs.exploitations.forEach(exp => {
                this.exploitations.push(exp);
            })
        }
        this.sortID = (dcgs) ? dcgs.sortID : 0;
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