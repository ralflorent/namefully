/**
 * Unit tests for the validation error class
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { ValidationError } from '../../src/index';

describe('ValidationError', () => {

    const message = 'validation message'
    const type = 'type of instance'

    test('should create an instance', () => {
        const error = new ValidationError(message, type)
        expect(error).toBeInstanceOf(ValidationError)
    })

    test('should throw a validation error', () => {
        const func = () => {
            throw new ValidationError()
        }
        expect(func).toThrow(ValidationError)
    })

    test('should throw error with message only', () => {
        const func = () => {
            throw new ValidationError(message)
        }
        expect(func).toThrowError(message)
    })

    test('should throw error with message and type', () => {
        const func = () => {
            throw new ValidationError(message, type)
        }
        const expectedErrorMessage = `${type} :: ${message}`
        expect(func).toThrowError(expectedErrorMessage) // says "message"
        expect(func).toThrowError(new Error(expectedErrorMessage)) // exact match
    })

})
