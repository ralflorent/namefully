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

})