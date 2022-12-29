import { FirstName, LastName, Name } from '../src/name'
import { FullName } from '../src/full-name'
import { Config } from '../src/config'
import { Namon } from '../src/types'
import { NameError } from '../src/error'

describe('FullName', () => {
    let prefix: Name
    let firstName: FirstName
    let middleName: Name[]
    let lastName: LastName
    let suffix: Name
    let fullName: FullName

    beforeEach(() => {
        prefix = Name.prefix('Mr')
        firstName = new FirstName('John')
        middleName = [Name.middle('Ben'), Name.middle('Carl')]
        lastName = new LastName('Smith')
        suffix = Name.suffix('Ph.D')
    })

    test('creates a full name from a json name', () => {
        expect(() => FullName.parse({ firstName: 'J', lastName: 'Smith' })).toThrow(NameError)
        fullName = FullName.parse({
            prefix: 'Mr',
            firstName: 'John',
            middleName: ['Ben', 'Carl'],
            lastName: 'Smith',
            suffix: 'Ph.D',
        })

        runExpectations(fullName)
    })

    test('builds a full name as it goes', () => {
        fullName = new FullName()
            .setPrefix(prefix)
            .setFirstName(firstName)
            .setMiddleName(middleName)
            .setLastName(lastName)
            .setSuffix(suffix)

        runExpectations(fullName)
    })

    test('builds a full name with no validation rules', () => {
        fullName = new FullName(Config.merge({ name: 'withBypass', bypass: true }))
            .setFirstName(new FirstName('2Pac'))
            .setLastName(new LastName('Shakur'))

        expect(fullName.firstName).toBeInstanceOf(FirstName)
        expect(fullName.lastName).toBeInstanceOf(LastName)
        expect(fullName.firstName.toString()).toBe('2Pac')
        expect(fullName.lastName.toString()).toBe('Shakur')
        expect(fullName.config).toBeDefined()
        expect(fullName.config.name).toBe('withBypass')
    })

    test('creates a full name as it goes from raw strings', () => {
        fullName = new FullName()
            .setPrefix('Mr')
            .setFirstName('John')
            .setMiddleName(['Ben', 'Carl'])
            .setLastName('Smith')
            .setSuffix('Ph.D')

        runExpectations(fullName)
    })

    test('.has() indicates whether a full name has a specific namon', () => {
        fullName = new FullName().setPrefix('Ms').setFirstName('Jane').setLastName('Doe')

        expect(fullName.has(Namon.PREFIX)).toBe(true)
        expect(fullName.has(Namon.FIRST_NAME)).toBe(true)
        expect(fullName.has(Namon.MIDDLE_NAME)).toBe(false)
        expect(fullName.has(Namon.LAST_NAME)).toBe(true)
        expect(fullName.has(Namon.SUFFIX)).toBe(false)
    })
})

function runExpectations(fullName: FullName) {
    expect(fullName.prefix).toBeInstanceOf(Name)
    expect(fullName.firstName).toBeInstanceOf(FirstName)
    fullName.middleName.forEach((name) => expect(name).toBeInstanceOf(Name))
    expect(fullName.lastName).toBeInstanceOf(LastName)
    expect(fullName.suffix).toBeInstanceOf(Name)

    expect(fullName.prefix?.toString()).toBe('Mr')
    expect(fullName.firstName.toString()).toBe('John')
    expect(fullName.middleName.map((n) => n.toString()).join(' ')).toBe('Ben Carl')
    expect(fullName.lastName.toString()).toBe('Smith')
    expect(fullName.suffix?.toString()).toBe('Ph.D')
}
