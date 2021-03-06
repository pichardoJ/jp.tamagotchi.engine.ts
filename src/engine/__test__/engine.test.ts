import * as scope from 'fndi';

import { Engine } from '../engine';

import { Fake } from './script.fake';

const mockFn = jest.fn();

const registration = registry => {
  registry({
    name: 'vm',
    persist: true,
    value: {
      run: mockFn.mockImplementation(code => Fake)
    }
  });
  registry({ type: Engine });
};

describe('Given an Engine When provided with a filename', () => {
  let result: Fake;

  beforeEach(
    scope(registration, async resolve => {
      const sut = resolve(Engine);
      result = await sut.render(__dirname + '/script.fake.ts');
    })
  );

  test('It should return a promised instance of the type defined', () => {
    expect(result).toBeInstanceOf(Fake);
  });
});
