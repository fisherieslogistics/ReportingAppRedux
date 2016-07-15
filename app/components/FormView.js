'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ListView,
  AlertIOS,
  Image,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import moment from 'moment';
import Helper from '../utils/Helper';
import FormsList from './FormsList';
import MasterDetailView from './MasterDetailView';
import TCERFormModel from '../models/TCERFormModel';
import ModelUtils from '../utils/ModelUtils';
const formModelMeta = ModelUtils.blankModel(TCERFormModel).meta;
import SignatureView from './SignatureView';
import AsyncStorage from 'AsyncStorage';
import FormActions from '../actions/FormActions';
const formActions = new FormActions();

import {connect} from 'react-redux';
import {createForms} from '../utils/FormUtils';
import {MasterToolbar, DetailToolbar} from './Toolbar';
import {colors, listViewStyles, textStyles, shadowStyles} from '../styles/styles';

const helper = new Helper();

class FormView extends React.Component {
  constructor(props){ //icon ans sign form fix it
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      showSignature: false,
      showSignatureWarning: false,
      forms: props.forms,
      selectedIndex: 0
    };
  }

  componentWillReceiveProps(props){
    this.setState({
      forms: props.forms
    })
  }

  toggleSignature(canSignOne){
    if(!canSignOne) {
      return;
    }
    this.setState({
      showSignatureWarning: true
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
    this.props.dispatch(formActions.signForm(this.props.viewingForm, result.encoded));
    this.setState({
      showSignature: false,
    });
    //TODO something better when using events
    setTimeout(() => {
      let forms = createForms(this.props.fishingEvents);
      this.setState({
        forms: forms
      })
      this.props.dispatch(formActions.setViewingForm(null));
    }, 300);
 }

 _onDragEvent() {
    // This callback will be called when the user enters signature
   console.log("dragged");
 }

  renderFormsListView(){
    return (
      <FormsList
        dispatch={this.props.dispatch}
        forms={this.state.ds.cloneWithRows([...this.state.forms].reverse())}
        viewingForm={this.props.viewingForm}
      />
    );
  }

  renderRepeating(obj, parts, k, allText, meta, eventIndex){
    let key  = "" + k;
    let items = obj[k];
    if(meta.prep){
      items = meta.prep(obj[k]);
      key = key + "__prepped"; 
      obj[key] = items;
    }
    items.forEach((v, i) => {
      this.renderMultiple(obj, parts, key, allText, eventIndex, i);
    });
  }

  renderMultiple(obj, parts, key, allText, eventIndex, itemIndex){
    parts.forEach((p) => {
      let val = p.resolve(obj, itemIndex, key);
      allText.push(this.renderText(val, p, eventIndex, itemIndex, key));
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
      allText.push(this.renderText(this.getValue(obj, meta, k), meta, eventIndex, 0, k));
    }
  }

  renderObj(obj, meta, eventIndex){
    let allText = [];
    Object.keys(meta).forEach((k) => {
      this.renderValue(obj, meta[k], k, allText, eventIndex);
    });
    return allText;
  }

  renderText(val, meta, xIndex=0, yIndex=0, key){
    let _key = val + " " + xIndex + " "  + yIndex  + " " + key;
    console.log(_key);
    let xy = {left: meta.x * 0.657, top: meta.y * 0.658};
    if(meta.ymultiple){
      xy.top += (meta.ymultiple * yIndex);
    }
    xy.left += (formModelMeta.xMultiplier * xIndex);
    return (
      <View style={[styles.textWrapper, xy, meta.viewStyle || {}]} key={_key}>
        <Text style={[textStyles.font,styles.text, meta.textStyle || {}]}>{val}</Text>
      </View>);
  }

  renderFishingEvents(allText, form){
    const fe = form.fishingEvents;
    fe.forEach((f, i) => {
      allText = allText.concat(this.renderObj(f, formModelMeta.printMapping.fishingEvents, i));
    });
    return allText;
  }
  renderForm(form){
    return this.renderObj(form, formModelMeta.printMapping.form);
  }

  formReadyToSign(form){
    return (!!form && (!form.fishingEvents.find(f => !f.eventValid)) && (!form.fishingEvents.find(f => f.signature)));
  }

  renderSignatureAndDate(){
    if(!(this.props.viewingForm && this.props.viewingForm.fishingEvents[0].signature)){
      return null;
    }
    return [
      (<Image source={{uri: "data:image/png;base64," + this.props.viewingForm.fishingEvents[0].signature.toString()}}
              style={[styles.signImage, {width: 120, height: 40}]}
              key={"SignatureImage"} />),
      (<View style={[styles.dateSigned]} key={"DateSignedText"}>
         <Text style={[{color: colors.red}]}>{this.props.viewingForm.fishingEvents[0].dateSigned.format("DD       mm           gg")}</Text>
       </View>)
    ];
  }

  render() {
    let text = [];
    let form = this.props.viewingForm;
    if(form){
      text = this.renderForm(form);
      text = this.renderFishingEvents(text, form);
    }

    //let canSignAll = !this.props.forms.find(f => !this.formReadyToSign(f)) &! this.props.forms.every(f => f.signed);
    let canSignOne = this.formReadyToSign(form);
    let signColor = canSignOne ? colors.blue : colors.midGray;
    let detailToolbar = (
      <DetailToolbar
        right={{color: signColor, text: "Sign", onPress: () => this.toggleSignature(canSignOne), enabled: true}}
        centerTop={<Text style={[textStyles.font]}>{this.props.viewingForm ? this.props.viewingForm.id : null}</Text>}
        centerBottom={<View style={styles.spacer} />}
      />
    );
    //right={{color: colors.blue, text: "Sign all", onPress: () => this.toggleSignature("all", canSignAll), enabled: canSignAll}}
    let masterToolbar = (
      <MasterToolbar
        center={
          <View style={{marginTop: 36}}>
            <Text style={[textStyles.font, textStyles.midLabel]}>
              Forms
            </Text>
          </View>
        }
      />
    );

    let signatureView = this.state.showSignature ?
      (<View style={[styles.signatureViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown]}>
        <SignatureView
          style={[{flex:1}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent.bind(this)}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          viewMode={"landscape"}/>
        </View>) : null;
//<View style={[styles.greyBackground]}></View>
    let greyBackground = (this.state.showSignature || this.state.showSignatureWarning) ?
      (<View style={[styles.greyBackground]}></View>):null;


    let signatureWarningView = this.state.showSignatureWarning ?
      (<View style={[styles.signatureWarningViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown, ]}>
        <Text style={{color: 'red', textAlign: 'center', fontSize: 17, padding: 10}}>WARNING</Text>
        <Text>Once you tap continue, you will no longer be able to edit the shots on this form.</Text>
        <Text>Please note: Signing this form will submit the form directly to FishServe.</Text>
        <Text>This Form has the same legal status as the paper TCER form.</Text>
        <View style={{flexDirection: 'row', marginTop: 30, margin: 0}}>
        <TouchableOpacity key={"Cancel"} style={{ flex: 1}}
            onPress={() => this.setState({showSignatureWarning: false, showSignature: false})}
          ><Text style={{textAlign: 'left', fontSize: 18, padding: 10}}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity key={"Continue"} style={{flex: 1}}
            onPress={() => this.setState({showSignatureWarning: false, showSignature: true})}
          ><Text style={{color: colors.orange, textAlign: 'right', fontSize: 18, padding: 10}}>Continue</Text></TouchableOpacity>
        </View>
        </View>) : null;
    //console.log(this.props.viewingForm ? this.props.viewingForm.signature : "NOT NOT NOT");
    return (
      <MasterDetailView
        master={this.renderFormsListView()}
        detail={(
          <View style={[styles.col, styles.fill, {alignSelf: 'flex-start'},
                        styles.wrapper, {opacity:this.props.viewingForm ? 1 : 0}]}>
            <Image source={require('../images/TCER.png')} style={[styles.bgImage]}>
              <View style={styles.form}>
                {text}
              </View>
            </Image>
            {this.renderSignatureAndDate()}
            {greyBackground}
            {signatureView}
            {signatureWarningView}
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
      user: state.me.user,
      vessel: state.me.vessel,
      viewingForm: state.forms.viewingForm,
      fishingEvents: state.fishingEvents.events,
      selectedIndex: state.forms.viewingFormIndex
    };
}

const styles = StyleSheet.create({
  wrapper:{
   backgroundColor: colors.backgrounds.veryDark,
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
  text: {
    color: colors.red
  },
  textWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent'
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
    top: 410,
    left: 550,
    height: 40,
    width: 120,
  },
  signatureViewContainer:{
    position: 'absolute',
    top: 100,
    left: 0,
    height: 310,
    width: 450,
    padding: 10,
    borderRadius: 6,
  },
  signatureWarningViewContainer:{
    position: 'absolute',
    top: 150,
    left: 0,
    height: 210,
    width: 450,
    padding: 10,
    borderRadius: 6,
  },
  greyBackground:{
    position: 'absolute',
    top: -1000,
    left: -1000,
    height: 2200,
    width: 2200,
    backgroundColor: colors.backgrounds.shadow,
  },
  dateSigned:{
    position: 'absolute',
    top: 448,
    left: 570,
    backgroundColor: 'transparent',
  }
});

module.exports = connect(select)(FormView);
