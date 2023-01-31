import React, { Fragment, memo, useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { View } from 'react-native'
import { useEngine } from '../contex'
import useChildren from '../hooks/useChildren'
import isEqual from 'lodash.isequal'


const ExtensionComponent = (props: NativeStackScreenProps<any, any>) => {
  const { blocks } = useEngine()
  const routeName = props.route.name
  const currentScreen = blocks[`store.${routeName}`]
  const childrens = useChildren(currentScreen)
  return <>{childrens}</>
}

export default memo(ExtensionComponent, isEqual)