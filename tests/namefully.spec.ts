/**
 * Unit tests for Namefully
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully, Firstname, Lastname, Parser, Fullname } from '../src/index';
import StringParser from '../src/core/parsers/string.parser';

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

        beforeEach(() => {
            const mock = jest.spyOn(console, 'warn')
            mock.mockClear()
        })

        test('should create an instance using literal string', () => {
            expect(name).toBeInstanceOf(Namefully)
        })

        test('should return expected name parts', () => {
            expect(name.getFullname()).toEqual(fullname)
            expect(name.getFirstname()).toEqual(firstname)
            expect(name.getLastname()).toEqual(lastname)
            expect(name.getMiddlenames().join(' ')).toEqual(middlename)
            expect(name.getPrefix()).toEqual(prefix)
            expect(name.getSuffix()).toEqual(suffix)
        })

        test('should return expected initials', () => {
            expect(name.getInitials()).toEqual(['J', 'S'])
            expect(name.getInitials('firstname')).toEqual(['J', 'S'])
            expect(name.getInitials('lastname', true)).toEqual(['S', 'J', 'J'])
            expect(name.getInitials('firstname', true)).toEqual(['J', 'J', 'S'])
        })

        test('should shorten name to first and last names', () => {
            expect(name.shorten()).toEqual('John Smith')
            expect(name.shorten('lastname')).toEqual('Smith John')
            expect(name.shorten('firstname')).toEqual('John Smith')
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
            name.compress(25)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit name to 10 chars', () => {
            const compressed = name.compress(10)
            expect(compressed).toBe(`${firstname} J. ${lastname}`)
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should limit name to 10 chars while compressing', () => {
            expect(name.compress(10, 'firstname')).toBe('J. Joe Smith')
            expect(name.compress(10, 'lastname')).toBe('John Joe S.')
            expect(name.compress(10, 'firstmid')).toBe('J. J. Smith')
            expect(name.compress(10, 'midlast')).toBe('John J. S.')
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

        test('should output a capitalized names', () => {
            expect(name.format('F')).toEqual(firstname.toUpperCase())
            expect(name.format('L')).toEqual(lastname.toUpperCase())
            expect(name.format('M')).toEqual(middlename.toUpperCase())
        })

        test('should output just a name part', () => {
            expect(name.format('f')).toEqual(firstname)
            expect(name.format('l')).toEqual(lastname)
            expect(name.format('m')).toEqual(middlename)
            expect(name.format('O')).toEqual(`Mr SMITH, John Joe`)
            expect(name.format()).toEqual(fullname)
        })
    })


    describe('Ordered by lastname', () => {
        const fullname = [
            prefix,
            lastname,
            firstname,
            middlename,
            suffix
        ].join(' ')
        const name = new Namefully(fullname, { orderedBy: 'lastname' })

        beforeEach(() => {
            const mock = jest.spyOn(console, 'warn')
            mock.mockClear()
        })

        test('should create an instance using literal string', () => {
            expect(name).toBeInstanceOf(Namefully)
        })

        test('should return expected name parts', () => {
            expect(name.getFullname()).toEqual(fullname)
            expect(name.getFirstname()).toEqual(firstname)
            expect(name.getLastname()).toEqual(lastname)
            expect(name.getMiddlenames().join(' ')).toEqual(middlename)
            expect(name.getPrefix()).toEqual(prefix)
            expect(name.getSuffix()).toEqual(suffix)
        })

        test('should return expected initials', () => {
            expect(name.getInitials()).toEqual(['S', 'J'])
            expect(name.getInitials('firstname')).toEqual(['J', 'S'])
            expect(name.getInitials('lastname', true)).toEqual(['S', 'J', 'J'])
            expect(name.getInitials('firstname', true)).toEqual(['J', 'J', 'S'])
        })

        test('should shorten the name to first and last names', () => {
            expect(name.shorten()).toEqual('Smith John')
            expect(name.shorten('lastname')).toEqual('Smith John')
            expect(name.shorten('firstname')).toEqual('John Smith')
        })

        test('should limit name to 10 chars', () => {
            const compressed = name.compress(10)
            expect(compressed).toBe('Smith John J.')
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should limit name to 10 chars while compressing', () => {
            expect(name.compress(10, 'firstname')).toBe('Smith J. Joe')
            expect(name.compress(10, 'lastname')).toBe('S. John Joe')
            expect(name.compress(10, 'firstmid')).toBe('Smith J. J.')
            expect(name.compress(10, 'midlast')).toBe('S. John J.')
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

        test('should output a capitalized names', () => {
            expect(name.format('F')).toEqual(firstname.toUpperCase())
            expect(name.format('L')).toEqual(lastname.toUpperCase())
            expect(name.format('M')).toEqual(middlename.toUpperCase())
            expect(name.format('O')).toEqual(`Mr SMITH, John Joe`)
        })

        test('should output just a name part', () => {
            expect(name.format()).toEqual(fullname)
            expect(name.format('f')).toEqual(firstname)
            expect(name.format('l')).toEqual(lastname)
            expect(name.format('m')).toEqual(middlename)
        })
    })

    describe('Build Namefully', () => {

        test('should create an instance with raw string', () => {
            const name = new Namefully('John Smith')
            expect(name).toBeTruthy()
        })

        test('should create an instance with array string', () => {
            const name = new Namefully(['John', 'Smith'])
            expect(name).toBeTruthy()
        })

        test('should create an instance with class Name', () => {
            const name = new Namefully([ new Firstname('John'), new Lastname('Smith') ])
            expect(name).toBeTruthy()
        })

        test('should create an instance with JSON object', () => {
            const name = new Namefully({ firstname: 'John', lastname: 'Smith' })
            expect(name).toBeTruthy()
        })

        test('should create an instance with a custom parser', () => {
            class CustomParser implements Parser<string> {
                constructor(public raw: string) {}
                parse(): Fullname {
                    // omit parsing procedure
                    return {
                        firstname: new Firstname('John'),
                        lastname: new Lastname('Smith')
                    }
                }
            }
            const name = new Namefully(null, { parser: new CustomParser('') })
            expect(name).toBeTruthy()
        })

        test('should throw error when wrong raw string', () => {
            [
                () => { new Namefully('Maria De La Cruz') },
            ].forEach(fn => expect(fn).toThrow(Error))
        })

        test('should throw error when wrong Name array', () => {
            const func = () => {
                new Namefully([
                    new Firstname('John'),
                    new Lastname('Smith'),
                    null, undefined
                ])
            }
            expect(func).toThrow(Error)
        })

        test('should throw error when wrong array', () => {
            const func = () => {
                new Namefully([null, undefined])
            }
            expect(func).toThrow(Error)
        })

        test('should throw error when wrong Name array', () => {
            const func = () => {
                new Namefully([
                    new Firstname('John'),
                    new Lastname('Smith'),
                    null, undefined
                ])
            }
            expect(func).toThrow(Error)
        })

        test('should throw error when wrong object values', () => {
            const func = () => {
                const json = {'firstname': 'John', 'lastname': 'Smith' }
                json['firstname'] = null
                json['lastname'] = undefined
                new Namefully(json)
            }
            expect(func).toThrow(Error)
        })

        test('should throw error when wrong data input', () => {
            [null, undefined, ''].forEach(
                e => expect(() => { new Namefully(e) }).toThrow(Error)
            )
        })

    })

})