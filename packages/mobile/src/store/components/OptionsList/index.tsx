import { BlockComponent } from "@my-app/app/src/framework/engine/types"
import useStyles from "@my-app/app/src/framework/styleguide/hooks/useStyles"
import React, { FC, useCallback, useState } from "react"
import OptionsList from "../ui/Options"
import { OptionItem } from "../ui/Options/type"

type OptionsListProps = {
    list: OptionItem[]
    multi: boolean
    style?: string
}

const OptionsListComponent: FC<BlockComponent<OptionsListProps>> = ({
    props: { list,
        multi = false,
        style }
}) => {

    const [selectedValue, setSelectedValue] = useState<string | number>("")
    const [multiSelected, setMultiSelected] = useState<(string | number)[]>([])

    const addValue = (value: string | number) => {
        setMultiSelected((val) => {
            let cpy = val
            cpy.push(value)
            return cpy
        })
    }

    const removeValue = (value: string | number) => {
        setMultiSelected((val) => {
            let cpy = val
            const index = cpy.findIndex((pred) => pred === value)
            if (index !== -1) {
                cpy.splice(index, 1)
            }
            return cpy
        })
    }

    const isItemSelected = (value: string | number) => {
        const index = multiSelected.findIndex((pred) => pred === value)
        console.log(index)
        if (index !== -1) {
            return true
        }
        return false
    }


    const isSelected = useCallback((value: string | number) => {
        if (multi) {
            return isItemSelected(value)
        }

        return selectedValue === value
    }, [selectedValue])

    const onPress = (value: string | number) => {
        if (multi) {
            if (isSelected(value)) removeValue(value)
            else addValue(value)
        } else {
            setSelectedValue(value)
        }
    }

    const OptionListStyles = useStyles(style)

    return <OptionsList
        list={list}
        listStyle={OptionListStyles?.listStyle}
        itemContainerStyle={OptionListStyles.itemContainer}
        itemContainerStyleSelected={OptionListStyles.itemContainerSelected}
        itemTitleStyle={OptionListStyles?.itemTitle}
        itemDescriptionStyle={OptionListStyles?.itemDescription}
        circle={OptionListStyles?.circle}
        onPress={onPress}
        isSelected={isSelected}
        selectedValue={selectedValue}
        multiSelected={multiSelected}
        circleCheck={OptionListStyles?.circleCheck}
    />
}

export default OptionsListComponent