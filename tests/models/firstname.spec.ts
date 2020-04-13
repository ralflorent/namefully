/**
 * Unit tests for the models
 *
 * Created on April 13, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Firstname } from '../../src/index';

describe('Firstname', () => {

    test('should create an instance of type firstname', () => {
        const firstname = new Firstname('John')
        expect(firstname).toBeInstanceOf(Firstname)
        expect(firstname.namon).toBeDefined()
        expect(firstname.more).toBeUndefined()
        expect(firstname.type).toEqual(Namon.FIRST_NAME)
    })

    test(`should create firstname with more name parts`, () => {
        const firstname = new Firstname('John', ['Joseph'])
        expect(firstname).toBeInstanceOf(Firstname)
        expect(firstname.more).toBeDefined()
        expect(firstname.more).toEqual(['Joseph'])
    })

    test('should output the string names', () => {
        const firstname = new Firstname('Bryan', ['Brendan'])
        expect(firstname.tostring()).toEqual('Bryan')
        expect(firstname.tostring(true)).toEqual('Bryan Brendan')
    })

    test('should describe only the specified name parts', () => {
        const firstname = new Firstname('John', ['Joe', 'Jack'])
        expect(firstname.describe().tostring()).toContain('count    : 4')
        expect(firstname.describe(true).tostring()).toContain('count    : 11')
    })

    test('should return only the initials of the specified name parts', () => {
        const firstname = new Firstname('Simon', ['Pete'])
        expect(firstname.getInitials()).toStrictEqual(['S'])
        expect(firstname.getInitials(true)).toStrictEqual(['S', 'P'])
    })
})
