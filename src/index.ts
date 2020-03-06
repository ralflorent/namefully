/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';
const a = {
    firstname: 'Ralph',
    middlename: 'Junior',
    lastname: 'Florent',
}
const b = ['Ralph', 'Junior', 'Florent']
const c = 'Ralph Junior Florent'
const name = new Namefully(c);
console.log(`Full name: ${name.getFullname()}`);
console.log(`First name: ${name.getFirstname()}`);
console.log(`Last name: ${name.getLastname()}`);
console.log(`Middle name: ${name.getMiddlenames()}`);
console.log(`Initials: ${name.getInitials().join('')}`);
console.log(`Compressed by middlename: ${name.compress(20, 'middlename')}`);
console.log(`Formatting: ${name.format('L, f m')}`);