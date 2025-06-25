import { NameBuilder } from './builder.js';
import { NameError } from './error.js';
import { Name } from './name.js';

describe('NameBuilder', () => {
  let names: Name[];
  let middles: Name[];

  beforeEach(() => {
    names = [Name.first('John'), Name.last('Smith')];
    middles = [Name.middle('Ben'), Name.middle('Carl')];
  });

  test('should build a name with first and last name', () => {
    expect(NameBuilder.of(...names).build().full).toBe('John Smith');
  });

  test('should handle lifecycle hooks', () => {
    let prebuildCalled = false,
      postbuildCalled = false,
      preclearCalled = false,
      postclearCalled = false;

    const builder = NameBuilder.use({
      prebuild: () => (prebuildCalled = true),
      postbuild: (n) => {
        postbuildCalled = true;
        expect(n.full).toBe('John Carl Smith');
      },
      preclear: (n) => {
        preclearCalled = true;
        expect(n.full).toBe('John Carl Smith');
      },
      postclear: () => (postclearCalled = true),
    });

    builder.add(...names);
    builder.add(middles[1]);
    expect(builder.size).toBe(3); // 3 name parts

    builder.build();
    expect(prebuildCalled).toBe(true);
    expect(postbuildCalled).toBe(true);

    builder.clear();
    expect(preclearCalled).toBe(true);
    expect(postclearCalled).toBe(true);
  });

  test('should add first name correctly', () => {
    const builder = NameBuilder.create();
    builder.add(...names);
    builder.addFirst(middles[0]);
    expect(builder.build().full).toBe('John Ben Smith');
  });

  test('should remove first name correctly', () => {
    const builder = NameBuilder.create();
    builder.add(...names);
    builder.addFirst(middles[0]);
    builder.removeFirst();
    expect(builder.build().full).toBe('John Smith');
  });

  test('should remove last name and add new last name', () => {
    const builder = NameBuilder.create();
    builder.add(...names);
    builder.removeLast();
    builder.addLast(Name.last('Doe'));
    builder.add(...middles);
    expect(builder.build().full).toBe('John Ben Carl Doe');
  });

  test('should remove specific name and retain only non-middle names', () => {
    const builder = NameBuilder.create();
    builder.add(...names);
    builder.add(...middles);
    builder.remove(names[0]);
    builder.retainWhere((name) => !name.isMiddleName);
    builder.add(Name.first('Jack'));
    expect(builder.build().full).toBe('Jack Smith');
  });

  test('should add and remove middle names', () => {
    const builder = NameBuilder.create();
    builder.add(...names);
    builder.add(...middles);
    expect(builder.build().full).toBe('John Ben Carl Smith');

    builder.removeWhere((name) => name.isMiddleName);
    expect(builder.build().full).toBe('John Smith');
  });

  test('should throw error when building empty name', () => {
    const builder = NameBuilder.create();
    builder.clear();
    expect(() => builder.build()).toThrow(NameError);
  });
});
