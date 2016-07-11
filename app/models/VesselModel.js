"use strict";
import Validator from '../utils/Validator';
const valid = Validator.valid;

const VesselModel = [
  {id: 'name', defaultValue: "", label: "Name", editorDisplay: {editor: 'vessel', type: 'single'}, valid: valid.anyValue},
  {id: 'registration', defaultValue: "", label: "Registration Number", editorDisplay: {editor: 'vessel', type: 'single'}, valid: valid.anyValue},
  {id: 'id', defaultValue: "", hidden: true},
];

export default VesselModel;
