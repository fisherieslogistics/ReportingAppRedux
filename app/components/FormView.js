'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import FormsList from './FormsList';
import { MasterDetail } from './layout/MasterDetailView';
import SignatureView from './SignatureView';
import FormActions from '../actions/FormActions';
import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import {connect} from 'react-redux';
import {MasterToolbar, DetailToolbar} from './layout/Toolbar';
import {colors, textStyles, shadowStyles} from '../styles/styles';
import { renderForm, createForms } from '../utils/FormUtils';
import ModelUtils from '../utils/ModelUtils';

const formActions = new FormActions();
const formModel = FormModel.concat(TCERFormModel);
const meta = ModelUtils.blankModel(formModel, 'FORM').meta;

/* eslint-disable */
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
  bgImageTCER: {
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
    height: 250,
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
  signImageTCER: {
    position: 'absolute',
    top: 420,
    left: 550,
    height: 40,
    width: 120,
  },
  dateSignedTCER:{
    position: 'absolute',
    top: 448,
    left: 570,
    backgroundColor: 'transparent',
  },
});
/* eslint-enable */

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
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this.toggleSignature = this.toggleSignature.bind(this);
    this.getMasterToolbar = this.getMasterToolbar.bind(this);
    this.hideSignatureWarning = this.hideSignatureWarning.bind(this);
    this.hideSignatureView = this.hideSignatureView.bind(this);
  }

  componentWillReceiveProps(props){
    this.setState({
      forms: props.forms
    })
  }

  toggleSignature(){
    if(!this.formReadyToSign(this.props.viewingForm)) {
      return;
    }
    this.setState({
      showSignatureWarning: true
    });
  }

  saveSign() {
    this.refs.sign.saveImage();
  }

  resetSign() {
    this.refs.sign.resetImage();
  }


  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    this.props.dispatch(formActions.signForm(this.props.viewingForm, result.encoded));
    this.setState({
      showSignature: false,
    });
    setTimeout(() => {
      const forms = createForms(this.props.fishingEvents);
      this.setState({
        forms
      })
      this.props.dispatch(formActions.setViewingForm(forms.find(
        f => f.id === this.props.viewingForm.id)));
    }, 300);
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
      key += "__prepped";
      obj[key] = items;
    }
    items.forEach((v, i) => {
      this.renderMultiple(obj, parts, key, allText, eventIndex, i);
    });
  }

  renderMultiple(obj, parts, key, allText, eventIndex, itemIndex){
    parts.forEach((p) => {
      const val = p.resolve(obj, itemIndex, key);
      allText.push(this.renderText(val, p, eventIndex, itemIndex, key));
    });
  }

  resolveValue(resolve, obj){
    let val = "";
    try {
      val = resolve(obj);
    } catch (e) {
      console.log(e);
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
    const allText = [];
    Object.keys(meta).forEach((k) => {
      this.renderValue(obj, meta[k], k, allText, eventIndex);
    });
    return allText;
  }

  renderText(val, meta, xIndex=0, yIndex=0, key){
    const _key = `${val} ${xIndex} ${yIndex} ${key} ${meta.x} ${meta.y}`;
    const xy = {left: meta.x * 0.657, top: meta.y * 0.658};
    if(meta.ymultiple){
      xy.top += (meta.ymultiple * yIndex);
    }
    xy.left += (this.props.formModelMeta.xMultiplier * xIndex);
    return (
      <View style={[styles.textWrapper, xy, meta.viewStyle || {}]} key={_key}>
        <Text style={[textStyles.font,styles.text, this.props.formModelMeta.textStyle || {}, meta.textStyle || {} ]}>{val}</Text>
      </View>);
  }

  renderFishingEvents(allText, form){
    const fe = form.fishingEvents;
    fe.forEach((f, i) => {
      allText = allText.concat(this.renderObj(f, this.props.formModelMeta.printMapping.fishingEvents, i));
    });
    return allText;
  }
  renderForm(form){
    return this.renderObj(form, this.props.formModelMeta.printMapping.form);
  }

  formReadyToSign(form){
    if(!form){
      return false;
    }
    return form.fishingEvents.every(f => f.eventValid && f.productsValid && !f.signature);
  }

  renderSignatureAndDate(){
    if(!(this.props.viewingForm && this.props.viewingForm.fishingEvents[0].signature)){
      return null;
    }
    const signStyle = styles.signImageTCER;
    const dateStyle = styles.dateSignedTCER;
    return [
      (
        <Image
          source={{uri: "data:image/png;base64," + this.props.viewingForm.fishingEvents[0].signature.toString()}}
          style={[signStyle, {width: 120, height: 35}]}
          key={"SignatureImage"}
        />
      ),
      (
        <View style={[dateStyle]} key={"DateSignedText"}>
          <Text style={[{color: colors.red}]}>
            {this.props.viewingForm.fishingEvents[0].dateSigned.format("DD       MM          YY")}
          </Text>
        </View>
      )
    ];
  }

  getMasterToolbar(){
    const canSignOne = this.formReadyToSign(this.props.viewingForm);
    const backgroundColor = canSignOne ? colors.blue : colors.darkGray;
    const textColor = canSignOne ? colors.white : colors.backgrounds.light;
    const buttonStyle = { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor, alignSelf: 'stretch'};
    const innerWrap = { alignItems: 'center' };
    const textStyle = { fontSize: 30, fontWeight: '500', color: textColor, textAlign: 'center', marginTop: 20 };
    const eventButton = (
      <TouchableOpacity onPress={ this.toggleSignature } style={ buttonStyle }>
         <View style={innerWrap}>
          <Text style={ textStyle }>
            { "Sign Form" }
          </Text>
        </View>
      </TouchableOpacity>
    );
    return(
      <MasterToolbar
        center={eventButton}
      />
    );
  }

  renderSignatureBackground() {
    if(!(this.state.showSignature || this.state.showSignatureWarning)){
      return null;
    }
    return (
      <View style={[styles.greyBackground]} />
    );
  }

  hideSignatureWarning() {
    this.setState({showSignatureWarning: false, showSignature: true});
  }

  hideSignatureView() {
    this.setState({showSignatureWarning: false, showSignature: false});
  }

  showSignature(){
    this.setState({showSignature: false, showSignatureWarning: false});
  }

  renderSignatureWarning() {
    if(!(this.state.showSignatureWarning)){
      return null;
    }
    const warningSty = {color: 'red', textAlign: 'center', fontSize: 17, padding: 10};
    const outerStyle = [styles.signatureWarningViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown];
    const cancelStyle = {flexDirection: 'row', marginTop: 30, margin: 0};
    const continueStyle = {color: colors.orange, textAlign: 'right', fontSize: 18, padding: 10};
    const contButtonStyle = {flex: 1};
    const cancelTextStyle = {textAlign: 'left', fontSize: 18, padding: 10};
    const text = `
      Once you tap continue, you will no longer be able to edit the shots on this form.
      Please note: Signing this form will submit the form directly to FishServe.
      This Form has the same legal status as the paper TCER form.
    `;
    return (
      <View style={outerStyle}>
        <View>
          <Text style={warningSty}>
            WARNING
          </Text>
          <Text>
            { text }
          </Text>
        </View>
      <View style={cancelStyle}>
        <TouchableOpacity key={"Cancel"} style={{ flex: 1}}
            onPress={ this.hideSignatureView }
        >
          <Text style={cancelTextStyle}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={"Continue"}
          style={contButtonStyle}
          onPress={ this.hideSignatureWarning }
        >
          <Text style={continueStyle}>
          Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }

  renderSignatureView() {
    if(!this.state.showSignature){
      return null;
    }
    const outerStyle = [styles.signatureViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown];
    const innerStyle = [{flex:1}, styles.signature];
    return (
      <View style={outerStyle}>
        <SignatureView
          style={innerStyle}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          viewMode={"landscape"}
        />
      </View>
    );
  }

  render() {
    let text = [];
    const form = this.props.viewingForm;
    if(form){
      text = this.renderForm(form);
      text = this.renderFishingEvents(text, form);
    }
    const detailToolbar = (
      <DetailToolbar />
    );
    const masterToolbar = (
      <MasterToolbar
        center={ this.getMasterToolbar() }
      />
    );

    const master = this.renderFormsListView();
    const renderedForm = renderForm(text, styles);
    const lotsofstyle = [styles.col, styles.fill, {alignSelf: 'flex-start'},
                  styles.wrapper, {opacity:this.props.viewingForm ? 1 : 0}]
    const detailView = (
      <ScrollView horizontal>
        <View
          style={lotsofstyle}
        >
          {renderedForm}
          { this.renderSignatureAndDate()}
          {this.renderSignatureBackground()}
          {this.renderSignatureView()}
          {this.renderSignatureWarning()}
        </View>
      </ScrollView>
    );

    return (
      <MasterDetail
        master={master}
        detail={detailView}
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
}

const select = (State) => {
    const state = State.default;
    return {
      user: state.me.user,
      vessel: state.me.vessel,
      viewingForm: state.forms.viewingForm,
      fishingEvents: state.fishingEvents.events,
      selectedIndex: state.forms.viewingFormIndex,
      formModelMeta: meta,
    };
}



export default connect(select)(FormView);
