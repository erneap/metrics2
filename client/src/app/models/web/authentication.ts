import { IUser } from "../interfaces";

export interface AuthenticationRequest {
    emailAddress: string;
    password: string;
}

export interface AuthenticationResponse {
    user?: IUser;
    token?: string;
    exception?: string;
}

export interface UpdateRequest {
    id: string;
    field: string;
    value: string; 
}