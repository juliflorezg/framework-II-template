import { useMemo } from "react";
import { useStyleguide } from "../context";
import { StyleSheet } from "react-native";

const useStyles = (Class?: string) => {

    if (!Class) return StyleSheet.create({})
    const { styles } = useStyleguide();
    const style = useMemo(() => {
        if (styles.hasOwnProperty(`styles.${Class}`)) return StyleSheet.create(styles[`styles.${Class}`])
        return StyleSheet.create({})
    }, [Class])
    return style
}

export default useStyles