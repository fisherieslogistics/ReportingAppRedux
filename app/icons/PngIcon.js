"use strict";

import {
  View,
  Image,
  StyleSheet
} from 'react-native'

import React from 'react';
import colors from '../styles/colors';

const boatLeaving = require("./Boat-Leaving-Port-Filled.png");
const boatReturning = require("./Boat-Returning-To-Port-Filled.png");
const cancel = require("./Cancel.png");
const cancelWhite = require("./Cancel-white.png");
const cancelGray = require("./Cancel-gray.png");
const cancelRed = require("./Cancel-red.png");
const checked = require("./Ok.png");
const checkedGreen = require("./Ok-green.png");
const checkedWhite = require("./Ok-white.png");
const cloudChecked = require("./Cloud-Checked.png");
const cloud = require("./Cloud.png");
const cloudWhite = require("./Cloud-white.png");
const plusGray = require("./Plus-gray.png");
const plusBlue = require("./Plus-blue.png");
const signUp = require("./Sign-Up.png");
const signUpOrange = require("./Sign-Up-orange.png");
const signUpWhite = require("./Sign-Up-white.png");
const signUpBlue = require("./Sign-Up-blue.png");
const signUpGray = require("./Sign-Up-gray.png");
const sailBoatWhite = require("./Sail-Boat-Filled-white.png");
const error = require("./Error.png");
const errorWhite = require("./Error-white.png");
const errorOrange = require("./Error-orange.png");
const user = require("./User.png");
const userWhite = require("./User-white.png");
const userOrange = require("./User-orange.png");
const userGreen = require("./User-green.png");
const userGray = require("./User-gray.png");
const uploadCloudGreen = require("./Upload-Cloud-green.png");
const fish = require("./Fish.png");
const fishOrange = require("./Fish-orange.png");
const fishBlue = require("./Fish-blue.png");
const fishGray = require("./Fish-gray.png");
const fishGreen = require("./Fish-green.png");
const fishing = require("./Fishing.png");
const fishingBlue = require("./Fishing-blue.png");
const fishingWhite = require("./Fishing-white.png");
const waterTransport = require("./Water-Transportation-Filled.png");
const form = require("./Form.png");
const waterTransportLight = require("./Water-Transportation.png");
const wharf = require("./Wharf.png");
const wharfWhite = require("./Wharf-white.png");
const wharfBlue = require("./Wharf-blue.png");
const wharfGray = require("./Wharf-gray.png");

class PngIcon extends React.Component{
  render(){
    return (
      <Image src={this.props.image} />
    );
  }
}

export {
 boatLeaving,
 boatReturning,
 checkedGreen,
 checkedWhite,
 cancelWhite,
 cancelGray,
 cancelRed,
 cloudChecked,
 cloud,
 cloudWhite,
 signUp,
 error,
 plusGray,
 plusBlue,
 errorOrange,
 errorWhite,
 uploadCloudGreen,
 user,
 userWhite,
 userOrange,
 userGray,
 userGreen,
 wharfWhite,
 wharfBlue,
 wharfGray,
 wharf,
 fishing,
 fishingBlue,
 fishingWhite,
 fishBlue,
 fishGray,
 fishGreen,
 sailBoatWhite,
 signUpGray,
 signUpOrange,
 signUpBlue,
 signUpWhite,
 waterTransport,
 form,
 waterTransportLight
}

export default PngIcon;
