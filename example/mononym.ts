import namefully from 'namefully';

function main() {
  const name = namefully('Plato', { mono: true });
  console.log(name.length); // 5
  console.log(name.first); // Plato
  console.log(name.middle); // undefined
  console.log(name.last); // <ZWSP>
  console.log(name.public); // Plato
  console.log(name.initials()); // ['P']
  console.log(name.format('L, f m')); // <ZWSP>, Plato
  console.log(name.shorten()); // Plato
  console.log(name.zip()); // P.
  console.log(name.toUpperCase()); // PLATO
}

main();
