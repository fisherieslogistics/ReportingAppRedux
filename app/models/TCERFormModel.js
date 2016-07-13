import {firstEventValue} from '../utils/FormUtils';
import TCERFishingEventModel from './TCERFishingEventModel';
import Helper from '../utils/Helper';
const helper = new Helper();

const meta = {
  formCode: 'tcer',
  compatible: (event1, event2) => {
    let daysMatch = (event1.datetimeAtStart.diff(event2.datetimeAtStart, 'days') === 0);
    let wingSpreadsMatch = (event2.wingSpread == event1.wingSpread);
    let headlineHeightsMatch = (event2.headlineHeight == event1.headlineHeight);
    let signaturesMatch =(event2.signature === event1.signature);
    return (daysMatch && wingSpreadsMatch && headlineHeightsMatch && signaturesMatch);
  },
  eventsPerForm: 4,
  xMultiplier: 214 * 0.660,
  printMapping: {
    form:{
      gearCode: {x: 190, y: 50},
      wingSpread: {x: 378, y: 50, resolve: form => form.fishingEvents[0].wingSpread || ""},
      headlineHeight: {x: 650, y: 50, resolve: form => form.fishingEvents[0].headlineHeight || "",
                                                        textStyle: {textAlign: 'right'}},
      permitHolderName: {x: 100, y: 628, resolveFrom: 'user', resolve: u => u.permitHolderName},
      vesselName: {x: 424, y: 628, resolveFrom: 'vessel', resolve: v => v.name},
      vesselNumber: {x: 555, y: 662, resolveFrom: 'vessel', resolve: v => v.registration},
      permitHolderNumber: {x: 216, y: 662, resolveFrom: 'user', resolve: u => u.permitHolderNumber},
      fisherName: {x: 249, y: 694, resolveFrom: 'user', resolve: u => u.firstName[0] + "." + u.lastName.slice(0, 4)},
    },
    fishingEvents: {
      shotNumber: {x: 220, y: 85},
      targetSpecies: {x: 310, y: 85},
      bottomDepth: {x: 218, y: 227, resolve: (fe) => isNaN(parseInt(fe.bottomDepth)) ? "" : parseInt(fe.bottomDepth)},
      groundropeDepth: {x: 282, y: 227, resolve: fe => isNaN(parseInt(fe.groundropeDepth)) ? "" : parseInt(fe.groundropeDepth)},
      nonFishProtected: {x: 195, y: 312, resolve: fe => fe.nonFishProtected ? "X" : "           X"},
      averageSpeed: {x: 173, y: 258, align: 'right', resolve: fe => isNaN(parseFloat(fe.averageSpeed)) ? "" : parseFloat(fe.averageSpeed).toFixed(1)},
      targetSpecies: {x: 310, y: 85},
      locationAtStart: {
        multiple: true,
        parts:[
          {id: 'lat', x: 190, y: 175, resolve: (fe) => {
            let lat = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "42 34"//`${lat.latDegrees}${lat.latMinutes}`;
          }},
          {id: 'lon', x: 197, y: 204, resolve: (fe) => {
            let lon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "172 31"//`${lon.lonDegrees}${lon.lonMinutes}`;
          }},
          {id: 'ew', x: 310, y: 204, resolve: (fe) => {
            let latLon = helper.getDegreesMinutesFromLocation(fe.locationAtStart);
            return "E"//latLon.ew;
          }}
        ]
      },
      datetimeAtStart: {
        multiple: true,
        parts: [
          {x: 188, y: 115, resolve: (fe) => {
            return fe.datetimeAtStart.format("DD   MM    YYYY");
          }},
          {x: 184, y: 140, resolve: (fe) => {
            return fe.datetimeAtStart.format("HH   mm");
          }}
        ]
      },
      datetimeAtEnd: {
        resolve: (fe) => {
          return fe.datetimeAtEnd ? fe.datetimeAtEnd.format("HH   mm") : "";
        },
        x: 180, y: 282
      },
      products: {
        multiple: true,
        repeating: true,
        prep: (products) => {
          let totals = helper.getTotals([...products]).slice(0, 8);
          return totals;
        },
        parts: [
          {
            id: 'code',
            resolve: (fe, i) => {
              return fe.products[i] ? fe.products[i].code : "";
            },
            x: 172,
            y: 342,
            ymultiple: 20
          },
          {
            id: 'weight',
            resolve: (fe, i) => {
              return fe.products[i] ? fe.products[i].weight : "";
            },
            x: 244,
            y: 342 ,
            ymultiple: 20
          },
        ]
      },
      otherSpeciesWeight: {id: 'products', resolve: (fe) => {
        return helper.getUncountedWeight(fe.products, 8);
      }, x: 244, y: 572}
    }
  }
}

const TCERFormModel = [
    {id: 'meta', defaultValue: meta},
    {id: 'wingSpread', type: 'number'},
    {id: 'headlineHeight', type: 'number'},
    {id: 'fisherName'},
    {id: 'firstName'},
    {id: 'lastName'},
    {id: 'gearCode', defaultValue: 'BT'},
    {id: 'permitHolderName'},
    {id: 'vesselName'},
    {id: 'vesseNumber'},
    {id: 'permitHolderNumber'},
    {id: 'fisherName'},
];
export {meta}
export default TCERFormModel;
