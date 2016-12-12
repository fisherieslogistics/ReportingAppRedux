import colors from './darkColors';

export default {
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
  bgImageLCER:{
    resizeMode: "stretch",
    height: 485,
    width: 700
  },
  bgImageTCER: {//change for formType
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
  signImageTCER: {
    position: 'absolute',
    top: 410,
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
  signImageLCER: {
    position: 'absolute',
    top: 420,
    left: 550,
    height: 20,
    width: 150,
  },
  dateSignedLCER:{
    position: 'absolute',
    top: 466,
    left: 570,
    backgroundColor: 'transparent',
  }
};
