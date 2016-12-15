'use strict';
import {
  View,
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';

import MasterDetailView from './layout/MasterDetailView';
import Icon8 from '../components/common/Icon8';
import { colors, iconStyles } from '../styles/styles';
import { MasterToolbar } from './layout/Toolbar';
import { BigButton } from './common/Buttons';

class Chat extends MasterDetailView {
  constructor (props){
    super(props);
    this.state = {
      selectedDetail: props.contacts[0],
      masterChoices: props.contacts,
    };
  }

  renderMasterToolbar() {
    const backgroundColor = colors.backgrounds.blue;
    const text = "Chat";
    const textColor = colors.white;

    const button = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

  renderMasterIcon(choice){
    const isSelected = this.isDetailSelected(choice);
    let backgroundStyle = { backgroundColor: colors.blue, color: colors.white };
    if(isSelected){
      backgroundStyle = { backgroundColor: colors.white, color: colors.blue };
    }
    return (
      <Icon8
        name={"user"}
        size={30}
        color={colors.white}
        style={[ iconStyles, backgroundStyle ]}
      />
    );
  }

  renderDetailView() {
    return (
      <View />
    )
  }

}

const select = (State) => {
  const state = State.default;
  return {
    user: state.me.user,
    contacts: [
      'Atlantis',
      'Venture',
      'Columbia',
    ],
  };
}

export default connect(select)(Chat);
