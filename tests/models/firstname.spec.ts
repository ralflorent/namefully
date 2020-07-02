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
        expect(firstname.more).toEqual([])
        expect(firstname.type).toEqual(Namon.FIRST_NAME)
    })

    test(`should create firstname with more name parts`, () => {
        const firstname = new Firstname('John', 'Joseph')
        expect(firstname).toBeInstanceOf(Firstname)
        expect(firstname.more).toEqual(['Joseph'])
    })

    test('should output the string names', () => {
        const firstname = new Firstname('Bryan', 'Brendan')
        expect(firstname.tostring()).toEqual('Bryan')
        expect(firstname.tostring(true)).toEqual('Bryan Brendan')
    })

    test('should describe only the specified name parts', () => {
        const firstname = new Firstname('John', 'Joe', 'Jack')
        expect(firstname.describe().tostring()).toContain('count    : 4')
        expect(firstname.describe(true).tostring()).toContain('count    : 11')
    })

    test('should return only the initials of the specified name parts', () => {
        const firstname = new Firstname('Simon', 'Pete')
        expect(firstname.getInitials()).toStrictEqual(['S'])
        expect(firstname.getInitials(true)).toStrictEqual(['S', 'P'])
    })

    test('should capitalize the names afterward', () => {
        const firstname = new Firstname('John', 'Joe')
        firstname.capitalize('initial')
        expect(firstname.tostring(true)).toEqual('John Joe')
        firstname.capitalize('all')
        expect(firstname.tostring(true)).toEqual('JOHN JOE')
    })

    test('should decapitalize the names afterward', () => {
        const firstname = new Firstname('JOHN', 'JOE')
        firstname.decapitalize('initial')
        expect(firstname.tostring(true)).toEqual('jOHN jOE')
        firstname.decapitalize('all')
        expect(firstname.tostring(true)).toEqual('john joe')
    })

    test('should return an ascii representation', () => {
        const firstname = new Firstname('John', 'Joe')
        expect(firstname.ascii()).toEqual([74, 111, 104, 110, 74, 111, 101])
        expect(firstname.ascii(['o', ' '])).toEqual([74, 104, 110, 74, 101])
    })

    test('should return a password (hash-like content)', () => {
        expect(new Firstname('John', 'Joe').passwd()).toBeDefined()
    })
})
