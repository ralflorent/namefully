import { Name, NameBuilder, Title, NameOrder } from '../src';

function main() {
  const builder = NameBuilder.of(Name.first('Nikola'), Name.last('Tesla'));

  // Build the name
  const name = builder.build();
  console.log(name.full); // Nikola Tesla

  // Add a prefix
  builder.add(Name.prefix('Mr'));

  // Build the name with options if needed
  console.log(builder.build({ orderedBy: NameOrder.LAST_NAME, title: Title.US }).full); // Mr. Tesla Nikola
}

main();
