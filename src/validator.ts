import { MIN_NUMBER_OF_NAME_PARTS, MAX_NUMBER_OF_NAME_PARTS } from './constants'
import { InputError, ValidationError } from './error'
import { FirstName, LastName, Name } from './name'
import { Namon } from './types'
import { NameIndex } from './utils'

/**
 * Represents a set of validation rules (regex)
 *
 * This regex is intented to match specific alphabets only as a person name does
 * not contain special characters. `\w` does not cover non-Latin characters. So,
 * it is extended using unicode chars to cover more cases (e.g., Icelandic).
 * It matches as follows:
 *  [a-z]: Latin alphabet from a (index 97) to z (index 122)
 *  [A-Z]: Latin alphabet from A (index 65) to Z (index 90)
 *  [\u00C0-\u00D6]: Latin/German chars from À (index 192) to Ö (index 214)
 *  [\u00D8-\u00f6]: German/Icelandic chars from Ø (index 216) to ö (index 246)
 *  [\u00f8-\u00ff]: German/Icelandic chars from ø (index 248) to ÿ (index 255)
 *  [\u0400-\u04FF]: Cyrillic alphabet from Ѐ (index 1024) to ӿ (index 1279)
 *  [Ά-ωΑ-ώ]: Greek alphabet from Ά (index 902) to ω (index 969)
 */
class ValidationRule {
    static base: RegExp = /[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\u0400-\u04FFΆ-ωΑ-ώ]/

    /**
     * Matches one name part (namon) that is of nature:
     * - Latin (English, Spanish, French, etc.)
     * - European (Greek, Cyrillic, Icelandic, German)
     * - hyphenated
     * - with apostrophe
     * - with space
     */
    static namon: RegExp = new RegExp(
        `^${ValidationRule.base.source}+(([' -]${ValidationRule.base.source})?${ValidationRule.base.source}*)*$`,
    )

    /**
     * Matches one name part (namon) that is of nature:
     * - Latin (English, Spanish, French, etc.)
     * - European (Greek, Cyrillic, Icelandic, German)
     * - hyphenated
     * - with apostrophe
     */
    static firstName: RegExp = ValidationRule.namon

    /**
     * Matches 1+ names part (namon) that are of nature:
     * - Latin (English, Spanish, French, etc.)
     * - European (Greek, Cyrillic, Icelandic, German)
     * - hyphenated
     * - with apostrophe
     * - with space
     */
    static middleName: RegExp = new RegExp(
        `^${ValidationRule.base.source}+(([' -]${ValidationRule.base.source})?${ValidationRule.base.source}*)*$`,
    )

    /**
     * Matches one name part (namon) that is of nature:
     * - Latin (English, Spanish, French, etc.)
     * - European (Greek, Cyrillic, Icelandic, German)
     * - hyphenated
     * - with apostrophe
     * - with space
     */
    static lastName: RegExp = ValidationRule.namon
}

export interface Validator<T> {
    validate(value: T): void
}

class ArrayValidator<T extends string | Name> implements Validator<T[]> {
    validate(values: T[]): void {
        if (
            values.length === 0 ||
            values.length < MIN_NUMBER_OF_NAME_PARTS ||
            values.length > MAX_NUMBER_OF_NAME_PARTS
        ) {
            throw new InputError({
                source: values.map((n) => n.toString()),
                message: `expecting a list of ${MIN_NUMBER_OF_NAME_PARTS}-${MIN_NUMBER_OF_NAME_PARTS} elements`,
            })
        }
    }
}

class NamonValidator implements Validator<string | Name> {
    private static validator: NamonValidator
    private constructor() {}
    static create(): NamonValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: string | Name, type?: Namon): void {
        if (value instanceof Name) {
            NameValidator.create().validate(value, type)
        } else if (typeof value === 'string') {
            if (!ValidationRule.namon.test(value)) {
                throw new ValidationError({
                    source: value,
                    nameType: 'namon',
                    message: 'invalid content',
                })
            }
        } else {
            throw new InputError({
                source: typeof value,
                message: 'expecting types of string | Name',
            })
        }
    }
}

class FirstNameValidator implements Validator<string | FirstName> {
    private static validator: FirstNameValidator
    private constructor() {}
    static create(): FirstNameValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: string | FirstName): void {
        if (value instanceof FirstName) {
            value.asNames.forEach((name) => this.validate(name.value))
        } else if (typeof value === 'string') {
            if (!ValidationRule.firstName.test(value)) {
                throw new ValidationError({
                    source: value,
                    nameType: 'firstName',
                    message: 'invalid content',
                })
            }
        } else {
            throw new InputError({
                source: typeof value,
                message: 'expecting types string | FirstName',
            })
        }
    }
}

class MiddleNameValidator implements Validator<string | string[] | Name[]> {
    private static validator: MiddleNameValidator
    private constructor() {}
    static create(): MiddleNameValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: string | string[] | Name[]): void {
        if (typeof value === 'string') {
            if (!ValidationRule.middleName.test(value)) {
                throw new ValidationError({
                    source: value,
                    nameType: 'middleName',
                    message: 'invalid content',
                })
            }
        } else if (Array.isArray(value)) {
            try {
                const validator = NamonValidator.create()
                for (const name of value) validator.validate(name, Namon.MIDDLE_NAME)
            } catch (error) {
                throw new ValidationError({
                    source: value,
                    nameType: 'middleName',
                    message: error?.message,
                })
            }
        } else {
            throw new InputError({
                source: typeof value,
                message: 'expecting types of string | string[] | Name[]',
            })
        }
    }
}

