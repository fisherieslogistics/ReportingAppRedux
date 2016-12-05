import Validator from '../utils/Validator';
const valid = Validator.valid;
const FishingEventModel = [
  {label: 'Number of in Trip', id: 'id', valid: valid.anyValue,
    type: 'number', readOnly: true,
  },
  {label: 'Target Species', id: 'targetSpecies', valid: valid.targetProduct,
    type: 'product', defaultValue: "",
    editorDisplay: {editor: 'event', type: 'combined', siblings: ['bottomDepth']}
  },
  {label: 'Date/Time at Start',  id: 'datetimeAtStart', valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {attributes: ["datetimeAtStart", "datetimeAtEnd"],
                    func: Validator.combined.orderedLessThan},
    //editorDisplay: {editor: 'event', type: 'combined', siblings: [/*'locationAtStart'*/]}
  },
  {label: 'Date/Time at End',    id: 'datetimeAtEnd',      valid: valid.anyValue,
    type: 'datetime',
    combinedValid: {attributes: ["datetimeAtEnd", "datetimeAtStart"],
                    func: Validator.combined.orderedGreaterThan},
    //editorDisplay: {editor: 'event', type: 'combined', siblings: ['locationAtEnd'], hideUndefined: true}
  },
  {label: 'Location at Start', id: 'locationAtStart', valid: valid.anyValue,
   type: 'location', defaultValue: {}, hidden: true,
  },
  {label: 'Location at End', id: 'locationAtEnd', valid: valid.anyValue,
   type: 'location', readOnly: true, defaultValue: {},  hidden: true,
  },
  {label: 'Products Valid', id: 'eventValid', valid: valid.alwaysValid,
   defaultValue: false,
  },
  {label: 'products', id: 'products', valid: valid.alwaysValid,
   defaultValue: [],
  },
  {label: 'formType', id: 'formType', valid: valid.alwaysValid,
  },
  {id: 'signature', valid: valid.alwaysValid, defaultValue: false, hidden: true},
  {id: 'dateSigned', valid: valid.alwaysValid, defaultValue: false, hidden: true},
  {id: 'committed', valid: valid.alwaysValid, defaultValue: false, hidden: true},
  {id: 'discards', valid: valid.alwaysValid, defaultValue: [], hidden: true},
  {id: 'protecteds', valid: valid.alwaysValid, defaultValue: [], hidden: true},
  {id: 'incidents', valid: valid.alwaysValid, defaultValue: [], hidden: true},
  {label: 'Bottom Depth', id: 'bottomDepth', valid: valid.greaterThanZero, type: 'number',
    unit: 'm',
  },
];

export default FishingEventModel;
