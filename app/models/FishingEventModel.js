import Validator from '../utils/Validator';
const valid = Validator.valid;
const FishingEventModel = [
  {label: 'Number of in Trip', id: 'id', valid: valid.anyValue,
    type: 'number',
  },
  { id: 'targetSpecies', valid: valid.targetProduct,
    'label': 'Target Species',
    type: 'picker', defaultValue: "",
    display: { type: 'combined', siblings: ['bottomDepth']},
    repeating: true,
  },
  {label: 'Date/Time at Start',  id: 'datetimeAtStart', valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {attributes: ["datetimeAtStart", "datetimeAtEnd"],
                    func: Validator.combined.orderedLessThan},
    display: { type: 'combined', siblings: ['locationAtStart']},
    optionalRender: true,
  },
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {attributes: ["datetimeAtEnd", "datetimeAtStart"],
                    func: Validator.combined.orderedGreaterThan},
    display: { type: 'combined', siblings: ['locationAtEnd'], hideUndefined: true },
    optionalRender: true, displayStage: 'Haul',
  },
  {
    label: 'Location at Start', id: 'locationAtStart', valid: valid.anyValue, type: 'location', defaultValue: {},
    display: { type: 'child' },
    optionalRender: true
  },
  {
    label: 'Location at End', id: 'locationAtEnd', valid: valid.anyValue, type: 'location', defaultValue: {},
    display: { type: 'child' },
    optionalRender: true, displayStage: 'Haul',
  },
  {
    label: 'Bottom / Groundrope Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number', unit: 'm', defaultValue: 0,
    display: { type: 'child' },
  },
  {
    label: 'Products Valid', id: 'eventValid', valid: valid.alwaysValid,
    defaultValue: false,
  },
  {
    label: 'products', id: 'products', valid: valid.alwaysValid,
    defaultValue: [],
  },
  {id: 'signature', valid: valid.alwaysValid, defaultValue: false},
  {id: 'dateSigned', valid: valid.alwaysValid, defaultValue: false},
  {id: 'committed', valid: valid.alwaysValid, defaultValue: false},
  {id: 'discards', valid: valid.alwaysValid, defaultValue: []},
  {id: 'protecteds', valid: valid.alwaysValid, defaultValue: []},
  {id: 'incidents', valid: valid.alwaysValid, defaultValue: []},
];

export default FishingEventModel;
