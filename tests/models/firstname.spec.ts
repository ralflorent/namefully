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
        expect(firstname.tostring(false)).toEqual('Bryan')
        expect(firstname.tostring()).toEqual('Bryan Brendan')
    })

    test('should describe only the specified name parts', () => {
        const firstname = new Firstname('John', 'Joe', 'Jack')
        expect(firstname.describe().count).toEqual(4)
        expect(firstname.describe(true).count).toEqual(11)
    })

    test('should return only the initials of the specified name parts', () => {
        const firstname = new Firstname('Simon', 'Pete')
        expect(firstname.getInitials()).toStrictEqual(['S'])
        expect(firstname.getInitials(true)).toStrictEqual(['S', 'P'])
    })

    test('should capitalize one name afterward', () => {
        const firstname = new Firstname('John')
        expect(firstname.capitalize().tostring(true)).toEqual('John')
        expect(firstname.capitalize('all').tostring(true)).toEqual('JOHN')
    })

    test('should capitalize many names afterward', () => {
        const firstname = new Firstname('John', 'Joe')
        expect(firstname.capitalize().tostring(true)).toEqual('John Joe')
        expect(firstname.capitalize('all').tostring(true)).toEqual('JOHN JOE')
    })

    test('should decapitalize one name afterward', () => {
        const firstname = new Firstname('JOHN')
        expect(firstname.decapitalize().tostring(true)).toEqual('jOHN')
        expect(firstname.decapitalize('all').tostring(true)).toEqual('john')
    })

    test('should decapitalize many names afterward', () => {
        const firstname = new Firstname('JOHN', 'JOE')
        expect(firstname.decapitalize().tostring(true)).toEqual('jOHN jOE')
        expect(firstname.decapitalize('all').tostring(true)).toEqual('john joe')
    })

    test('should normalize one name afterward', () => {
        expect(
            new Firstname('JOHN')
                .normalize()
                .tostring(true)
        ).toEqual('John')
    })

    test('should normalize many names afterward', () => {
        expect(
            new Firstname('JOHN', 'JOE')
                .normalize()
                .tostring(true)
        ).toEqual('John Joe')
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
