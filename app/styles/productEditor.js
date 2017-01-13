import colors from './darkColors';

export default {
  addProduct:{
    marginLeft: 10,
    backgroundColor: colors.blue
  },
  buttonWrapper:{
    width: 360,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  undoDelete:{
    borderWidth: 1,
    borderColor: colors.midGray
  },
  deleteButtonWrapper:{
    position: 'absolute',
    right: 8,
    top: 8,
  },
  deleteView: {
    borderRadius: 15,
    width: 25,
    height: 25,
    padding: 5,
    borderWidth: 0,
    backgroundColor: colors.pink,
  },
  rowSection: {
    flex: 0.24
  },
  innerWrapper:{
   paddingTop: 2,
   paddingLeft: 20,
   paddingBottom: 5,
  },
  outerWrapper: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: "hidden"
  },
}
