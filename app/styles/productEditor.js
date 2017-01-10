import colors from './darkColors';

export default {
  addProduct: {
    marginLeft: 10,
    backgroundColor: colors.blue,
  },
  buttonWrapper: {
    width: 360,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  undoDelete: {
    borderWidth: 1,
    borderColor: colors.midGray,
  },
  deleteButtonWrapper: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  rowSection: {
    flex: 0.24,
  },
  innerWrapper: {
   paddingTop: 2,
   paddingLeft: 20,
   paddingBottom: 5,
  },
  outerWrapper: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
}
