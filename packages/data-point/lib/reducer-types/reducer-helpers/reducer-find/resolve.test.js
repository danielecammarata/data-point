/* eslint-env jest */

const Factory = require("./factory");
const Resolve = require("./resolve");

const Reducer = require("../../index");

const DataPoint = require("../../../index");

const AccumulatorFactory = require("../../../accumulator/factory");

let manager;

beforeAll(() => {
  manager = DataPoint.create();
});

describe("ReducerFind#resolve", () => {
  test("It should return undefined when input is an empty array", async () => {
    const value = [];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, []);
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toBeUndefined();
  });

  test("It should find a matching object", async () => {
    const value = [
      {
        a: 1
      },
      {
        a: 2
      }
    ];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, ["$a", a => a > 1]);
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toEqual({
      a: 2
    });
  });

  test("it should find a matching item that's falsy", async () => {
    const value = [0, 1, 2];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, input => input === 0);
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toBe(0);
  });

  test("It should return undefined when no match is found", async () => {
    const value = [
      {
        a: 1
      },
      {
        a: 2
      }
    ];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, "$c");
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toBeUndefined();
  });
});

describe("ReducerFind#resolve with reducer objects", () => {
  test("it should not find a match when keys are null or undefined", async () => {
    const value = [
      {
        a: undefined,
        b: undefined
      },
      {
        a: null,
        b: null
      }
    ];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, {
      a: "$a",
      b: "$b"
    });
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toBeUndefined();
  });

  test("it should match the item with truthy keys", async () => {
    const value = [
      {
        a: true,
        b: undefined
      },
      {
        a: true,
        b: ""
      },
      {
        a: null,
        b: true
      },
      {
        a: "a truthy string",
        b: true
      }
    ];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, {
      a: "$a",
      b: "$b"
    });
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toEqual(value[3]);
  });
});
