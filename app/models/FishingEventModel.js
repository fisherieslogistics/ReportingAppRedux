import Validator from '../utils/Validator';

const FishingEventModel = [
  {label: 'Number of in Trip', id: 'id', valid: Validator.valid.anyValue,
    type: 'number', readOnly: true,
  },
  {label: 'Target Species', id: 'targetSpecies', valid: Validator.valid.targetProduct,
    type: 'product', defaultValue: "",
    editorDisplay: {editor: 'event', type: 'single'}
  },
  {label: 'Date/Time at Start',  id: 'datetimeAtStart', valid: Validator.valid.anyValue,
    type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtStart", "datetimeAtEnd"],
                    func: Validator.combined.orderedLessThan},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['locationAtStart']}
  },
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: Validator.valid.anyValue,
    type: 'datetime', defaultValue: null,
    combinedValid: {attributes: ["datetimeAtEnd", "datetimeAtStart"],
                    func: Validator.combined.orderedGreaterThan},
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['locationAtEnd'], hideNull: true}
  },
  {label: 'Location at Start', id: 'locationAtStart', valid: Validator.valid.anyValue,
   type: 'location', defaultValue: {}, hidden: true,
  },
  {label: 'Location at End', id: 'locationAtEnd', valid: Validator.valid.anyValue,
   type: 'location', readOnly: true, defaultValue: {},
  },
  {label: 'Products Valid', id: 'productsValid', valid: Validator.valid.alwaysValid,
   defaultValue: false,
  },
  {label: 'products', id: 'products', valid: Validator.valid.alwaysValid,
   defaultValue: [],
  },
];

export default FishingEventModel;
