const Ajv = require("ajv");
const _ = require("lodash");
const deepFreeze = require("deep-freeze");
const { resolve } = require("./resolve");
const BaseEntity = require("../base-entity");
const { validateModifiers } = require("../validate-modifiers");

/**
 * @param {Object} schema
 * @param {Object} options
 * @throws if schema is not a valid ajv schema
 * @return {boolean}
 */
function validateSchema(schema, options) {
  const ajv = new Ajv(options);
  ajv.validateSchema(schema);
  if (ajv.errors) {
    const msg = `Schema validation failed with the following errors:\n${JSON.stringify(
      ajv.errors,
      null,
      2
    )}`;
    throw new Error(msg);
  }

  return true;
}

module.exports.validateSchema = validateSchema;

/**
 * Creates new Entity Object
 * @param {Object} spec - spec
 * @param {string} id - Entity id
 * @throws if spec.schema is not a valid ajv schema
 * @return {Object} Entity Object
 */
function create(id, spec) {
  validateModifiers(id, spec, ["schema", "options"]);

  const entity = {};
  entity.spec = spec;
  entity.schema = deepFreeze(_.defaultTo(spec.schema, {}));
  entity.options = deepFreeze(_.defaultTo(spec.options, {}));

  validateSchema(entity.schema, entity.options);
  return entity;
}

module.exports.create = BaseEntity.create("schema", create, resolve);
