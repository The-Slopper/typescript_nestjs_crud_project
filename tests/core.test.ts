import { strict as assert } from 'assert';

function add(a: number, b: number): number {
  return a + b;
}

describe('core', () => {
  it('adds two numbers', () => {
    assert.equal(add(2, 2), 4);
  });

  it('is stable', () => {
    assert.ok(add(1, 1) === 2);
  });

  it('covers negatives', () => {
    assert.equal(add(-1, -1), -2);
  });
});
