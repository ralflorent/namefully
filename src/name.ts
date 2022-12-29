import { InputError } from './error'
import { CapsRange, Namon, Surname } from './types'
import { capitalize, decapitalize } from './utils'

/**
 * Representation of a string type name with some extra capabilities.
 */
export class Name {
    private namon: string
    protected initial: string
    protected capsRange: CapsRange

    /**
     * Creates augmented names by adding extra functionality to a string name.
     * @param type must be indicated to categorize the name so it can be
     * treated accordingly.
     * @param capsRange determines how the name should be capitalized initially.
     */
    constructor(value: string, readonly type: Namon, capsRange?: CapsRange) {
        this.capsRange = capsRange ?? CapsRange.INITIAL
        this.value = value
        if (capsRange) this.caps(capsRange)
    }

    set value(newValue: string) {
        if (newValue.trim().length < 2) {
            throw new InputError({ source: newValue, message: 'must be 2+ characters' })
        }

        this.namon = newValue
        this.initial = newValue[0]
    }

    /**
     * The piece of string treated as a name.
     */
    get value(): string {
        return this.namon
    }

    /**
     * The length of the name.
     */
    get length(): number {
        return this.namon.length
    }

    /**
     * Whether the name is a prefix.
     */
    get isPrefix(): boolean {
        return this.type === Namon.PREFIX
    }

    /**
     * Whether the name is a first name.
     */
    get isFirstName(): boolean {
        return this.type === Namon.FIRST_NAME
    }

    /**
     * Whether the name is a middle name.
     */
    get isMiddleName(): boolean {
        return this.type === Namon.MIDDLE_NAME
    }

    /**
     * Whether the name is a last name.
     */
    get isLastName(): boolean {
        return this.type === Namon.LAST_NAME
    }

    /**
     * Whether the name is a suffix.
     */
    get isSuffix(): boolean {
        return this.type === Namon.SUFFIX
    }

    /**
     * Creates a prefix.
     */
    static prefix(value: string): Name {
        return new this(value, Namon.PREFIX)
    }

    /**
     * Creates a first name.
     */
    static first(value: string): Name {
        return new this(value, Namon.FIRST_NAME)
    }

    /**
     * Creates a middle name.
     */
    static middle(value: string): Name {
        return new this(value, Namon.MIDDLE_NAME)
    }

    /**
     * Creates a last name.
     */
    static last(value: string): Name {
        return new this(value, Namon.LAST_NAME)
    }

    /**
     * Creates a suffix.
     */
    static suffix(value: string): Name {
        return new this(value, Namon.SUFFIX)
    }

    /**
     * Gets the initials (first character) of this name.
     */
    initials(): string[] {
        return [this.initial]
    }

    /**
     * String representation of this object.
     */
    toString(): string {
        return this.namon
    }
    /**
     * Returns true if the other is equal to this name.
     */
    equal(other: Name | unknown): boolean {
        return other instanceof Name && other.value === this.value && other.type === this.type
    }

    /**
     * Capitalizes the name.
     */
    caps(range?: CapsRange): Name {
        this.value = capitalize(this.namon, range ?? this.capsRange)
        return this
    }

    /**
     * De-capitalizes the name.
     */
    decaps(range?: CapsRange): Name {
        this.value = decapitalize(this.namon, range ?? this.capsRange)
        return this
    }
}

/**
 * Representation of a first name with some extra functionality.
 */
export class FirstName extends Name {
    private _more: string[]

    /**
     * Creates an extended version of `Name` and flags it as a first name `type`.
     *
     * Some may consider `more` additional name parts of a given name as their
     * first names, but not as their middle names. Though, it may mean the same,
     * `more` provides the freedom to do it as it pleases.
     */
    constructor(value: string, ...more: string[]) {
        super(value, Namon.FIRST_NAME)

        for (const name of more) {
            if (name.trim().length < 2) {
                throw new InputError({ source: name, message: 'must be 2+ characters' })
            }
        }
        this._more = more
    }

    /**
     * Determines whether a first name has `more` name parts.
     */
    get hasMore(): boolean {
        return this._more.length > 0
    }

    get length(): number {
        return super.length + (this.hasMore ? this._more.reduce((acc, n) => acc + n).length : 0)
    }

