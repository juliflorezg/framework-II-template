import React, { FC } from "react";
import { TouchableOpacity } from "react-native";

export const ImageBackground: FC = () => {

  return (
    <TouchableOpacity
      onPress={() => { 
        console.log("touchable")
      }}
    />
  );
}