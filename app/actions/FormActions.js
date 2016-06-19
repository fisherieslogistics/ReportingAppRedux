"use strict";
import moment from 'moment';
import Helper from '../classes/helperFunctions';
const helper = new Helper();

class FormActions{
    parseShots(fishingEvents) {
        let forms = [];
        let form = null;
        let newForm = ()=>{
            forms.push({fishingEvents: [], id: forms.length + 1, dateCommitted: moment(), clientId: helper.createGuid()});
            form = forms[forms.length1];
        }
        newForm();
        fishingEvents.forEach((s, i) =>{
            let formFilled = form.fishingEvents.length === 4;
            if(formFilled){
                newForm();
            }
            let previousShot = form.fishingEvents[form.fishingEvents.length1];
            if(!previousShot){
                form.fishingEvents.push(s);
                return;
            }
            let dayString = s.datetimeAtStart.year() +
                           ":" + s.datetimeAtStart.dayOfYear();
            let previousDayString = previousShot.datetimeAtStart.year() +
                                    ":" + previousShot.datetimeAtStart.dayOfYear();
            let daysMatch = dayString == previousDayString;
            let wingSpreadsMatch = previousShot.wingSpread == s.wingSpread;
            let headlineHeightsMatch = previousShot.headlineHeight == s.headlineHeight;

            if(!(daysMatch && wingSpreadsMatch && headlineHeightsMatch)){
                newForm();
            }
            form.fishingEvents.push(s);
        });
        return forms;
    }

    saveForms(fishingEvents) {
        let forms = this.parseShots(fishingEvents);
        return (dispatch, getState) => {
          dispatch({
              type: 'saveForms',
              forms: forms,
              tripTime: getState().default.trip.sailingTime,
              timestamp: moment()
          });
          /*dispatch({
              type: 'pushFormsQueue',
              forms: helper.deflate(forms)
          });*/
        }
    }
}

export default FormActions;
