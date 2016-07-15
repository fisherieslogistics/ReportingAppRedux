'use strict';
import {
  View,
  Text,
  Switch,
  AlertIOS,
  TextInput,
} from 'react-native';
import React from 'react';
import FishPicker from '../components/FishPicker';
import ContainerPicker from '../components/ContainerPicker';
import DatePicker from 'react-native-datepicker';
import {inputStyles, textStyles, colors} from '../styles/styles';
import Sexagesimal from 'sexagesimal';
import moment from 'moment';
import {LongButton} from './Buttons';
import Helper from '../utils/Helper';
const helper = new Helper();

const Editors = (props) => {
  let inputs = [];
  let labels = []
  props.model.forEach((attribute) => {
      if(attribute.readOnly || attribute.hidden) {
          return;
      }
      inputs.push(renderEditor(attribute, props));
  });

  return <View>{ inputs }</View>;
}

const SingleEditor = ({ attribute, styles, getEditor, value, editing, editingCallback }) => {
  if(!attribute.valid) {
    throw new Error(`${attribute.id} doesn't have a validator`);
  }
  const isValid = attribute.valid.func(value);
  return (
    <View style={[styles.col, styles.inputRow]} key={attribute.id}>
        <View style={[styles.row, styles.labelRow]}>
          <Text style={styles.labelText}>
            {attribute.label}
          </Text>
          { isValid ? null : (editing ? <Text style={[styles.labelError]}>
            { attribute.valid.errorMessage }
          </Text> : <View style={styles.errorDot} />)}
        </View>
        <View style={[styles.row, styles.editorRow]}>
          {AttributeEditor(getEditor(attribute), editingCallback, editing)}
        </View>
    </View>
  );
}

const getCombinedEditors = (attribute, model, getEditor) => {
  let editors = [{label: attribute.label, editor: getEditor(attribute) }];
  let addedEditors = attribute.editorDisplay.siblings.map((s) => {
      let attr = model.find((a) => {
                   return a.id === s;
                  });
      return {label: attr.label, editor: getEditor(attr)};
  });
  return editors.concat(addedEditors);
}

const renderCombinedEditors = (combinedEditors, styles, editingCallback, editing) => {
  return (
    <View style={[styles.col, styles.inputRow]} key={"editor" + combinedEditors.map(e => e.editor && e.editor.attribute.id).join('.')}>
      <View style={[styles.row]}>
        {combinedEditors.map((e, index) => {
          if(e.editor && !e.editor.attribute.valid) {
            throw new Error(`${e.editor.attribute.id} doesn't have a validator`);
          }
          const isValid = !e.editor || e.editor.attribute.valid.func(e.editor.value);
          return (
              <View style={[styles.rowSection]} key={"editor__" + e.label + index}>
                <View style={[styles.labelRow]}>
                  <Text style={styles.labelText}>
                    {e.label}
                  </Text>
                  { isValid ? null : (editing === e.editor.attribute.id ? <Text style={[styles.labelError]}>
                    { e.editor.attribute.valid.errorMessage }
                  </Text> : <View style={styles.errorDot} />)}
                </View>
                <View style={[styles.editorRow]}>
                  {e.editor && AttributeEditor(e.editor, (editing) => editingCallback(e.editor.attribute.id, editing), editing)}
                </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const renderEditor = (attribute, props) => {

  if(attribute.editorDisplay && attribute.editorDisplay.hideUndefined && props.obj[attribute.id] === undefined){
    return null;
  }
  const editing = (props.editing === attribute.id);
  if(attribute.editorDisplay && attribute.editorDisplay.editor === props.editorType){
    switch (attribute.editorDisplay.type) {
      case "single":
        return (<SingleEditor
        attribute={attribute}
        styles={props.styles}
        getEditor={props.getEditor}
        value={props.values[attribute.id]}
        editing={editing}
        key={attribute.id}
        editingCallback={(editing) => props.editingCallback(attribute.id, editing)}
      />);
      case "combined":
        const combinedEditors = getCombinedEditors(attribute, props.model, props.getEditor);
        return renderCombinedEditors(combinedEditors, props.styles, props.editingCallback, props.editing);
      default:
    }
  }
}

class EditOnBlur extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      renderedValue: this.getRenderedValue(props.value),
      inputId: props.inputId
    }
  }

  componentWillReceiveProps(props){
    if(props.inputId !== this.state.inputId){
      this.setState({
        value: props.value,
        inputId: props.inputId,
        renderedValue: this.getRenderedValue(props.value)
      });
    }
  }

  onChangeText(text){
    this.setState({
      value: text,
      renderedValue: text
    })
  }

  onFocus(){
    this.props.editingCallback(true);
  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.getCorrectedValue(this.state.value));
    this.props.editingCallback(false);
    this.setState({
      renderedValue: this.getRenderedValue(this.state.value),
    });
  }

  getKeypad(){
    switch (this.props.attribute.type) {
      case "number":
        return 'number-pad'
      case "float":
        return 'numeric'
      default:
        return 'default'
    }
  }

  getCorrectedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        return isNaN(parseInt(value)) ? "0" : parseInt(value).toString();
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString();
      default:
        return (value !== null && value !== undefined) ? value.toString() : "";
    }
  }

  getRenderedValue(value){
    return this.getCorrectedValue(value) + (this.props.attribute.unit ? " " + this.props.attribute.unit : "");
  }

  render(){
    return (
      <TextInput
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={this.getKeypad.bind(this)()}
        placeholderText={this.props.attribute.label}
        value={this.state.renderedValue}
        style={inputStyles.textInput}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
        {...this.props.extraProps} />
    );
  }
}

