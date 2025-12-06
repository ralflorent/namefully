import { Parser } from '../parser.js';
import { FullName } from '../fullname.js';
import { Namefully } from '../namefully.js';
import { IConfig, Config } from '../config.js';
import { FirstName, LastName, Name, JsonName } from '../name.js';

export class SimpleParser extends Parser<string> {
  parse(options: IConfig): FullName {
    const [firstName, lastName] = this.raw.split('#');
    return FullName.parse({ firstName, lastName }, Config.merge(options));
  }
}

export function findNameCase(name: string): Namefully {
  const nameCase = NAME_CASES[name];
  return new Namefully(nameCase.name, nameCase.options);
}

interface NameCase {
  name: string | string[] | Name[] | JsonName;
  options: IConfig;
}

const NAME_CASES: { [key: string]: NameCase } = {
  simpleName: { name: 'John Smith', options: Config.create('simpleName') },
  byLastName: { name: 'Obama Barack', options: Config.merge({ name: 'byLastName', orderedBy: 'lastname' }) },
  manyFirstNames: {
    name: [new FirstName('Daniel', 'Michael', 'Blake'), new LastName('Day-Lewis')],
    options: Config.create('manyFirstNames'),
  },
  manyMiddleNames: {
    name: [
      new FirstName('Emilia'),
      Name.middle('Isobel'),
      Name.middle('Euphemia'),
      Name.middle('Rose'),
      new LastName('Clarke'),
    ],
    options: Config.create('manyMiddleNames'),
  },
  manyLastNames: {
    name: [new FirstName('Shakira', 'Isabel'), new LastName('Mebarak', 'Ripoll')],
    options: Config.merge({ name: 'manyLastNames', surname: 'mother' }),
  },
  withTitling: {
    name: { prefix: 'Dr', firstName: 'Albert', lastName: 'Einstein' },
    options: Config.merge({ name: 'withTitling', title: 'period' }),
  },
  withEnding: {
    name: { firstName: 'Fabrice', lastName: 'Piazza', suffix: 'Ph.D' },
    options: Config.merge({ name: 'withEnding', ending: true }),
  },
  withSeparator: {
    name: 'Thiago, Da Silva',
    options: Config.merge({ name: 'withSeparator', separator: ',' }),
  },
  noBypass: {
    name: {
      prefix: 'Mme',
      firstName: 'Marine',
      lastName: 'Le Pen',
      suffix: 'M.Sc.',
    },
    options: Config.merge({
      name: 'noBypass',
      bypass: false,
      ending: true,
      title: 'us',
    }),
  },
};
