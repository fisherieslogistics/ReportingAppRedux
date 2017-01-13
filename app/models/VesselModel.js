"use strict";
import Validator from '../utils/Validator';
const valid = Validator.valid;

const VesselModel = [
  {
    id: 'name', defaultValue: "", label: "Name", valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    id: 'registration', defaultValue: "", label: "Registration Number", valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    id: 'id', defaultValue: "",
  },
];

export default VesselModel;
