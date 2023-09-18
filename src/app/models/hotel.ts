import { User } from "./user";

export class Hotel {

    public id: number | undefined;
    public name: string;
    public description: string;
    public imageUrl: string;
    public isavailable: boolean;
    public isapproved: boolean;

    constructor() {
        this.id = undefined;
        this.name = '';
        this.description = '';
        this.imageUrl = '';
        this.isavailable = false;
        this.isapproved = false;
    }

}