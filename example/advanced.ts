import { Name, NameBuilder, Title } from '../src/index';

function main() {
  const builder = NameBuilder.of(Name.first('Nikola'), Name.last('Tesla'));

  // Build the name
  let name = builder.build();
  console.log(name.full); // Nikola Tesla

  // Add a prefix later (lazy build)
  builder.add(Name.prefix('Mr'));

  // Build the name with options if needed
  name = builder.build({ title: Title.US })
  console.log(name.full); // Mr. Nikola Tesla
}

main();
