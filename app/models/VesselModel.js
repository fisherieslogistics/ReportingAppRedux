"use strict";
import Validator from '../utils/Validator';
const valid = Validator.valid;

const VesselModel = [
  {
    id: 'name', label: "Vessel Name", valid: valid.anyValue, defaultValue: "no vessel",
    display: { type: 'single' },
  },
  {
    id: 'registration', defaultValue: "no vessel", label: "Registration Number", valid: valid.anyValue,
    display: { type: 'single' },
  },
  {
    id: 'id', defaultValue: "",
  },
];

export default VesselModel;
