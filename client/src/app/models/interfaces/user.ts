import { PermissionGroup } from "../systems";

export interface IUser {
    id?: string;
    emailAddress: string;
    password: string;
    salt: string;
    passwordExpires: Date;
    badAttempts: number;
    firstName: string;
    middleName: string;
    lastName: string;
    workgroups: string[];
    _id?: string;
}

export class User implements IUser {
    public id?: string;
    public emailAddress: string;
    public password: string;
    public salt: string;
    public passwordExpires: Date;
    public badAttempts: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public workgroups: string[];

    constructor(user?: IUser) {
        this.id = (user && user.id) 
            ? user.id : '';
        this.emailAddress = (user && user.emailAddress) ? user.emailAddress : '';
        this.password = (user && user.password) ? user.password : '';
        this.salt = (user && user.salt) ? user.salt : '';
        this.passwordExpires = (user && user.passwordExpires) 
            ? new Date(user.passwordExpires) 
            : new Date(0);
        this.badAttempts = (user && user.badAttempts) ? user.badAttempts : 0;
        this.firstName = (user && user.firstName) ? user.firstName : '';
        this.middleName = (user && user.middleName) ? user.middleName : '';
        this.lastName = (user && user.lastName) ? user.lastName : '';
        this.workgroups = [];
        if (user && user.workgroups) {
            for (let i=0; i < user.workgroups.length; i++) {
                this.workgroups.push(user.workgroups[i])
            }
        }
    }

    getFullName(): string {
        if (this.middleName === '') {
            return `${this.firstName} ${this.lastName}`;
        }
        return `${this.firstName} ${this.middleName.substring(0,1)}. ${this.lastName}`;
    }

    getLastFirst(): string {
        if (this.middleName === '') {
            return `${this.lastName}, ${this.firstName}`
        }
        return `${this.lastName}, ${this.firstName} ${this.middleName.substring(0,1)}.`;
    }
    
    getUserStatus(): string {
        const now = new Date();
        let answer = 'primary';
        if (this.passwordExpires.getTime() < now.getTime()) {
          answer = "warn";
        } else if (this.badAttempts > 2) {
          answer = "accent";
        }
        return answer;
      }

    isInGroup(prog: string, group: PermissionGroup | string) {
        let found = false;
        const tstGroup = `${prog}-${group}`
        for (let i = 0; i < this.workgroups.length && !found; i++) {
            if (this.workgroups[i].toLowerCase() === tstGroup.toLowerCase()) {
                found = true;
            }
        }
        return found;
    }

    compareTo(other: IUser): number {
        if (this.lastName.toLowerCase() === other.lastName.toLowerCase()) {
            if (this.firstName.toLowerCase() === other.firstName.toLowerCase()) {
                return (this.middleName < other.middleName) ? -1 : 1;
            }
            return (this.firstName < other.firstName) ? -1 : 1;
        }
        return (this.lastName < other.lastName) ? -1 : 1;
    }
}