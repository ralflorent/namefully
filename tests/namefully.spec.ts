/**
 * Unit tests for Namefully
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully, Firstname, Lastname, Parser, Fullname, Separator } from '../src/index';

describe('Namefully', () => {

    describe('Ordered by firstname', () => {
        let name: Namefully;

        beforeEach(() => {
            name = new Namefully('Mr John Joe Smith PhD')
            const mock = jest.spyOn(console, 'warn')
            mock.mockClear()
        })

        test('should create an instance using literal string', () => {
            expect(name).toBeInstanceOf(Namefully)
        })

        test('should return expected name parts', () => {
            expect(name.getFullname()).toEqual('Mr John Joe Smith PhD')
            expect(name.getFirstname()).toEqual('John')
            expect(name.getLastname()).toEqual('Smith')
            expect(name.getMiddlenames().join(' ')).toEqual('Joe')
            expect(name.getPrefix()).toEqual('Mr')
            expect(name.getSuffix()).toEqual('PhD')
            expect(name.getBirthname()).toEqual('John Joe Smith')
        })

        test('should return expected initials', () => {
            expect(name.getInitials()).toEqual(['J', 'S'])
            expect(name.getInitials('firstname')).toEqual(['J', 'S'])
            expect(name.getInitials('lastname', true)).toEqual(['S', 'J', 'J'])
            expect(name.getInitials('firstname', true)).toEqual(['J', 'J', 'S'])
        })

        test('should evoke logger when no middle name was set for initials', () => {
            new Namefully('John Smith').getInitials('firstname', true)
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should describe statistically the full name', () => {
            const summary = name.describe()
            expect(summary.count).toEqual(17)
            expect(summary.frequency).toEqual(3)
            expect(summary.top).toEqual('H')
            expect(summary.unique).toEqual(12)
            expect(summary.distribution).toEqual({
                M: 2,
                R: 1,
                ' ': 4,
                J: 2,
                O: 2,
                H: 3,
                N: 1,
                E: 1,
                S: 1,
                I: 1,
                T: 1,
                P: 1,
                D: 1
            })
        })

        test('should describe statistically the first name', () => {
            const summary = name.describe('firstname')
            expect(summary.count).toEqual(4)
            expect(summary.frequency).toEqual(1)
            expect(summary.top).toEqual('N')
            expect(summary.unique).toEqual(4)
            expect(summary.distribution).toEqual({ J: 1, O: 1, H: 1, N: 1})
        })

        test('should describe statistically the last name', () => {
            const summary = name.describe('lastname')
            expect(summary.count).toEqual(5)
            expect(summary.frequency).toEqual(1)
            expect(summary.top).toEqual('H')
            expect(summary.unique).toEqual(5)
            expect(summary.distribution).toEqual({ S: 1, M: 1, I: 1, T: 1, H: 1 })
        })

        test('should describe statistically the middle name', () => {
            const summary = name.describe('middlename')
            expect(summary.count).toEqual(3)
            expect(summary.frequency).toEqual(1)
            expect(summary.top).toEqual('E')
            expect(summary.unique).toEqual(3)
            expect(summary.distribution).toEqual({ J: 1, O: 1, E: 1 })
        })

        test('should evoke logger when no middle name was set for summary', () => {
            new Namefully('John Smith').describe('middlename')
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should shorten name to first and last names', () => {
            expect(name.shorten()).toEqual('John Smith')
            expect(name.shorten('lastname')).toEqual('Smith John')
            expect(name.shorten('firstname')).toEqual('John Smith')
        })

        test('should compress using middlename by default', () => {
            expect(name.compress()).toEqual('John J. Smith')
        })

        test('should not evoke the logger for short names when compressing', () => {
            name.compress(25)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit name to 10 chars and alert it', () => {
            name.compress(10)
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should not evoke the logger when told so explicitly', () => {
            name.compress(10, 'middlename', false)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit a name to 10 chars while compressing', () => {
            expect(name.compress(10, 'firstname', false)).toBe('J. Joe Smith')
            expect(name.compress(10, 'lastname', false)).toBe('John Joe S.')
            expect(name.compress(10, 'firstmid', false)).toBe('J. J. Smith')
            expect(name.compress(10, 'midlast', false)).toBe('John J. S.')
        })

        test('should zip a name by compressing specific name parts', () => {
            expect(name.zip()).toBe('John J. Smith')
            expect(name.zip('firstname')).toBe('J. Joe Smith')
            expect(name.zip('middlename')).toBe('John J. Smith')
            expect(name.zip('lastname')).toBe('John Joe S.')
            expect(name.zip('firstmid')).toBe('J. J. Smith')
            expect(name.zip('midlast')).toBe('John J. S.')
        })

        test('should output possible usernames', () => {
            expect(name.username()).toEqual(
                expect.arrayContaining([
                    'j.smith',
                    'jsmith',
                    'johnsmith',
                    'josmith'
                ])
            )
        })

        test('should throw error for wrong key params when formatting', () => {
            ['[', '{', '^', '!', '@', '#', 'a', 'c', 'd'].forEach(
                k => expect(() => name.format(k)).toThrow(Error)
            )
        })

        test('should not throw error for correct key params when formatting', () => {
            [' ', '-', '_', ',', '.', 'f', 'F', 'l', 'L', 'm', 'M', 'O'].forEach(
                k => expect(() => name.format(k)).not.toThrow(Error)
            )
        })

        test('should format a name using string format', () => {
            expect(name.format('short')).toEqual('John Smith')
            expect(name.format('long')).toEqual('John Joe Smith')
            expect(name.format('official')).toEqual('Mr SMITH, John Joe PhD')
            expect(name.format()).toEqual('Mr SMITH, John Joe PhD')
        })

        test('should output a capitalized names', () => {
            expect(name.format('B')).toEqual('JOHN JOE SMITH')
            expect(name.format('F')).toEqual('JOHN')
            expect(name.format('L')).toEqual('SMITH')
            expect(name.format('M')).toEqual('JOE')
            expect(name.format('O')).toEqual('MR SMITH, JOHN JOE PHD')
            expect(name.format('P')).toEqual('MR')
            expect(name.format('S')).toEqual('PHD')
        })

        test('should output just a name part', () => {
            expect(name.format('b')).toEqual('John Joe Smith')
            expect(name.format('f')).toEqual('John')
            expect(name.format('l')).toEqual('Smith')
            expect(name.format('m')).toEqual('Joe')
            expect(name.format('o')).toEqual('Mr SMITH, John Joe PhD')
            expect(name.format('p')).toEqual('Mr')
            expect(name.format('s')).toEqual('PhD')
        })

        test('should evoke logger when no middle name was set for formatting', () => {
            new Namefully('John Smith').format('f m M l')
            expect(console.warn).toBeCalledTimes(2)
        })

        test('should return the count of chars of the birth name', () => {
            expect(name.size()).toEqual(12)
        })

        test('should return the ascii representation', () => {
            expect(name.ascii())
                .toEqual([74, 111, 104, 110, 74, 111, 101, 83, 109, 105, 116, 104])
            expect(name.ascii({ nameType: 'firstname'}))
                .toEqual([74, 111, 104, 110])
            expect(name.ascii({ nameType: 'lastname'}))
                .toEqual([83, 109, 105, 116, 104])
            expect(name.ascii({ nameType: 'middlename'}))
                .toEqual([74, 111, 101])
            expect(name.ascii({ nameType: 'middlename', exceptions: [ 'o' ]}))
                .toEqual([74, 101])
        })

        test('should evoke logger when no middle name was set for ascii', () => {
            new Namefully('John Smith').ascii({ nameType: 'middlename' })
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should titlecase the birth name', () => {
            expect(name.to('lower')).toEqual('john joe smith')
            expect(name.to('upper')).toEqual('JOHN JOE SMITH')
            expect(name.to('camel')).toEqual('johnJoeSmith')
            expect(name.to('pascal')).toEqual('JohnJoeSmith')
            expect(name.to('snake')).toEqual('john_joe_smith')
            expect(name.to('hyphen')).toEqual('john-joe-smith')
            expect(name.to('dot')).toEqual('john.joe.smith')
            expect(name.to('toggle')).toEqual('jOHN jOE sMITH')
            expect(name.to(null)).toEqual('')
        })

        test('should return a password (hash-like content)', () => {
            expect(name.passwd()).toBeDefined()
            expect(name.passwd('firstname')).toBeDefined()
            expect(name.passwd('middlename')).toBeDefined()
            expect(name.passwd('lastname')).toBeDefined()
        })

        test('should evoke logger when no middle name was set for password', () => {
            new Namefully('John Smith').passwd('middlename')
            expect(console.warn).toBeCalledTimes(1)
        })
    })


    describe('Ordered by lastname', () => {
        let name: Namefully;

        beforeEach(() => {
            name = new Namefully('Mr Smith John Joe PhD', { orderedBy: 'lastname' });
            const mock = jest.spyOn(console, 'warn')
            mock.mockClear()
        })

        test('should create an instance using literal string', () => {
            expect(name).toBeInstanceOf(Namefully)
        })

        test('should return expected name parts', () => {
            expect(name.getFullname()).toEqual('Mr Smith John Joe PhD')
            expect(name.getFirstname()).toEqual('John')
            expect(name.getLastname()).toEqual('Smith')
            expect(name.getMiddlenames().join(' ')).toEqual('Joe')
            expect(name.getPrefix()).toEqual('Mr')
            expect(name.getSuffix()).toEqual('PhD')
            expect(name.getBirthname()).toEqual('Smith John Joe')
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

        test('should compress using middlename by default', () => {
            expect(name.compress()).toEqual('Smith John J.')
        })

        test('should not evoke the logger for short names when compressing', () => {
            name.compress(25)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit name to 10 chars and alert it', () => {
            name.compress(10)
            expect(console.warn).toBeCalledTimes(1)
        })

        test('should not evoke the logger when told so explicitly', () => {
            name.compress(10, 'middlename', false)
            expect(console.warn).not.toBeCalled()
        })

        test('should limit name to 10 chars while compressing', () => {
            expect(name.compress(10, 'firstname', false)).toBe('Smith J. Joe')
            expect(name.compress(10, 'lastname', false)).toBe('S. John Joe')
            expect(name.compress(10, 'firstmid', false)).toBe('Smith J. J.')
            expect(name.compress(10, 'midlast', false)).toBe('S. John J.')
        })

        test('should limit name to 10 chars while compressing', () => {
            expect(name.zip()).toBe('Smith John J.')
            expect(name.zip('firstname')).toBe('Smith J. Joe')
            expect(name.zip('middlename')).toBe('Smith John J.')
            expect(name.zip('lastname')).toBe('S. John Joe')
            expect(name.zip('firstmid')).toBe('Smith J. J.')
            expect(name.zip('midlast')).toBe('S. John J.')
        })

        test('should output possible usernames', () => {
            const usernames = name.username()
            expect(usernames).toEqual(
                expect.arrayContaining([
                    'j.smith',
                    'jsmith',
                    'johnsmith',
                    'josmith'
                ])
            )
        })

        test('should throw error for wrong key params when formatting', () => {
            ['[', '{', '^', '!', '@', '#', 'a', 'c', 'd'].forEach(
                k => expect(() => name.format(k)).toThrow(Error)
            )
        })

        test('should not throw error for correct key params when formatting', () => {
            [' ', '-', '_', ',', '.', 'f', 'F', 'l', 'L', 'm', 'M', 'O'].forEach(
                k => expect(() => name.format(k)).not.toThrow(Error)
            )
        })

        test('should format a name using string format', () => {
            expect(name.format('short')).toEqual('Smith John')
            expect(name.format('long')).toEqual('Smith John Joe')
            expect(name.format('official')).toEqual('Mr SMITH, John Joe PhD')
            expect(name.format()).toEqual('Mr SMITH, John Joe PhD')
        })

        test('should output a capitalized names', () => {
            expect(name.format('B')).toEqual('SMITH JOHN JOE')
            expect(name.format('F')).toEqual('JOHN')
            expect(name.format('L')).toEqual('SMITH')
            expect(name.format('M')).toEqual('JOE')
            expect(name.format('O')).toEqual(`MR SMITH, JOHN JOE PHD`)
            expect(name.format('P')).toEqual('MR')
            expect(name.format('S')).toEqual('PHD')
        })

        test('should output just a name part', () => {
            expect(name.format('b')).toEqual('Smith John Joe')
            expect(name.format('f')).toEqual('John')
            expect(name.format('l')).toEqual('Smith')
            expect(name.format('m')).toEqual('Joe')
            expect(name.format('o')).toEqual('Mr SMITH, John Joe PhD')
            expect(name.format('p')).toEqual('Mr')
            expect(name.format('s')).toEqual('PhD')
        })

        test('should return the count of chars of the birth name', () => {
            expect(name.size()).toEqual(12)
        })

        test('should return the ascii representation', () => {
            expect(name.ascii())
                .toEqual([83, 109, 105, 116, 104, 74, 111, 104, 110, 74, 111, 101])
            expect(name.ascii({ nameType: 'firstname'}))
                .toEqual([74, 111, 104, 110])
            expect(name.ascii({ nameType: 'lastname'}))
                .toEqual([83, 109, 105, 116, 104])
            expect(name.ascii({ nameType: 'middlename'}))
                .toEqual([74, 111, 101])
            expect(name.ascii({ nameType: 'middlename', exceptions: [ 'o' ]}))
                .toEqual([74, 101])
        })

        test('should titlecase the birth name', () => {
            expect(name.to('lower')).toEqual('smith john joe')
            expect(name.to('upper')).toEqual('SMITH JOHN JOE')
            expect(name.to('camel')).toEqual('smithJohnJoe')
            expect(name.to('pascal')).toEqual('SmithJohnJoe')
            expect(name.to('snake')).toEqual('smith_john_joe')
            expect(name.to('hyphen')).toEqual('smith-john-joe')
            expect(name.to('dot')).toEqual('smith.john.joe')
            expect(name.to('toggle')).toEqual('sMITH jOHN jOE')
        })

        test('should return a password (hash-like content)', () => {
            expect(name.passwd()).toBeDefined()
            expect(name.passwd('firstname')).toBeDefined()
            expect(name.passwd('middlename')).toBeDefined()
            expect(name.passwd('lastname')).toBeDefined()
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
                () => { new Namefully('Maria') },
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
                const json = { 'firstname': 'John', 'lastname': 'Smith' }
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

    describe('Build Namefully with options', () => {

        test('should create an instance with orderedBy', () => {
            const fn = new Namefully('Tony Stark', { orderedBy: 'firstname' })
            expect(fn).toBeTruthy()
            expect(fn.getLastname()).toEqual('Stark')
            const ln = new Namefully('Romanov Natasha', { orderedBy: 'lastname' })
            expect(ln).toBeTruthy()
            expect(ln.getLastname()).toEqual('Romanov')
        })

        test('should create an instance with separator', () => {
            const space = new Namefully('Jack Sparrow', { separator: Separator.SPACE })
            expect(space).toBeTruthy()
            expect(space.getLastname()).toEqual('Sparrow')
            const comma = new Namefully('Maria,De La Cruz', { separator: Separator.COMMA })
            expect(comma).toBeTruthy()
            expect(comma.getLastname()).toEqual('De La Cruz')
        })

        test('should create an instance with titling', () => {
            const uk = new Namefully('Ms Katherine Marie Heigl', { titling: 'uk' })
            expect(uk).toBeTruthy()
            expect(uk.getPrefix()).toEqual('Ms')
            const us = new Namefully('Ms Katherine Marie Heigl', { titling: 'us' })
            expect(us).toBeTruthy()
            expect(us.getPrefix()).toEqual('Ms.')
        })

        test('should create an instance with titling', () => {
            const ending = new Namefully({
                firstname: 'Fabrice',
                lastname: 'Piazza',
                suffix: 'PhD'
            }, { ending: true })
            expect(ending).toBeTruthy()
            expect(ending.getFullname()).toEqual('Fabrice Piazza, PhD')
        })

        test('should create an instance with lastnameFormat', () => {
            const fn = new Firstname('Catherine')
            const ln = new Lastname('Zeta', 'Jones')

            const father = new Namefully([fn, ln], { lastnameFormat: 'father' })
            expect(father).toBeTruthy()
            expect(father.getFullname()).toEqual('Catherine Zeta')

            const mother = new Namefully([fn, ln], { lastnameFormat: 'mother' })
            expect(mother).toBeTruthy()
            expect(mother.getFullname()).toEqual('Catherine Jones')

            const hyphenated = new Namefully([fn, ln], { lastnameFormat: 'hyphenated' })
            expect(hyphenated).toBeTruthy()
            expect(hyphenated.getFullname()).toEqual('Catherine Zeta-Jones')

            const all = new Namefully([fn, ln], { lastnameFormat: 'all'})
            expect(all).toBeTruthy()
            expect(all.getFullname()).toEqual('Catherine Zeta Jones')
        })

        test('should create an instance with bypass', () => {
            const bypass = new Namefully('2Pac Shakur', { bypass: true })
            expect(bypass).toBeTruthy()
            expect(bypass.getFirstname()).toEqual('2Pac')
        })

        test('should create an instance with parser', () => {
            class CustomParser implements Parser<string> {
                constructor(public raw: string) {}
                parse(): Fullname {
                    const [fn, ln] = this.raw.split(';')
                    return {
                        firstname: new Firstname(fn),
                        lastname: new Lastname(ln)
                    }
                }
            }
            const name = new Namefully(null, { parser: new CustomParser('Bernard;Pivot') })
            expect(name).toBeTruthy()
            expect(name.getFirstname()).toEqual('Bernard')
            expect(name.getLastname()).toEqual('Pivot')
        })

        test('should create an instance with multiple options', () => {
            const name = new Namefully('Mr,Gooding,Cuba,Mark,Jr', {
                orderedBy: 'lastname',
                titling: 'us',
                separator: Separator.COMMA,
                ending: true
            })
            expect(name).toBeTruthy()
            expect(name.getFullname()).toEqual('Mr. Gooding Cuba Mark, Jr')
        })
    })

})
