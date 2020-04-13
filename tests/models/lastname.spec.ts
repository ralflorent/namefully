/**
 * Unit tests for the models
 *
 * Created on April 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Lastname } from '../../src/index';

describe('Lastname', () => {

    test('should create an instance of type lastname', () => {
        const lastname = new Lastname('Smith')
        expect(lastname).toBeInstanceOf(Lastname)
        expect(lastname.namon).toBeDefined()
        expect(lastname.namon).toEqual(lastname.father)
        expect(lastname.type).toEqual(Namon.LAST_NAME)
    })

    test(`should create lastname with father's name only`, () => {
        const lastname = new Lastname('Smith')
        expect(lastname).toBeInstanceOf(Lastname)
        expect(lastname.namon).toBeDefined()
        expect(lastname.namon).toEqual(lastname.father)
        expect(lastname.mother).toBeFalsy()
    })

    test(`should create lastname with both father and mother's name parts`, () => {
        const lastname = new Lastname('Pitt', 'Jolie')
        expect(lastname).toBeInstanceOf(Lastname)
        expect(lastname.namon).toBeDefined()
        expect(lastname.namon).toEqual(lastname.father)
        expect(lastname.mother).toBeDefined()
    })

    describe('tostring()', () => {

        test(`should output a string with the father's name only`, () => {
            const lastname = new Lastname('Sparrow')
            expect(lastname.tostring()).toStrictEqual('Sparrow')
        })

        test(`should output a string including the mother's name`, () => {
            const lastname = new Lastname('Sparrow', 'Brown', 'all')
            expect(lastname.tostring()).toContain('Brown')
            expect(lastname.tostring()).toEqual('Sparrow Brown')
        })

        test(`should output a hyphenated surname`, () => {
            const lastname = new Lastname('Garfield', 'Snipes', 'hyphenated')
            expect(lastname.tostring()).toContain('-')
            expect(lastname.tostring()).toEqual('Garfield-Snipes')
        })

        test(`should override existing surname's output's format`, () => {
            const lastname = new Lastname('Phoenix', 'Cruz', 'all')
            expect(lastname.tostring()).toEqual('Phoenix Cruz')
            expect(lastname.tostring('father')).toEqual('Phoenix')
            expect(lastname.tostring('mother')).toEqual('Cruz')
            expect(lastname.tostring('hyphenated')).toEqual('Phoenix-Cruz')
            expect(lastname.tostring('all')).toEqual('Phoenix Cruz')
        })
    })

    describe('describe()', ()=> {

        test('should describe only the specified name part', () => {
            const lastname = new Lastname('Smith', 'Pinkett', 'all')
            expect(lastname.describe().tostring()).toContain('count    : 12')
            expect(lastname.describe('father').tostring()).toContain('count    : 5')
            expect(lastname.describe('mother').tostring()).toContain('count    : 7')
        })
    })

    describe('getInitials()', ()=> {

        test('should return only the initials of the specified name part', () => {
            const lastname = new Lastname('Smith', 'Pinkett', 'all')
            expect(lastname.getInitials()).toStrictEqual(['S', 'P'])
            expect(lastname.getInitials('father')).toStrictEqual(['S'])
            expect(lastname.getInitials('mother')).toStrictEqual(['P'])
        })
    })
})
