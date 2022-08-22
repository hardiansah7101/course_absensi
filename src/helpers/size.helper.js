import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const hp = (size = 0) => heightPercentageToDP(size.toString() + '%')
export const wp = (size = 0) => widthPercentageToDP(size.toString() + '%')