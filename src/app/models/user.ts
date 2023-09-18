export class User {
    public id: number | undefined;
    public firstname: string;
    public lastname: string;
    public username: string;
    public email: string;
    public lastLoginDate: Date | null;
    public lastLoginDateDisplay: Date | null;
    public joinDate: Date | null;
    public profileImageUrl: string;
    public isActive: boolean;
    public notLocked: boolean;
    public role: string;
    public authorities: [];

    constructor() {
        this.id = undefined;
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.lastLoginDate = null;
        this.lastLoginDateDisplay = null;
        this.joinDate = null;
        this.profileImageUrl = '';
        this.isActive = true;
        this.notLocked = false;
        this.role = 'CLIENT';
        this.authorities = [];
    }
}