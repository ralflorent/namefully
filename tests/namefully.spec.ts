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
        jest.spyOn(name, 'compress')
    })

    test('should create an instance using literal string', () => {
        expect(name).toBeInstanceOf(Namefully)
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

    test('should describe statistically a name', () => {
        const summary = name.describe()
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

    test('should limit name to 10 chars', () => {
        const compressed = name.compress(10)
        expect(compressed).toBe(`${firstname} J. ${lastname}`)
        expect(console.warn).toBeCalled()
        expect(console.warn).toBeCalledTimes(1)
    })

    test('should limit name to 10 chars by compressing the firstname', () => {
        const compressed = name.compress(10, 'firstname')
        expect(compressed).toBe(`J. ${middlename} ${lastname}`)
        expect(console.warn).toBeCalled()
        expect(console.warn).toBeCalledTimes(1)
    })

    test('should limit name to 10 chars by compressing the lastname', () => {
        const compressed = name.compress(10, 'lastname')
        expect(compressed).toBe(`${firstname} ${middlename} S.`)
        expect(console.warn).toBeCalled()
        expect(console.warn).toBeCalledTimes(1)
    })

    test('should limit name to 10 chars by compressing the firstmid', () => {
        const compressed = name.compress(10, 'firstmid')
        expect(compressed).toBe(`J. J. ${lastname}`)
        expect(console.warn).toBeCalled()
        expect(console.warn).toBeCalledTimes(1)
    })

    test('should limit name to 10 chars by compressing the midlast', () => {
        const compressed = name.compress(10, 'midlast')
        expect(compressed).toBe(`${firstname} J. S.`)
        expect(console.warn).toBeCalled()
        expect(console.warn).toBeCalledTimes(1)
    })

    test('should output possible usernames', () => {
        const usernames = name.username()
        expect(usernames).toEqual(expect.arrayContaining([
            'j.smith', 'jsmith', 'johnsmith', 'josmith'
        ]))
    })

    // TODO: to be continued...

})