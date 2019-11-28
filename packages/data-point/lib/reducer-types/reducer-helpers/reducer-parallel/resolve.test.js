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

describe("ReducerOmit#resolve", () => {
  test("return empty array when no reducers are provided", async () => {
    const value = [];
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, []);
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toEqual(value);
  });
  test("returns array of length 3 when 3 reducers are provided", async () => {
    const value = {
      a: 1,
      b: 2,
      c: 3
    };
    const accumulator = AccumulatorFactory.create({ value });
    const reducer = Factory.create(Reducer.create, [
      "$a",
      {
        b: "$b"
      },
      ["$c", input => input + 2],
      DataPoint.parallel(["$a", "$b", "$c"])
    ]);
    const result = await Resolve.resolve(
      manager,
      Reducer.resolve,
      accumulator,
      reducer
    );
    expect(result).toEqual([
      1,
      {
        b: 2
      },
      5,
      [1, 2, 3]
    ]);
  });
});
