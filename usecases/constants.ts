/**
 * Constants for the use cases
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Config, Nama, Name, Firstname, Lastname, Separator, Namon } from '../src/index';

export interface NameCase {
    raw: string | string[] | Name[] | Nama
    options: Partial<Config>
}

export const NAMECASES: NameCase[] = [
    {
        raw: 'Keira Knightley',
        options: {},
    },
    {
        raw: ['George', 'Walker', 'Bush'],
        options: {},
    },
    {
        raw: [
            new Firstname('Emilia'),
            new Name('Isobel', Namon.MIDDLE_NAME),
            new Name('Euphemia', Namon.MIDDLE_NAME),
            new Name('Rose', Namon.MIDDLE_NAME),
            new Lastname('Clarke')
        ],
        options: {}
    },
    {
        raw: [
            new Firstname('Daniel', 'Michael', 'Blake'),
            new Lastname('Day-Lewis')
        ],
        options: {}
    },
    {
        raw: 'Obama Barack',
        options: {  orderedBy: 'lastname' }
    },
    {
        raw: { prefix: 'Dr', firstname: 'Albert', lastname: 'Einstein' },
        options: { titling: 'us' }
    },
    {
        raw: { firstname: 'Fabrice', lastname: 'Piazza', suffix: 'PhD' },
        options: { ending: true }
    },
    {
        raw: 'Thiago, Da Silva',
        options: { separator: Separator.COMMA }
    },
    {
        raw: [ new Firstname('Shakira', 'Isabel'), new Lastname('Mebarak', 'Ripoll') ],
        options: { lastnameFormat: 'mother' }
    },
    {
        raw: { prefix: 'Mme', firstname: 'Marine', lastname: 'Le Pen', suffix: 'M.Sc.' },
        options: { bypass: true, ending: true, titling: 'us' }
    },
]
