/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';

const name = new Namefully('Joe Smith');
console.log(`Initials of ${name.fullname}: ${name.initials().join('')}`);
console.log(name.describe());
