'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ListView,
  Image
} from 'react-native';

import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import {createForms} from '../utils/FormUtils';
import FormsList from './FormsList';
import colors from '../styles/colors';
import MasterDetailView from './MasterDetailView';
import DetailToolbar from './DetailToolbar';
import MasterToolbar from './MasterToolbar';
import TCERFormModel from '../models/TCERFormModel';
import ModelUtils from '../utils/ModelUtils';
const formModelMeta = ModelUtils.blankModel(TCERFormModel).meta;
import SignatureView from './SignatureView';
import AsyncStorage from 'AsyncStorage';

const helper = new Helper();

class FormView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      showSignature: false
    };
  }

  toggleSignature(){
    this.setState({
      showSignature: true
    });
  }

  saveSign() {
    this.refs["sign"].saveImage();
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result.pathName);
    this.setState({
      showSignature: false,
      signaturePath: result.pathName
    });
    this.forceUpdate();
 }

 _onDragEvent() {
    // This callback will be called when the user enters signature
   console.log("dragged");
 }

  renderFormsListView(){
    return (
      <FormsList
        dispatch={this.props.dispatch}
        forms={this.state.ds.cloneWithRows([...this.props.forms])}
        viewingForm={this.props.viewingForm}
      />
    );
  }

  renderRepeating(obj, parts, k, allText, meta, eventIndex){
    let items = meta.prep ? meta.prep(obj[k]) : obj[k];
    items.forEach((v, i) => {
      this.renderMultiple(obj, parts, k, allText, eventIndex, i);
    });
  }

  renderMultiple(obj, parts, key, allText, eventIndex, itemIndex){
    parts.forEach((p) => {
      let val = p.resolve(obj, itemIndex);
      allText.push(this.renderText(val, p, eventIndex, itemIndex));
    });
  }

  resolveValue(resolve, obj){
    let val = "";
    try {
      val = resolve(obj);
    } catch (e) {
    }
    return val;
  }

  getValue(obj, meta, k){
    if(!meta.resolve){
      return obj[k];
    }
    return this.resolveValue(meta.resolve, meta.resolveFrom ? this.props[meta.resolveFrom] : obj);
  }

  renderValue(obj, meta, k, allText, eventIndex){
    if(meta.repeating && obj[k].length) {
      this.renderRepeating(obj, meta.parts, k, allText, meta, eventIndex);
    }
    else if(meta.multiple && obj[k]){
      this.renderMultiple(obj, meta.parts, k, allText, eventIndex);
    }
    else{
      allText.push(this.renderText(this.getValue(obj, meta, k), meta, eventIndex));
    }
  }

  renderObj(obj, meta, eventIndex){
    let allText = [];
    Object.keys(meta).forEach((k) => {
      this.renderValue(obj, meta[k], k, allText, eventIndex);
    });
    return allText;
  }

  renderText(val, meta, xIndex=0, yIndex=0){
    let _key = Math.random().toString() + new Date().getTime().toString();
    let xy = {left: meta.x * 0.657, top: meta.y * 0.658};
    if(meta.ymultiple){
      xy.top += (meta.ymultiple * yIndex);
    }
    xy.left += (formModelMeta.xMultiplier * xIndex);
    return (
      <View style={[styles.textWrapper, xy, meta.viewStyle || {}]} key={_key}>
        <Text style={[styles.text, meta.textStyle || {}]}>{val}</Text>
      </View>);
  }

  renderFishingEvents(allText){
    const fe = this.props.viewingForm.fishingEvents;
    fe.forEach((f, i) => {
      allText = allText.concat(this.renderObj(f, formModelMeta.printMapping.fishingEvents, i));
    });
    return allText;
  }
  renderForm(){
    return this.renderObj(this.props.viewingForm, formModelMeta.printMapping.form);
  }
  render() {
    let text = [];

    if(this.props.viewingForm){
      text = this.renderForm(text);
      text = this.renderFishingEvents(text);
    }

    let detailToolbar = (
      <DetailToolbar
        right={{color: "#007aff", text: "Sign", onPress: this.toggleSignature.bind(this)}}
        centerTop={null}
        centerBottom={<View style={styles.spacer}/>}
      />
    );
    let masterToolbar = (
      <MasterToolbar
        left={{color: "#007aff", text: "Sign All",  onPress: this.toggleSignature.bind(this)}}
      />
    );

    let signatureView = this.state.showSignature ?
      (<View style={styles.signatureViewContainer}>
        <SignatureView
          style={[{flex:1}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent.bind(this)}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          viewMode={"landscape"}/>
        </View>) : null;

    let signatureImage = this.state.signaturePath ?
      (<Image source={{path: this.state.signaturePath, uri: this.state.signaturePath}} style={[styles.signImage, {width: 100, height: 50}]}>
       </Image>) : null;
    return (
      <MasterDetailView
        master={this.renderFormsListView()}
        detail={(
          <View style={[styles.col, styles.fill, {alignSelf: 'flex-start'}, styles.wrapper]}>
            <Image source={require('../images/TCER.png')} style={styles.bgImage}>
              <View style={styles.form}>
                {text}
              </View>
            </Image>
            {signatureImage}
            {signatureView}
          </View>
        )}
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      forms: createForms(state.fishingEvents.events),
      user: state.me.user,
      vessel: state.me.vessel,
      viewingForm: state.forms.viewingForm
    };
}

const styles = StyleSheet.create({
  wrapper:{
   backgroundColor: colors.backgrounds.dark,
   margin: 5,
   borderRadius: 10,
  },
  row: {
    flexDirection: 'row'
  },
  fill: {
    flex: 1,
  },
  col: {
    flexDirection: 'column'
  },
  textWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  text: {
    color: 'red'
  },
  listRowItemNarrow: {
    width: 35,
    flexDirection: 'column'
  },
  listRowItem:{
    flexDirection: 'column'
  },
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderColor: '#ccc',
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  selectedListRow: {
    backgroundColor: '#eee',
  },
  bgImage: {
    resizeMode: "stretch",
    height: 495,
    width: 710,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttonStyle: {
   flex: 1, justifyContent: "center", alignItems: "center", height: 50,
   backgroundColor: "#eeeeee",
   margin: 10
  },
  signImage: {
    position: 'absolute',
    top: 420,
    left: 570
  },
  signatureViewContainer:{
    position: 'absolute',
    top: 100,
    left: 20,
    height: 350,
    paddingTop: 50,
    width: 400
  }
});

module.exports = connect(select)(FormView);