class LocationEditor extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      location: {
      },
      latPositive: false,
      lonPositive: true,
      canSave: true
    }
  }

  onFocus(){
    let location = helper.getDegreesMinutesFromLocation(this.props.value);
    this.props.editingCallback(true);
    this.setState({
      location: location,
      lonPositive: this.props.value.lon > 0,
      latPositive: this.props.value.lat > 0
    });
  }

  getInput(name, label, maxLength, maxVal){
    let value = this.state.location[name];
    return (
      <View
        key={name + "__location"}
        style={[{ flexDirection: 'row', marginLeft: 10}]}>
        <Text style={[inputStyles.labelText, {color: colors.blue, marginTop: 5}]}>
          {label}
        </Text>
        <TextInput
          selectTextOnFocus={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          value={value.toString()}
          style={{width: 40, height: 30, alignSelf: 'flex-start', marginLeft:5}}
          maxLength={maxLength}
          onChangeText={(text) => {
            let change = {};
            change[name] = text;
            this.setState({
              location: Object.assign({}, this.state.location, change),
              canSave: (isNaN(parseInt(text)) === false) && (parseInt(text) <= maxVal)
            });
          }}
        />
        </View>);
  }

  renderEditingView(){
    let latInputs = [["latDegrees", "degrees", 3, 90],
                     ["latMinutes", "minutes", 2, 60],
                     ["latSeconds", "seconds", 2, 60]].map((part) => {
                       return this.getInput(part[0], part[1], part[2], part[3]);
                  });
    let lonInputs = [["lonDegrees", "degrees", 3, 180],
                     ["lonMinutes", "minutes", 2, 60],
                     ["lonSeconds", "seconds", 2, 60]].map((part) => {
                       return this.getInput(part[0], part[1], part[2], part[3]);
                  });
    return (
      <View>
        <View>
          <Text style={[inputStyles.labelText, {color: colors.blue}]}>
            Latitude
          </Text>
          {latInputs}
          <View style={{flexDirection: 'row'}}>
            <Text style={[inputStyles.labelText, {color: colors.blue, marginTop: 5, marginRight: 10, marginLeft: 10}]}>
              South
            </Text>
            <Switch
              onValueChange={(bool) => {
                this.setState({
                  latPositive: bool
                });
              }}
              value={this.state.latPositive}
            />
            <Text style={[inputStyles.labelText, {color: colors.blue, marginTop: 5, marginRight: 10, marginLeft: 10}]}>
              North
            </Text>
          </View>
        </View>

        <View>
          <Text style={[inputStyles.labelText, {color: colors.blue}]}>
            Longitude
          </Text>
          {lonInputs}
          <View style={{flexDirection: 'row'}}>
            <Text style={[inputStyles.labelText, {color: colors.blue, marginTop: 5, marginRight: 10, marginLeft: 10}]}>
              West
            </Text>
            <Switch
              onValueChange={(bool) => {
                this.setState({
                lonPositive: bool});
              }}
              value={!!this.state.lonPositive}
            />
            <Text style={[inputStyles.labelText, {color: colors.blue, marginTop: 5, marginLeft: 10, marginRight: 10}]}>
              East
            </Text>

          </View>
        </View>
        <LongButton
          text={"Save"}
          bgColor={colors.blue}
          onPress={this.saveLocation.bind(this)}
          disabled={!this.state.canSave}
          _style={{marginTop: 5}}
        />
        <LongButton
          text={"Cancel"}
          bgColor={colors.red}
          onPress={() => {this.props.editingCallback(false);}}
          disabled={false}
          _style={{marginTop: 5}}
        />
      </View>
    );
  }

  renderLocation(){
    let posText = Sexagesimal.format(this.props.value.lat, 'lat') + "  " + Sexagesimal.format(this.props.value.lon, 'lon');
    return (
      <TextInput
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={'number-pad'}
        placeholderText={this.props.attribute.label}
        value={posText}
        style={inputStyles.textInput}
        onFocus={this.onFocus.bind(this)}
        onBlur={() => {
          this.props.editingCallback(false);
        }}
        onChangeText={() => {}}
      />
    );
  }

  saveLocation(){
    let stateLoc = Object.assign({}, this.state.location);
    let location = helper.parseLocation(stateLoc,
                                        this.state.lonPositive,
                                        this.state.latPositive);
    this.props.onChange(location);
    this.props.editingCallback(false);
  }

  render(){
    if(this.props.editing !== this.props.attribute.id){
      return this.renderLocation();
    }else{
      return (
        <View>
          {this.renderLocation()}
          {this.renderEditingView()}
        </View>
      );
    }
  }
}

