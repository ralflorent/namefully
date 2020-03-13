/**
 * Unit tests for Namefully
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from '../src/index';

describe('Namefully', () => {

    const prefix = 'Mr'
    const firstname = 'John'
    const middlename = 'Joe'
    const lastname = 'Smith'
    const suffix = 'PhD'

    describe('Ordered by firstname', () => {
        const fullname = [
            prefix,
            firstname,
            middlename,
            lastname,
            suffix
        ].join(' ')
        const name = new Namefully(fullname)

        beforeAll(() => {
            jest.spyOn(console, 'warn')
        })

        test('should create an instance using literal string', () => {
            expect(name).toBeInstanceOf(Namefully)
        })

        test('should return expected full name', () => {
            expect(name.getFullname()).toEqual(fullname)
        })

        test('should return expected first name', () => {
            expect(name.getFirstname()).toEqual(firstname)
        })

        test('should return expected last name', () => {
            expect(name.getLastname()).toEqual(lastname)
        })

        test('should return expected middle name', () => {
            expect(name.getMiddlenames().join(' ')).toEqual(middlename)
        })

        test('should return expected prefix', () => {
            expect(name.getPrefix()).toEqual(prefix)
        })

        test('should return expected suffix', () => {
            expect(name.getSuffix()).toEqual(suffix)
        })

        test('should return expected initials', () => {
            expect(name.getInitials()).toEqual(['J', 'S'])
        })

        test('should shorten name to first and last names', () => {
            const expected = `${firstname} ${lastname}`
            expect(name.shorten()).toEqual(expected)
        })

        test('should describe statistically the fullname', () => {
            const summary = name.describe()
            expect(summary).toContain('count')
            expect(summary).toContain('frequency')
            expect(summary).toContain('top')
            expect(summary).toContain('unique')
        })

        test('should describe statistically the firstname', () => {
            const summary = name.describe('firstname')
            expect(summary).toContain('count')
            expect(summary).toContain('frequency')
            expect(summary).toContain('top')
            expect(summary).toContain('unique')
        })

        test('should describe statistically the lastname', () => {
            const summary = name.describe('lastname')
            expect(summary).toContain('count')
            expect(summary).toContain('frequency')
            expect(summary).toContain('top')
            expect(summary).toContain('unique')
        })

        test('should describe statistically the middlename', () => {
            const summary = name.describe('middlename')
            expect(summary).toContain('count')
            expect(summary).toContain('frequency')
            expect(summary).toContain('top')
            expect(summary).toContain('unique')
        })

        test('should try to compress middlename by default', () => {
            const compressed = name.compress()
            expect(compressed).toContain(firstname)
            expect(compressed).toContain(lastname)
        })

        test('should not evoke the logger for short names when compressing', () => {
            const compressed = name.compress(25)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit name to 10 chars', () => {
            const compressed = name.compress(10)
            expect(compressed).toBe(`${firstname} J. ${lastname}`)
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should limit name to 10 chars by compressing the firstname', () => {
            const compressed = name.compress(10, 'firstname')
            expect(compressed).toBe(`J. ${middlename} ${lastname}`)
        })

        test('should limit name to 10 chars by compressing the lastname', () => {
            const compressed = name.compress(10, 'lastname')
            expect(compressed).toBe(`${firstname} ${middlename} S.`)
        })

        test('should limit name to 10 chars by compressing the firstmid', () => {
            const compressed = name.compress(10, 'firstmid')
            expect(compressed).toBe(`J. J. ${lastname}`)
        })

        test('should limit name to 10 chars by compressing the midlast', () => {
            const compressed = name.compress(10, 'midlast')
            expect(compressed).toBe(`${firstname} J. S.`)
        })

        test('should output possible usernames', () => {
            const usernames = name.username()
            expect(usernames).toEqual(expect.arrayContaining([
                'j.smith', 'jsmith', 'johnsmith', 'josmith'
            ]))
        })

        test('should throw error for wrong key params when formatting', () => {
            ['[', '{', '^', '!', '@', '#', 'a', 'b', 'c', 'd'].forEach(
                k => expect(() => name.format(k)).toThrow(Error)
            )
        })

        test('should not throw error for correct key params when formatting', () => {
            [' ', '-', '_', ',', '.', 'f', 'F', 'l', 'L', 'm', 'M', 'O'].forEach(
                k => expect(() => name.format(k)).not.toThrow(Error)
            )
        })

        test('should output a capitalized firstname', () => {
            expect(name.format('F')).toEqual(firstname.toUpperCase())
        })

        test('should output a capitalized lastname', () => {
            expect(name.format('L')).toEqual(lastname.toUpperCase())
        })

        test('should output a capitalized middlename', () => {
            expect(name.format('M')).toEqual(middlename.toUpperCase())
        })

        test('should output just the firstname', () => {
            expect(name.format('f')).toEqual(firstname)
        })

        test('should output just the lastname', () => {
            expect(name.format('l')).toEqual(lastname)
        })

        test('should output just a middlename', () => {
            expect(name.format('m')).toEqual(middlename)
        })
    })


    // describe('Ordered by lastname', () => {
    //     const fullname = [
    //         prefix,
    //         lastname,
    //         middlename,
    //         firstname,
    //         suffix
    //     ].join(' ')
    //     const name = new Namefully(fullname, { orderedBy: Namon.LAST_NAME })
    // })
    // TODO: to be continued...

})