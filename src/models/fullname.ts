/**
 * Full name builder
 *
 * Created on July 04, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Firstname, Lastname, Prefix, Suffix, Namon } from './index';
import { LastnameFormat } from './misc';
import { Validators } from '../validators'

/**
 * Interface for JSON signature that represents the full name
 * @interface
 */
export interface Fullname {
    firstname: Firstname;
    lastname: Lastname;
    middlename?: Name[];
    prefix?: Prefix;
    suffix?: Suffix;
}

/**
 * Uses method chaining to build `Fullname`
 */
export class FullnameBuilder {
    private _px: Prefix = null;
    private _fn: Firstname = null;
    private _mn: Name[] = [];
    private _ln: Lastname = null;
    private _sx: Suffix = null;

    constructor(private bypass: boolean = false) {}

    /**
     * Builds with prefix
     * @param namon prefix name part
     */
    prefix(namon: string): this {
        if (!this.bypass) Validators.prefix.validate(namon);
        this._px = namon as Prefix;
        return this;
    }

    /**
     * Builds with firstname
     * @param namon a piece of string that will be defined as a namon
     * @param more additional pieces considered as a given name
     */
    firstname(namon: string, ...more: string[]): this {
        this._fn = new Firstname(namon, ...more);
        if (!this.bypass) Validators.firstname.validate(this._fn.tostring());
        return this;
    }

    /**
     * Builds with middlename
     * @param nama middle names
     */
    middlename(...nama: string[]): this {
        if (!this.bypass) Validators.middlename.validate(nama);
        this._mn = nama.map(namon => new Name(namon, Namon.MIDDLE_NAME));
        return this;
    }

    /**
     * Builds with lastname
     * @param father a piece of string that will be defined as a namon
     * @param mother additional pieces considered as a last name
     * @param format how to output a surname considering its subparts
     */
    lastname(father: string, mother?: string, format: LastnameFormat = 'father'): this {
        this._ln = new Lastname(father, mother, format);
        if (!this.bypass) Validators.lastname.validate(this._ln.tostring());
        return this;
    }

    /**
     * Builds with suffix
     * @param namon suffix name part
     */
    suffix(namon: string): this {
        if (!this.bypass) Validators.suffix.validate(namon);
        this._sx = namon as Suffix;
        return this;
    }

    /**
     * Builds a `Fulllname`
     */
    build(): Fullname {
        return {
            firstname: this._fn,
            lastname: this._ln,
            middlename: this._mn,
            prefix: this._px,
            suffix: this._sx
        };
    }
}

/**
 * Aliases for `FullnameBuilder`
 */
export interface FullnameBuilder {
    px: typeof FullnameBuilder.prototype.prefix;
    fn: typeof FullnameBuilder.prototype.firstname;
    mn: typeof FullnameBuilder.prototype.middlename;
    ln: typeof FullnameBuilder.prototype.lastname;
    sx: typeof FullnameBuilder.prototype.suffix;
}

FullnameBuilder.prototype.px = FullnameBuilder.prototype.prefix;
FullnameBuilder.prototype.fn = FullnameBuilder.prototype.firstname;
FullnameBuilder.prototype.mn = FullnameBuilder.prototype.middlename;
FullnameBuilder.prototype.ln = FullnameBuilder.prototype.lastname;
FullnameBuilder.prototype.sx = FullnameBuilder.prototype.sx;
