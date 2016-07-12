'use strict';

import React from 'react';
import {
  requireNativeComponent,
  DeviceEventEmitter,
  View
} from 'react-native';

const SignatureBox = requireNativeComponent('RSSignatureView', null);

var styles = {
  signatureBox: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  }
};

class SignatureCapture extends React.Component {

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
        'onSaveEvent',
        this.props.onSaveEvent
    );
  }

  componentWillUnmount(){
    this.subscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <SignatureBox
          style={styles.signatureBox}
          rotateClockwise={this.props.rotateClockwise}
          square={this.props.square}
        />
      </View>
    )
  }
};

export default SignatureCapture;