class LastNameValidator implements Validator<string | LastName> {
    private static validator: LastNameValidator
    private constructor() {}
    static create(): LastNameValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: string | LastName): void {
        if (value instanceof LastName) {
            value.asNames.forEach((name) => this.validate(name.value))
        } else if (typeof value === 'string') {
            if (!ValidationRule.lastName.test(value)) {
                throw new ValidationError({
                    source: value,
                    nameType: 'lastName',
                    message: 'invalid content',
                })
            }
        } else {
            throw new InputError({
                source: typeof value,
                message: 'expecting types string | LastName',
            })
        }
    }
}

class NameValidator implements Validator<Name> {
    private static validator: NameValidator
    private constructor() {}
    static create(): NameValidator {
        return this.validator || (this.validator = new this())
    }

    validate(name: Name, type?: Namon): void {
        if (type && name.type !== type) {
            throw new ValidationError({
                source: [name],
                nameType: name.type.toString(),
                message: 'wrong type',
            })
        }

        if (!ValidationRule.namon.test(name.value)) {
            throw new ValidationError({
                source: [name],
                nameType: name.type.toString(),
                message: 'invalid content',
            })
        }
    }
}

export class NamaValidator implements Validator<Map<Namon, string>> {
    private static validator: NamaValidator
    private constructor() {}
    static create(): NamaValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: Map<Namon, string>): void {
        this.validateKeys(value)
        Validators.firstName.validate(value.get(Namon.FIRST_NAME))
        Validators.lastName.validate(value.get(Namon.LAST_NAME))

        if (value.has(Namon.PREFIX)) {
            Validators.namon.validate(value.get(Namon.PREFIX))
        }
        if (value.has(Namon.SUFFIX)) {
            Validators.namon.validate(value.get(Namon.SUFFIX))
        }
    }

    validateKeys(nama: Map<Namon, string>): void {
        if (!nama.size) {
            throw new InputError({ source: undefined, message: 'Map<k,v> must not be empty' })
        } else if (nama.size < MIN_NUMBER_OF_NAME_PARTS || nama.size > MAX_NUMBER_OF_NAME_PARTS) {
            throw new InputError({
                source: [...nama.values()],
                message: `expecting ${MIN_NUMBER_OF_NAME_PARTS}-${MIN_NUMBER_OF_NAME_PARTS} fields`,
            })
        }

        if (!nama.has(Namon.FIRST_NAME)) {
            throw new InputError({
                source: [...nama.values()],
                message: '"firstName" is a required key',
            })
        }

        if (!nama.has(Namon.LAST_NAME)) {
            throw new InputError({
                source: [...nama.values()],
                message: '"lastName" is a required key',
            })
        }
    }
}

export class ArrayStringValidator extends ArrayValidator<string> {
    constructor(readonly index = NameIndex.base()) {
        super()
    }

    validate(values: string[]): void {
        this.validateIndex(values)

        switch (values.length) {
            case 2:
                Validators.firstName.validate(values[this.index.firstName])
                Validators.lastName.validate(values[this.index.lastName])
                break
            case 3:
                Validators.firstName.validate(values[this.index.firstName])
                Validators.middleName.validate(values[this.index.middleName])
                Validators.lastName.validate(values[this.index.lastName])
                break
            case 4:
                Validators.namon.validate(values[this.index.prefix])
                Validators.firstName.validate(values[this.index.firstName])
                Validators.middleName.validate(values[this.index.middleName])
                Validators.lastName.validate(values[this.index.lastName])
                break
            case 5:
                Validators.namon.validate(values[this.index.prefix])
                Validators.firstName.validate(values[this.index.firstName])
                Validators.middleName.validate(values[this.index.middleName])
                Validators.lastName.validate(values[this.index.lastName])
                Validators.namon.validate(values[this.index.suffix])
                break
        }
    }

    validateIndex(values: string[]): void {
        super.validate(values)
    }
}

export class ArrayNameValidator implements Validator<Name[]> {
    private static validator: ArrayNameValidator
    private constructor() {}
    static create(): ArrayNameValidator {
        return this.validator || (this.validator = new this())
    }

    validate(value: Name[]): void {
        if (value.length < MIN_NUMBER_OF_NAME_PARTS) {
            throw new InputError({
                source: value,
                message: `expecting at least ${MIN_NUMBER_OF_NAME_PARTS} elements`,
            })
        }

        if (!this.hasBasicNames(value)) {
            throw new InputError({
                source: value,
                message: 'both first and last names are required',
            })
        }
    }

    private hasBasicNames(names: Name[]): boolean {
        const accumulator: { [key: string]: string } = {}
        for (const name of names) {
            if (name.isFirstName || name.isLastName) {
                accumulator[name.type.key] = name.toString()
            }
        }
        return Object.keys(accumulator).length === MIN_NUMBER_OF_NAME_PARTS
    }
}

/**
 * A list of validators for a specific namon.
 */
export abstract class Validators {
    static namon = NamonValidator.create()
    static nama = NamaValidator.create()
    static prefix = NamonValidator.create()
    static firstName = FirstNameValidator.create()
    static middleName = MiddleNameValidator.create()
    static lastName = LastNameValidator.create()
    static suffix = NamonValidator.create()
}
