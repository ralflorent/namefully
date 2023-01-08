import { Namefully } from '../src/index'

function example() {
    // Gives a simple name some super power.
    const name = new Namefully('Thomas Alva Edison')

    // Gets the count of characters, including space.
    console.log(name.length) // 18

    // Gets the first name.
    console.log(name.first) // Thomas

    // Gets the first middle name.
    console.log(name.middle) // Alva

    // Gets the last name.
    console.log(name.last) // Edison

    // Controls what the public sees.
    console.log(name.public) // Thomas E

    // Gets all the initials.
    console.log(name.initials()) // ['T', 'A', 'E']

    // Formats it as desired.
    console.log(name.format('L, f m')) // EDISON, Thomas Alva

    // Makes it short.
    console.log(name.shorten()) // Thomas Edison

    // Makes it flat.
    console.log(name.zip()) // Thomas A. E.

    // Makes it uppercase.
    console.log(name.toUpperCase()) // THOMAS ALVA EDISON

    // Transforms it into dot.case.
    console.log(name.toDotCase()) // thomas.alva.edison
}

example()
