/**
 * `Namefully`
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */


export class Namefully {
    fullname: string;
    firstname: string;
    lastname: string;

    constructor(private rawstring: string) {
        this.parse(rawstring);
    }

    initials(): string {
        return ''.concat(this.firstname[0], this.lastname[0]);
    }

    private parse(name: string): void {
        const splitnames = name.split(' ');
        this.lastname = this.capitalize(splitnames.pop());
        this.firstname = this.capitalize(splitnames[0]);

        this.fullname = `${this.lastname}, ${this.firstname}`;
    }

    private capitalize(name: string): string {
        return ''.concat(name[0].toUpperCase(), name.slice(1, name.length));
    }
}