const AttributeEditor = ({attribute, value, onChange, extraProps, inputId}, editingCallback, editing) => {
  if(!extraProps) {
    extraProps = {};
  }
  //return (<View style={{paddingTop: 6}}><Text style={textStyles.font, textStyles.midLabel}>{}</Text></View>);
  switch (attribute.type) {
    case "labelOnly":
      return (<Text>{value}</Text>);
    case "displayOnly":
    case "datetime":
      return (
        <DatePicker
          date={value || new Date()}
          mode="datetime"
          format="YYYY-MM-DD HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: inputStyles.dateInput,
            dateIcon: inputStyles.dateIcon
          }}
          onDateChange={(datetime) => {
            onChange(attribute.id, new moment(datetime));
          }}
          {...extraProps}
          editingCallback={editingCallback}
      />);
      break;
    case "product":
      return (<FishPicker
                onChange={(value) => {
                  onChange(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
                editingCallback={editingCallback}
              />);
    case "container":
      return (<ContainerPicker
                onChange={(value) => {

                  onChange(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
                editingCallback={editingCallback}
              />);
    case "location":
        return(<LocationEditor
            attribute={attribute}
            value={value}
            onChange={(value) => {
              onChange(attribute.id, value);
            }}
            editing={editing}
            extraProps={{editable: false}}
            inputId={inputId}
            editingCallback={editingCallback}
            />);
      break;
    case "bool":
      return (<Switch
                onValueChange={(bool) => {
                  onChange(attribute.id, bool)
                }}
                value={value || false}
                {...extraProps}/>);
    case "number":
    case "float":
    default:
      return (
        <EditOnBlur
          attribute={attribute}
          value={value}
          callback={onChange}
          extraProps={extraProps}
          inputId={inputId}
          {...extraProps}
          editingCallback={editingCallback}
        />
      );
  }
}

export {renderEditor, Editors, SingleEditor, renderCombinedEditors, getCombinedEditors, AttributeEditor}
