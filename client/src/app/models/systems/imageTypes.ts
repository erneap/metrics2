export interface IImageSubtype {
    id: string;
    collected?: number;
    notcollected?: number;
    sortID: number;
}

export class ImageSubType implements IImageSubtype {
    public id: string;
    public collected?: number;
    public notcollected?: number;
    public sortID: number;

    constructor(st?: IImageSubtype) {
        this.id = (st) ? st.id : '';
        this.collected = (st && st.collected) ? st.collected : 0;
        this.notcollected = (st && st.notcollected) ? st.notcollected : 0;
        this.sortID = (st) ? st.sortID : 0;
    }
}

export interface IImageType {
    id: string;
    collected?: number;
    notcollected?: number;
    sortID: number;
    subtypes?: IImageSubtype[];
}

export class ImageType implements IImageType {
    public id: string;
    public collected?: number;
    public notcollected?: number;
    public sortID: number;
    public subtypes?: ImageSubType[];

    constructor(itype?: IImageType) {
        this.id = (itype) ? itype.id : '';
        this.collected = (itype && itype.collected) ? itype.collected : 0;
        this.notcollected = (itype && itype.notcollected) ? itype.notcollected : 0;
        this.sortID = (itype) ? itype.sortID : 0;
        if (itype && itype.subtypes && itype.subtypes.length > 0) {
            this.subtypes = [];
            for (let i=0; i < itype.subtypes.length; i++) {
                let st = itype.subtypes[i];
                this.subtypes.push(new ImageSubType(st));
            }
        }
    }
}