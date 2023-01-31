import React, { FC, Fragment, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
} from "react-native";

import { CommerceProvider } from '@vercel/commerce-shopify/index'

import Engine from "./framework/engine";
import { PluginProvider } from "./framework/omni-logic/plugin";
import { StyleguideProvider, StyleguideProps } from "./framework/styleguide/context";
import { EngineProps } from "./framework/engine/contex";
import { createNativeWrapper } from "react-native-gesture-handler";

const AppRender: FC<FrameworkProps> = (props) => {

  return (
    <CommerceProvider locale='es-CO'>
      <PluginProvider locale="es-co">
        <StyleguideProvider config={{
          theme: props.theme,
          styles: props.styles,
          CustomComponents: {},
          sharedComponents: props.sharedComponents
        }}>
          <Engine
            blocks={props.blocks}
            rawHooks={props.hooks}
            routes={props.routes}
          />
        </StyleguideProvider>
      </PluginProvider>
    </CommerceProvider>
  )
}



type FrameworkProps = EngineProps['data'] & StyleguideProps['config']

const App: FC<FrameworkProps> = (props) => {
  return <SafeAreaView  style={styles.root}>
    <AppRender {...props} />
  </SafeAreaView>
}

export { App }

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
