/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';

const name = new Namefully.Base('John Joe Smith');
console.log(`Full name: ${name.getFullname()}`);
console.log(`Initials: ${name.getInitials().join('')}`);
console.log(name.describe());
