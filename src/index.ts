/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';

const name = new Namefully('Ralph Junior Florent');
// console.log(`Full name: ${name.getFullname()}`);
// console.log(`First name: ${name.getFirstname()}`);
// console.log(`Last name: ${name.getLastname()}`);
// console.log(`Middle names: ${name.getMiddlenames()}`);
// console.log(`Initials: ${name.getInitials().join('')}`);
// console.log(`Compressed by firstname: ${name.compress(10, 'firstname')}`);
// console.log(`Compressed by lastname: ${name.compress(10, 'lastname')}`);
// console.log(`Compressed by middlename: ${name.compress(10, 'middlename')}`);
// console.log(`Compressed by firstmid: ${name.compress(10, 'firstmid')}`);
// console.log(`Compressed by midlast: ${name.compress(10, 'midlast')}`);
console.log(name.format('L, f m')); // FLORENT, Ralph Junior
console.log(name.format('O'));  // FLORENT, Ralph Junior
