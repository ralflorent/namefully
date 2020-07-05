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
            expect(lastname.tostring('father')).toStrictEqual('Sparrow')
            expect(lastname.tostring('hyphenated')).toStrictEqual('Sparrow')
            expect(lastname.tostring('all')).toStrictEqual('Sparrow')
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

        test('should return nothing for non existing mother surname', () => {
            expect(new Lastname('Phoenix', null, 'all').tostring('mother')).toBeFalsy()
            expect(new Lastname('Phoenix', '', 'all').tostring('mother')).toBeFalsy()
            expect(new Lastname('Phoenix', '', 'mother').tostring('mother')).toBeFalsy()
            expect(new Lastname('Phoenix', '').tostring('mother')).toBeFalsy()
        })
    })

    describe('describe()', () => {
        test('should describe only the specified name part', () => {
            const lastname = new Lastname('Smith', 'Pinkett', 'all')
            expect(lastname.describe().count).toEqual(12)
            expect(lastname.describe('father').count).toEqual(5)
            expect(lastname.describe('mother').count).toEqual(7)
        })
    })

    describe('getInitials()', () => {
        test('should return only the initials of the specified name part', () => {
            const lastname = new Lastname('Smith', 'Pinkett', 'all')
            expect(lastname.getInitials()).toStrictEqual(['S', 'P'])
            expect(lastname.getInitials('father')).toStrictEqual(['S'])
            expect(lastname.getInitials('mother')).toStrictEqual(['P'])
            expect(lastname.getInitials('hyphenated')).toStrictEqual(['S','P'])
            expect(lastname.getInitials('all')).toStrictEqual(['S', 'P'])
        })

        test('should return nothing for non existing mother surname', () => {
            const lastname = new Lastname('Smith', '', 'all')
            expect(lastname.getInitials('mother')).toStrictEqual([])
            expect(lastname.getInitials('hyphenated')).toStrictEqual(['S'])
            expect(lastname.getInitials('all')).toStrictEqual(['S'])
        })
    })

    test('should capitalize one name afterward', () => {
        const lastname = new Lastname('obama')
        expect(lastname.capitalize().tostring()).toEqual('Obama')
        expect(lastname.capitalize('all').tostring()).toEqual('OBAMA')
    })

    test('should capitalize many names afterward', () => {
        const lastname = new Lastname('sánchez', 'rodríguez', 'all')
        expect(lastname.capitalize().tostring()).toEqual('Sánchez Rodríguez')
        expect(lastname.capitalize('all').tostring()).toEqual('SÁNCHEZ RODRÍGUEZ')
    })

    test('should decapitalize one name afterward', () => {
        const lastname = new Lastname('BUSH')
        expect(lastname.decapitalize().tostring()).toEqual('bUSH')
        expect(lastname.decapitalize('all').tostring()).toEqual('bush')
    })

    test('should decapitalize many names afterward', () => {
        const lastname = new Lastname('CLINTON', 'SOUSA', 'all')
        expect(lastname.decapitalize().tostring()).toEqual('cLINTON sOUSA')
        expect(lastname.decapitalize('all').tostring()).toEqual('clinton sousa')
    })

    test('should normalize one name afterward', () => {
        expect(
            new Lastname('ESTRELLA')
                .normalize()
                .tostring()
        ).toEqual('Estrella')
    })

    test('should normalize many names afterward', () => {
        expect(
            new Lastname('SÁNCHEZ', 'RODRÍGUEZ', 'all')
                .normalize()
                .tostring()
        ).toEqual('Sánchez Rodríguez')
    })

    test('should return an ascii representation', () => {
        const lastname = new Lastname('John', 'Joe', 'all')
        expect(lastname.ascii()).toEqual([74, 111, 104, 110, 74, 111, 101])
        expect(lastname.ascii(['o', ' '])).toEqual([74, 104, 110, 74, 101])
    })

    test('should return a password (hash-like content)', () => {
        expect(new Lastname('Sánchez', 'Rodríguez', 'all').passwd()).toBeDefined()
    })
})
