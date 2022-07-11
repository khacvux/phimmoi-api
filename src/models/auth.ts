import IResponse from "./response";
import { LibraryModel } from "./user";


interface IUserTypeReturn extends IResponse {
    email: string;
    name: string | undefined;
    avatarUrl: string | undefined;
    avatarFilename: string;
    contactNumber: string;
    _id: string;
    library: Array<LibraryModel>;
}

export interface RegisterType extends IResponse {
    email: string;
    password: string | undefined;
    name: string | undefined;
    contactNumber: string | undefined;
}

export interface LoginType extends IUserTypeReturn {
    token: string | null;
}