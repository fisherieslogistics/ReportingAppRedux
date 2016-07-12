'use strict';
import {
  requireNativeComponent,
  DeviceEventEmitter,
  View
} from 'react-native';

import React from 'react';

const SignatureComponent = requireNativeComponent('RSSignatureView', null);

var styles = {
  signatureBox: {
    flex: 0.7
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  }
};

class Signature extends React.Component {
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
        'onSaveEvent',
        this.props.onSaveEvent
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <SignatureComponent
          style={styles.signatureBox}
          rotateClockwise={this.props.rotateClockwise}
          square={this.props.square}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          viewMode={"landscape"}
        />
      </View>
    )
  }
}

export default Signature
