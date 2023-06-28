export interface IClassification {
    id: string;
    title: string;
    sortID: number;
}

export class Classification implements IClassification {
    public id: string;
    public title: string;
    public sortID: number;

    constructor(classification?: IClassification) {
        this.id = (classification) ? classification.id : '';
        this.title = (classification) ? classification.title : '';
        this.sortID = (classification) ? classification.sortID : 0;
    }
}