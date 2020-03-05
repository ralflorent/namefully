/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';

const name = new Namefully('John Joe Smith');
console.log(`Full name: ${name.getFullname()}`);
console.log(`First name: ${name.getFirstname()}`);
console.log(`Last name: ${name.getLastname()}`);
console.log(`Middle names: ${name.getMiddlenames()}`);
console.log(`Initials: ${name.getInitials().join('')}`);
console.log(name.describe());
