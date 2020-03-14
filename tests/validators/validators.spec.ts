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

        test('should throw error when unmatching regex', () => {
            const func = () => validator.validate('Sánchez')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when no name', () => {
            const func = () => validator.validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => validator.validate('hello2world')
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
                p => expect(() => validator.validate(p))
                    .not.toThrow(ValidationError)
            )
        })

        test('should be case-insensitive for predefined prefixes', () => {
            ['mr', 'MS', 'Dr', 'PrOf'].forEach(
                p => expect(() => validator.validate(p))
                    .not.toThrow(ValidationError)
            )
        })

        test('should throw error for unknown prefixes', () => {
            ['miss', 'mrss', 'Dra', 'Profe'].forEach(
                p => expect(() => validator.validate(p))
                    .toThrow(ValidationError)
            )
        })

        test('should throw error for prefixes with punctuations (,.)', () => {
            ['mr.', 'mr,'].forEach(
                p => expect(() => validator.validate(p))
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
                s => expect(() => validator.validate(s))
                    .not.toThrow(ValidationError)
            )
        })

        test('should be case-insensitive for predefined suffixes', () => {
            ['jr', 'SR', 'pHd', 'iI'].forEach(
                s => expect(() => validator.validate(s))
                    .not.toThrow(ValidationError)
            )
        })

        test('should throw error for unknown suffixes', () => {
            ['jra', 'sro', 'phh', 'vi'].forEach(
                s => expect(() => validator.validate(s))
                    .toThrow(ValidationError)
            )
        })

        test('should throw error for suffixes with punctuations (,.)', () => {
            [',phd', '.sr'].forEach(
                s => expect(() => validator.validate(s))
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
            expect(ValidationRule.firstname.test).toBeCalledTimes(1)
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

        test('should throw error when unmatching regex', () => {
            const func = () => validator.validate('Rodríguez')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when no name', () => {
            const func = () => validator.validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => validator.validate('name4you')
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
            expect(ValidationRule.lastname.test).toBeCalledTimes(1)
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

        test('should throw error when unmatching regex', () => {
            const func = () => validator.validate('Rodríguez')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when no name', () => {
            const func = () => validator.validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => validator.validate('name4you')
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

        test('should throw error when unmatching regex', () => {
            const func = () => validator.validate('Carlos Slim Rodríguez')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when no name', () => {
            const func = () => validator.validate('')
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => validator.validate('4nn ka7rinn')
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

        test('should throw error when unmatching regex', () => {
            const func = () => validator.validate(['Carlos','Rodríguez'])
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when no name', () => {
            const func = () => validator.validate(['', null, undefined])
            expect(func).toThrow(ValidationError)
        })

        test('should throw error when contaning numbers', () => {
            const func = () => validator.validate('4nn ka7rinn')
            expect(func).toThrow(ValidationError)
        })
    })

})