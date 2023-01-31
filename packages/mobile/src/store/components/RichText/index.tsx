import { BlockComponent } from "@my-app/app/src/framework/engine/types"
import useStyles from "@my-app/app/src/framework/styleguide/hooks/useStyles"
import React, { FC } from "react"
import Text from "../ui/Text"

type RichTextProps = {
    text: string
    style?: string
}

const RichText: FC<BlockComponent<RichTextProps>> = ({
    props: { text,
        style }
}) => {
    const TextStyles = useStyles(style)
    return <Text style={TextStyles?.text}>{text}</Text>
}

export default RichText