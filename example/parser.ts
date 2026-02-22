import namefully, { Config, FullName, Parser } from 'namefully';

class CustomParser extends Parser<string> {
  constructor(
    raw: string,
    public separator = '|',
  ) {
    super(raw);
  }

  parse(options: Partial<Config>): FullName {
    const [fn, ln] = this.raw.split(this.separator, 2);
    return new FullName(options).setFirstName(fn.trim()).setLastName(ln.trim());
  }
}

function main() {
  const name = namefully(new CustomParser('Juan | García | Jr.'));
  console.log(name.full); // Juan García
  console.log(name.first); // Juan
  console.log(name.initials()); // ['J', 'G']
  console.log(name.format('L, f m')); // García, Juan
  console.log(name.size); // 2
  console.log(name.zip()); // Juan G.
  console.log(name.toUpperCase()); // JUAN GARCÍA
}

main();
