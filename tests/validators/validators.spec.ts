/**
 * Unit tests for the validators
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import {
    ValidatorType,
    ValidationRule,
    ValidationError,
    NamonValidator,
    PrefixValidator,
    SuffixValidator,
    FirstnameValidator,
    LastnameValidator,
    StringNameValidator,
    MiddlenameValidator,
    FullnameValidator,
    NamaValidator,
    ArrayStringValidator,
    ArrayNameValidator,
    NAME_INDEX,
    Name, Namon, Lastname,
} from '../../src/index';

describe('Validators', () => {

    describe('NamonValidator', () => {
        const validator = new NamonValidator()

        beforeAll(() => {
            jest.spyOn(ValidationRule.namon, 'test')
        })

        test('should be a namon validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.NAMON)
        })

        test('should regex a name-like content', () => {
            validator.validate('John')
            expect(ValidationRule.namon.test).toBeCalledWith('John')
            expect(ValidationRule.namon.test).toBeCalledTimes(1)
            expect(ValidationRule.namon.test).toReturnWith(true)
        })

        test('should validate a typical name', () => {
            validator.validate('Jane')
            expect(ValidationRule.namon.test).toReturnWith(true)
        })

        test('should validate a name with apostrophe', () => {
            validator.validate(`O'Connell`)
            expect(ValidationRule.namon.test).toReturnWith(true)
        })

        test('should validate a hyphenated name', () => {
            validator.validate('Pinkett-Smith')
            expect(ValidationRule.namon.test).toReturnWith(true)
        })

        test('should not throw error when Latin name(s)', () => {
            [
                () => new NamonValidator().validate('SchäferSchröderMüller'),
                () => new NamonValidator().validate('LópezFernándezGarcíaJoséPeñaEstúpido'),
                () => new NamonValidator().validate('BjörkGuðmundsdótti'),
            ].forEach(
                func => expect(func).not.toThrow(ValidationError)
            )
        })

        test('should throw error when no name', () => {
            const func = () => new NamonValidator().validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => new NamonValidator().validate('hello2world')
            expect(func).toThrow(ValidationError)
        })
    })

    describe('PrefixValidator', () => {
        const validator = new PrefixValidator()

        test('should be a prefix validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.PREFIX)
        })

        test('should accept predefined prefixes only', () => {
            ['Mr', 'Ms', 'Dr', 'Prof'].forEach(
                p => expect(() => new PrefixValidator().validate(p))
                    .not.toThrow(ValidationError)
            )
        })

        test('should be case-insensitive for predefined prefixes', () => {
            ['mr', 'MS', 'Dr', 'PrOf'].forEach(
                p => expect(() => new PrefixValidator().validate(p))
                    .not.toThrow(ValidationError)
            )
        })

        test('should throw error for unknown prefixes', () => {
            ['miss', 'mrss', 'Dra', 'Profe'].forEach(
                p => expect(() => new PrefixValidator().validate(p))
                    .toThrow(ValidationError)
            )
        })

        test('should throw error for prefixes with punctuations (,.)', () => {
            ['mr.', 'mr,'].forEach(
                p => expect(() => new PrefixValidator().validate(p))
                    .toThrow(ValidationError)
            )
        })
    })

    describe('SuffixValidator', () => {
        const validator = new SuffixValidator()

        test('should be a suffix validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.SUFFIX)
        })

        test('should accept predefined suffixes only', () => {
            ['Jr', 'Sr', 'PhD', 'II'].forEach(
                s => expect(() => new SuffixValidator().validate(s))
                    .not.toThrow(ValidationError)
            )
        })

        test('should be case-insensitive for predefined suffixes', () => {
            ['jr', 'SR', 'pHd', 'iI'].forEach(
                s => expect(() => new SuffixValidator().validate(s))
                    .not.toThrow(ValidationError)
            )
        })

        test('should throw error for unknown suffixes', () => {
            ['jra', 'sro', 'phh', 'vi'].forEach(
                s => expect(() => new SuffixValidator().validate(s))
                    .toThrow(ValidationError)
            )
        })

        test('should throw error for suffixes with punctuations (,.)', () => {
            [',phd', '.sr'].forEach(
                s => expect(() => new SuffixValidator().validate(s))
                    .toThrow(ValidationError)
            )
        })
    })

    describe('FirstnameValidator', () => {
        const validator = new FirstnameValidator()

        beforeAll(() => {
            jest.spyOn(ValidationRule.firstname, 'test')
        })

        test('should be a firstname validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.FIRST_NAME)
        })

        test('should regex a name-like content', () => {
            validator.validate('John')
            expect(ValidationRule.firstname.test).toBeCalledWith('John')
            expect(ValidationRule.firstname.test).toReturnWith(true)
        })

        test('should validate a typical name', () => {
            validator.validate('Jane')
            expect(ValidationRule.firstname.test).toReturnWith(true)
        })

        test('should validate a name with apostrophe', () => {
            validator.validate(`O'Connell`)
            expect(ValidationRule.firstname.test).toReturnWith(true)
        })

        test('should validate a hyphenated name', () => {
            validator.validate('Pinkett-Smith')
            expect(ValidationRule.firstname.test).toReturnWith(true)
        })

        test('should not throw error when Latin name(s)', () => {
            [
                () => new FirstnameValidator().validate('SchäferSchröderMüller'),
                () => new FirstnameValidator().validate('LópezFernándezGarcíaJoséPeñaEstúpido'),
                () => new FirstnameValidator().validate('BjörkGuðmundsdótti'),
            ].forEach(
                func => expect(func).not.toThrow(ValidationError)
            )
        })

        test('should throw error when no name', () => {
            const func = () => new FirstnameValidator().validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => new FirstnameValidator().validate('name4you')
            expect(func).toThrow(ValidationError)
        })
    })

    describe('LastnameValidator', () => {
        const validator = new LastnameValidator()

        beforeAll(() => {
            jest.spyOn(ValidationRule.lastname, 'test')
        })

        test('should be a lastname validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.LAST_NAME)
        })

        test('should regex a name-like content', () => {
            validator.validate('Smith')
            expect(ValidationRule.lastname.test).toBeCalledWith('Smith')
            expect(ValidationRule.lastname.test).toReturnWith(true)
        })

        test('should validate a typical name', () => {
            validator.validate('Florent')
            expect(ValidationRule.lastname.test).toReturnWith(true)
        })

        test('should validate a name with apostrophe', () => {
            validator.validate(`O'Connell`)
            expect(ValidationRule.lastname.test).toReturnWith(true)
        })

        test('should validate a hyphenated name', () => {
            validator.validate('Pinkett-Smith')
            expect(ValidationRule.lastname.test).toReturnWith(true)
        })

        test('should not throw error when Latin name(s)', () => {
            [
                () => new LastnameValidator().validate('Schäfer-Schröder-Müller'),
                () => new LastnameValidator().validate('López-Fernández-GarcíaJoséPeñaEstúpido'),
                () => new LastnameValidator().validate('Björk-Guðmundsdótti'),
            ].forEach(
                func => expect(func).not.toThrow(ValidationError)
            )
        })

        test('should throw error when no name', () => {
            const func = () => new LastnameValidator().validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => new LastnameValidator().validate('name4you')
            expect(func).toThrow(ValidationError)
        })
    })

    describe('StringNameValidator', () => {
        const validator = new StringNameValidator()

        beforeAll(() => {
            jest.spyOn(ValidationRule.fullname, 'test')
        })

        test('should be a string array validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.FULL_NAME)
        })

        test('should regex a name-like content', () => {
            validator.validate('Mrs Jada Joanna Pinkett-Smith II')
            expect(ValidationRule.fullname.test).toBeCalledWith('Mrs Jada Joanna Pinkett-Smith II')
            expect(ValidationRule.fullname.test).toBeCalledTimes(1)
            expect(ValidationRule.fullname.test).toReturnWith(true)
        })

        test('should validate a typical name', () => {
            validator.validate('Dominique Toreto')
            expect(ValidationRule.fullname.test).toReturnWith(true)
        })

        test('should validate a name with apostrophe', () => {
            validator.validate(`Jean O'Connell`)
            expect(ValidationRule.fullname.test).toReturnWith(true)
        })

        test('should validate a hyphenated name', () => {
            validator.validate('Angelina Jolie-Pitt')
            expect(ValidationRule.lastname.test).toReturnWith(true)
        })

        test('should not throw error when Latin name(s)', () => {
            [
                () => new StringNameValidator().validate('Schäfer Schröder Müller'),
                () => new StringNameValidator().validate('López FernándezGarcíaJoséPeña Estúpido'),
                () => new StringNameValidator().validate('Björk Guðmundsdótti'),
            ].forEach(
                func => expect(func).not.toThrow(ValidationError)
            )
        })

        test('should throw error when no name', () => {
            const func = () => new StringNameValidator().validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => new StringNameValidator().validate('4nn ka7rinn')
            expect(func).toThrow(ValidationError)
        })
    })

    describe('MiddlenameValidator', () => {
        const validator = new MiddlenameValidator()

        beforeAll(() => {
            jest.spyOn(ValidationRule.middlename, 'test')
        })

        test('should be a string array validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.MIDDLE_NAME)
        })

        test('should regex a name-like content', () => {
            validator.validate('Johnathan')
            expect(ValidationRule.middlename.test).toBeCalledWith('Johnathan')
            expect(ValidationRule.middlename.test).toBeCalledTimes(1)
            expect(ValidationRule.middlename.test).toReturnWith(true)
        })

        test('should validate a name using array', () => {
            validator.validate(['Dominique', 'DiPierro'])
            expect(ValidationRule.namon.test).toReturnWith(true)
        })

        test('should validate a name with apostrophe', () => {
            validator.validate(`O'Connell`)
            expect(ValidationRule.middlename.test).toReturnWith(true)
        })

        test('should validate a hyphenated name', () => {
            validator.validate('Jolie-Pitt')
            expect(ValidationRule.middlename.test).toReturnWith(true)
        })

        test('should not throw error when Latin name(s)', () => {
            [
                () => new MiddlenameValidator().validate(['Schäfer', 'Schröder', 'Müller']),
                () => new MiddlenameValidator().validate(['López', 'Fernández', 'García', 'José', 'Peña', 'Estúpido']),
                () => new MiddlenameValidator().validate(['Björk','Guðmundsdótti']),
            ].forEach(
                func => expect(func).not.toThrow(ValidationError)
            )
        })

        test('should throw error when no name', () => {
            const func = () => new MiddlenameValidator().validate(['', null, undefined])
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => new MiddlenameValidator().validate('4nn ka7rinn')
            expect(func).toThrow(ValidationError)
        })
    })

    describe('NamaValidator', () => {
        const validator = new NamaValidator()

        test('should be a nama validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.NAMA)
        })

        test('should throw error when wrong entries', () => {
            const func = () => {
                new NamaValidator().validate({ firstname: 'John', lastname: '' })
            }
            expect(func).toThrow(ValidationError)
        })
    })

    describe('ArrayStringValidator', () => {

        const validator = new ArrayStringValidator(NAME_INDEX)

        test('should be a string array validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.ARR_STRING)
        })

        test('should throw error when insufficient entries', () => {
            [
                [], ['John'], ['', '', '', '', '', '', '']
            ].map(arr =>
                expect(() => new ArrayStringValidator(NAME_INDEX)
                    .validate(arr))
                    .toThrow(ValidationError)
            )
        })

        test('should throw error when wrong entries', () => {
            const func = () => new ArrayStringValidator(NAME_INDEX).validate(['', '', ''])
            expect(func).toThrow(ValidationError)
        })
    })

    describe('ArrayNameValidator', () => {

        const validator = new ArrayNameValidator()
        let fn: Name, ln: Lastname, mn: Name, px: Name, sx: Name

        beforeEach(() => {
            fn = new Name('John', Namon.FIRST_NAME)
            mn = new Name('Joe', Namon.MIDDLE_NAME)
            ln = new Lastname('Pitt', 'Jolie', 'hyphenated')
            px = new Name('Mr', Namon.PREFIX)
            sx = new Name('PhD', Namon.SUFFIX)
        })

        test('should be a Name array validator', () => {
            expect(validator.type).toStrictEqual(ValidatorType.ARR_NAMES)
        })

        test('should throw error when wrong entries', () => {
            [
                () => new ArrayNameValidator().validate([]), // insufficient
                () => new ArrayNameValidator().validate([fn, fn, fn, fn, fn, fn]), // too many
            ].forEach(func => expect(func).toThrow(ValidationError))
        })

        test('should throw error when incomplete entries', () => {
            [
                () => new ArrayNameValidator().validate([px]),
                () => new ArrayNameValidator().validate([px, px]),
                () => new ArrayNameValidator().validate([px, px, px]),
                () => new ArrayNameValidator().validate([fn, ln, mn, sx]),
            ].forEach(func => expect(func).toThrow(ValidationError))
        })
    })
})
