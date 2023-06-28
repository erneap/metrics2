export interface IDcgs {
    id: string;
    sortID: number;
}

export class Dcgs implements IDcgs{
    public id: string;
    public sortID: number;

    constructor(dcgs?: IDcgs) {
        this.id = (dcgs) ? dcgs.id : '';
        this.sortID = (dcgs) ? dcgs.sortID : 0;
    }
}