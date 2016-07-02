import colors from './colors';

export default {
  wrapper:{
   backgroundColor: '#fff',
   marginTop: 5,
   marginLeft: 5,
   marginRight: 5,
   borderRadius: 10,
   paddingTop: 10,
   paddingLeft: 30,
   paddingBottom: 10,
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
  editorRow: {
    flex: 0.7,
    paddingBottom: 3
  },
  fill: {
    flex: 1,
  },
  labelRow: {
    flex: 0.3,
  },
  labelText: {
    color: colors.blue
  },
  rowSection: {
    flex: 0.3
  },
  inputRow: {
    paddingTop: 5,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: colors.midGray
  }
}
