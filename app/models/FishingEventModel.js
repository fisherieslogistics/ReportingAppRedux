import Validator from '../utils/Validator';
const valid = Validator.valid;
const FishingEventModel = [
  {label: 'Number of in Trip', id: 'id', valid: valid.anyValue,
    type: 'number', readOnly: true,
  },
  {label: 'Target Species', id: 'targetSpecies', valid: valid.targetProduct,
    type: 'product', defaultValue: "",
    editorDisplay: {editor: 'event', type: 'single'}
  },
  {label: 'Date/Time at Start',  id: 'datetimeAtStart', valid: valid.anyValue,
    type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtStart", "datetimeAtEnd"],
                    func: Validator.combined.orderedLessThan},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['locationAtStart']}
  },
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: valid.anyValue,
    type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtEnd", "datetimeAtStart"],
                    func: Validator.combined.orderedGreaterThan},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['locationAtEnd'], hideNull: true}
  },
  {label: 'Location at Start', id: 'locationAtStart', valid: valid.anyValue,
   type: 'location', defaultValue: {}, hidden: true,
  },
  {label: 'Location at End', id: 'locationAtEnd', valid: valid.anyValue,
   type: 'location', readOnly: true, defaultValue: {},
  },
  {label: 'Products Valid', id: 'productsValid', valid: valid.alwaysValid,
   defaultValue: false,
  },
  {label: 'products', id: 'products', valid: valid.alwaysValid,
   defaultValue: [],
  },
  {label: 'formType', id: 'formType', valid: valid.alwaysValid,
   defaultValue: null,
  },
  {label: 'Non Fish Protected Species',  id: 'nonFishProtected', valid: valid.alwaysValid, defaultValue: false, type: 'bool',
    editorDisplay: {editor: 'event', type: 'single'}
  },
];

export default FishingEventModel;
