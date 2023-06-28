import {Classification, IClassification} from "./classifications";
import {Communication, ICommunication} from "./communications";
import { Dcgs, IDcgs } from "./dcgs";
import { Exploitation, IExploitation } from "./exploitation";
import { GroundSystem, IGroundSystem } from "./groundSystem";
import { Platform, IPlatform } from "./platform";

export interface ISystemInfo {
    classifications: IClassification[];
    communications: ICommunication[];
    dCGSs: IDcgs[];
    exploitations: IExploitation[];
    groundSystems: IGroundSystem[];
    platforms: IPlatform[];
}

export class SystemInfo implements ISystemInfo{
    public classifications: Classification[];
    public communications: Communication[];
    public dCGSs: Dcgs[];
    public exploitations: Exploitation[];
    public groundSystems: GroundSystem[];
    public platforms: Platform[];

    constructor(sysInfo?: ISystemInfo) {
        this.classifications = [];
        this.communications = [];
        this.dCGSs = [];
        this.exploitations = [];
        this.groundSystems = [];
        this.platforms = [];
        if (sysInfo) {
            if (sysInfo.classifications && sysInfo.classifications.length > 0) {
                sysInfo.classifications.forEach(c => {
                    this.classifications.push(new Classification(c));
                });
            }
            if (sysInfo.communications && sysInfo.communications.length > 0) {
                sysInfo.communications.forEach(c => {
                    this.communications.push(new Communication(c));
                });
            }
            if (sysInfo.dCGSs && sysInfo.dCGSs.length > 0) {
                sysInfo.dCGSs.forEach(d => {
                    this.dCGSs.push(new Dcgs(d));
                });
            }
            if (sysInfo.exploitations && sysInfo.exploitations.length > 0) {
                sysInfo.exploitations.forEach(ex => {
                    this.exploitations.push(new Exploitation(ex));
                });
            }
            if (sysInfo.groundSystems && sysInfo.groundSystems.length > 0) {
                sysInfo.groundSystems.forEach(gs => {
                    this.groundSystems.push(new GroundSystem(gs));
                });
            }
            if (sysInfo.platforms && sysInfo.platforms.length > 0) {
                sysInfo.platforms.forEach(pl => {
                    this.platforms.push(new Platform(pl));
                });
            }
        }
    }
}