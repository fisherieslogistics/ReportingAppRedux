import colors from './darkColors';

export default {
  labelError: {
    color: colors.orange
  },
  errorDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.orange,
    borderRadius: 5,
    marginTop: 6,
    position: 'absolute',
    left: -13,
  },
  bubble: {
    position: 'absolute',
    left: 0,
    top: -50,
    width: 180,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    /*shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },*/
  },
  triangle1: {
    position: 'absolute',
    left: 80,
    top: 48,
    /*shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },*/
  }
}