    /**
     * Returns a combined version of the `value` and `more` if any.
     */
    get asNames(): Name[] {
        const names: Name[] = [Name.first(this.value)]
        if (this.hasMore) {
            names.push(...this._more.map((n) => Name.first(n)))
        }
        return names
    }

    /**
     * The additional name parts of the first name.
     */
    get more(): string[] {
        return this._more
    }

    toString(withMore = false): string {
        return withMore && this.hasMore ? `${this.value} ${this._more.join(' ')}`.trim() : this.value
    }

    initials(withMore = false): string[] {
        const inits: string[] = [this.initial]
        if (withMore && this.hasMore) {
            inits.push(...this._more.map((n) => n[0]))
        }
        return inits
    }

    caps(range?: CapsRange): FirstName {
        range = range || this.capsRange
        this.value = capitalize(this.value, range)
        if (this.hasMore) this._more = this._more.map((n) => capitalize(n, range))
        return this
    }

    decaps(range?: CapsRange): FirstName {
        range = range || this.capsRange
        this.value = decapitalize(this.value, range)
        if (this.hasMore) this._more = this._more.map((n) => decapitalize(n, range))
        return this
    }

    /**
     * Makes a copy of the current name.
     */
    copyWith(values?: { first?: string; more?: string[] }): FirstName {
        return new FirstName(values.first ?? this.value, ...(values.more ?? this._more))
    }
}

/**
 * Representation of a last name with some extra functionality.
 */
export class LastName extends Name {
    private _mother?: string

    /**
     * Creates an extended version of `Name` and flags it as a last name `type`.
     *
     * Some people may keep their `mother`'s surname and want to keep a clear cut
     * from their `father`'s surname. However, there are no clear rules about it.
     */
    constructor(father: string, mother?: string, readonly format = Surname.FATHER) {
        super(father, Namon.LAST_NAME)

        if (mother && mother.trim().length < 2) {
            throw new InputError({ source: mother, message: 'must be 2+ characters' })
        }
        this._mother = mother
    }

    /**
     * The surname inherited from a father side.
     */
    get father(): string {
        return this.value
    }

    /**
     * The surname inherited from a mother side.
     */
    get mother(): string | undefined {
        return this._mother
    }

    /**
     * Returns `true` if the mother's surname is defined.
     */
    get hasMother(): boolean {
        return !!this._mother
    }

    get length(): number {
        return super.length + (this._mother?.length ?? 0)
    }

    /**
     * Returns a combined version of the `father` and `mother` if any.
     */
    get asNames(): Name[] {
        const names: Name[] = [Name.last(this.value)]
        if (this.hasMother) {
            names.push(Name.last(this._mother))
        }
        return names
    }

    toString(format?: Surname): string {
        format = format ?? this.format
        switch (format) {
            case Surname.FATHER:
                return this.value
            case Surname.MOTHER:
                return this.mother ?? ''
            case Surname.HYPHENATED:
                return this.hasMother ? `${this.value}-${this._mother}` : this.value
            case Surname.ALL:
                return this.hasMother ? `${this.value} ${this._mother}` : this.value
        }
    }

    initials(format?: Surname): string[] {
        format = format || this.format
        const inits: string[] = []
        switch (format) {
            case Surname.MOTHER:
                if (this.hasMother) inits.push(this._mother[0])
                break
            case Surname.HYPHENATED:
            case Surname.ALL:
                inits.push(this.initial)
                if (this.hasMother) inits.push(this._mother[0])
                break
            case Surname.FATHER:
            default:
                inits.push(this.initial)
        }
        return inits
    }

    caps(range?: CapsRange): LastName {
        range = range || this.capsRange
        this.value = capitalize(this.value, range)
        if (this.hasMother) this._mother = capitalize(this._mother, range)
        return this
    }

    decaps(range?: CapsRange): LastName {
        range = range || this.capsRange
        this.value = decapitalize(this.value, range)
        if (this.hasMother) this._mother = decapitalize(this._mother, range)
        return this
    }

    /**
     * Makes a copy of the current name.
     */
    copyWith(values?: { father?: string; mother?: string; format?: Surname }): LastName {
        return new LastName(values.father ?? this.value, values.mother ?? this.mother, values.format ?? this.format)
    }
}

/**
 * JSON signature for `FullName` data.
 */
export interface JsonName {
    prefix?: string
    firstName: string
    middleName?: string[]
    lastName: string
    suffix?: string
}
