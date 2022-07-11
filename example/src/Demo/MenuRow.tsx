/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, Rectangle, Column, Text } from "pink-koala"
import { ColorPink, ColorGray, ColorWhite } from "./Styles"

type MenuRowProps = {
    width?: number | string | undefined
    height?: number | string | undefined
    title: string
    selected: boolean
    onClick: () => void
}

export function MenuRow(props: MenuRowProps) {
    return (
        <Rectangle
            padding="10px"
            height={props.height}
            width={props.width}
            fill={props.selected ? ColorWhite : ColorGray}
            onClick={props.onClick}
        >
            <Column margin="20px" height={props.height} width={props.width}>
                <Text
                    fill={props.selected ? ColorPink : ColorWhite}
                    font="36px Helvetica"
                >
                    {props.title}
                </Text>
            </Column>
        </Rectangle>
    )
}
