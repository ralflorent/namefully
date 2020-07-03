/**
 * Constants for the use cases
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Config, Nama, Name, Firstname, Lastname, Separator } from '../src/index'

export const nameCases = [
    ['Daniel', 'Michael Blake', 'Day-Lewis'],
    // ['Emilia', 'Isobel Euphemia Rose', 'Clarke'],
    // ['Kiefer', 'William Frederick Dempsey George Rufus', 'Sutherland'],
    // ['Benicio', 'Monserrate Rafael del Toro', 'Sanchez'],
    // [`Ella`, 'Marija Lani', `Yelich-O'Connor`], // Lorde
    // ['Johannes', 'Chrysostomus Wolfgangus Theophilus', 'Mozart'],
    // ['Gari', 'Jose Ciodaro', 'Guerra'],
]

export interface UseCase {
    raw: string | string[] | Name[] | Nama
    options: Partial<Config>
}

export const USECASES: UseCase[] = [
    {
        raw: 'Keira Knightley',
        options: {},
    },
    {
        raw: 'George Walker Bush',
        options: {},
    },
    {
        raw: { prefix: 'Dr', firstname: 'Albert', lastname: 'Einstein' },
        options: { titling: 'us' }
    },
    {
        raw: 'Thiago, Da Silva',
        options: { separator: Separator.COMMA }
    },
    {
        raw: [ new Firstname('Shakira', 'Isabel'), new Lastname('Mebarak', 'Ripoll') ],
        options: { lastnameFormat: 'mother' }
    },
]