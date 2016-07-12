'use strict';

const getLabels = (combinedAttributes, model) => {
  return combinedAttributes.map((id) => {
    return model.find((attr) => attr.id == id).label;
  });
};

function findErrors(model, obj) {
  var errors = [];
  let validators = model.filter((a) => !!a.valid);
  validators.forEach((v) => {
    if(!v.valid.func(obj[v.id])){
      errors.push(v.valid.errorMessage || v.id + " invalid");
    }
  });
  return errors;
};

function findCombinedErrors(model, obj) {
  let errors = [];
  model.forEach(({combinedValid}) => {
    if(combinedValid){
      if(!combinedValid.func.func(combinedValid.attributes, obj)){
        var labels = getLabels(combinedValid.attributes, model);
        errors.push(combinedValid.func.errorMessage(labels));
      }
    }
  });
  return errors;
}

function incompleteFishingEvents(fEvents, model){
  return fEvents.filter((f) => findErrors(model, f).length || !f.eventValid);
}

export {findErrors, findCombinedErrors, incompleteFishingEvents}
