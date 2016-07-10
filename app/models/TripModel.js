import Validator from '../utils/Validator';

const tripModel = [
    {id: 'leavingPort', valid: Validator.valid.anyValue, type: 'picker'},
    {id: 'estimatedReturnPort', valid: Validator.valid.anyValue, type: 'picker'},
    {id: 'sailingTime', valid: Validator.valid.anyValue, type: 'datetime'},
    {id: 'ETA', valid: Validator.valid.anyValue, type: 'datetime'},
    {id: 'lastSubmitted', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'datetime', hidden: true},
    {id: 'started', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool', hidden: true},
    {id: 'completed', defaultValue: false, valid: Validator.valid.alwaysValid, type: 'bool', hidden: true},
    {id: 'vesselId', defaultValue: "", valid: Validator.valid.alwaysValid, hidden: true},
];

export default tripModel
