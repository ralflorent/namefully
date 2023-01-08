import { Config } from './config'
import { NameError, UnknownError } from './error'
import { FirstName, LastName, Name, JsonName } from './name'
import { Nullable, Namon, Title } from './types'
import { Validators } from './validator'

/**
 * The core component of this utility.
 *
 * This component is comprised of five entities that make it easy to handle a
 * full name set: prefix, first name, middle name, last name, and suffix.
 * This class is intended for internal processes. However, it is understandable
 * that it might be needed at some point for additional purposes. For this reason,
 * it's made available.
 *
 * It is recommended to avoid using this class unless it is highly necessary or
 * a custom parser is used for uncommon use cases. This utility tries to cover
 * as many use cases as possible.
 *
 * Additionally, an optional configuration can be used to indicate some specific
 * behaviors related to that name handling.
 */
export class FullName {
    private _prefix: Nullable<Name>
    private _firstName: FirstName
    private _middleName: Name[] = []
    private _lastName: LastName
    private _suffix: Nullable<Name>
    private _config: Config

    /**
     * Creates a full name as it goes
     * @param options optional configuration for additional features.
     */
    constructor(options?: Partial<Config>) {
        this._config = Config.merge(options)
    }

    /**
     * A snapshot of the configuration used to set up this full name.
     */
    get config(): Config {
        return this._config
    }

    /**
     * The prefix part of the full name.
     */
    get prefix(): Nullable<Name> {
        return this._prefix
    }

    /**
     * The first name part of the full name.
     */
    get firstName(): FirstName {
        return this._firstName
    }

    /**
     * The last name part of the full name.
     */
    get lastName(): LastName {
        return this._lastName
    }

    /**
     * The middle name part of the full name.
     */
    get middleName(): Name[] {
        return this._middleName
    }

    /**
     * The suffix part of the full name.
     */
    get suffix(): Nullable<Name> {
        return this._suffix
    }

    /**
     * Parses a json name into a full name.
     * @param json parsable name element
     * @param config optional configuration for additional features.
     */
    static parse(json: JsonName, config?: Config): FullName {
        try {
            const fullName = new FullName(config)
            fullName.setPrefix(json.prefix)
            fullName.setFirstName(json.firstName)
            fullName.setMiddleName(json.middleName)
            fullName.setLastName(json.lastName)
            fullName.setSuffix(json.suffix)
            return fullName
        } catch (error) {
            if (error instanceof NameError) {
                throw error
            } else {
                throw new UnknownError({
                    source: Object.values(json).join(' '),
                    message: 'could not parse JSON content',
                    error,
                })
            }
        }
    }

    setPrefix(name: Nullable<string | Name>): FullName {
        if (!name) return this
        if (!this._config.bypass) Validators.prefix.validate(name)
        const prefix = name instanceof Name ? name.value : name
        this._prefix = Name.prefix(this._config.title === Title.US ? `${prefix}.` : prefix)
        return this
    }

    setFirstName(name: string | FirstName): FullName {
        if (!this._config.bypass) Validators.firstName.validate(name)
        this._firstName = name instanceof FirstName ? name : new FirstName(name)
        return this
    }

    setLastName(name: string | LastName): FullName {
        if (!this._config.bypass) Validators.lastName.validate(name)
        this._lastName = name instanceof LastName ? name : new LastName(name)
        return this
    }

    setMiddleName(names: string[] | Name[]): FullName {
        if (!Array.isArray(names)) return this
        if (!this._config.bypass) Validators.middleName.validate(names)
        this._middleName = (names as Array<string | Name>).map((name) =>
            name instanceof Name ? name : Name.middle(name),
        )
        return this
    }

    setSuffix(name: Nullable<string | Name>): FullName {
        if (!name) return this
        if (!this._config.bypass) Validators.suffix.validate(name)
        this._suffix = Name.suffix(name instanceof Name ? name.value : name)
        return this
    }

    /**
     * Returns true if a namon has been set.
     */
    has(namon: Namon): boolean {
        if (namon.equal(Namon.PREFIX)) return !!this._prefix
        if (namon.equal(Namon.SUFFIX)) return !!this._suffix
        return namon.equal(Namon.MIDDLE_NAME) ? this._middleName.length > 0 : true
    }
}
