import React from "react";
import Route from "./src/routes/index.route";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { defaultThemeColors } from "./src/helpers/colors.helper";
import { StatusBar } from "expo-status-bar";
import moment from 'moment'
import "moment/min/locales"
moment.locale('id')

const theme = {
  ...DefaultTheme,
  roundess: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    ...defaultThemeColors
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <PaperProvider theme={theme}>
        <Route />
      </PaperProvider>
    </Provider>
  );
}

