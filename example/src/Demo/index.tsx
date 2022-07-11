/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    createElement,
    Fragment,
    Rectangle,
    Layer,
    Row,
    Column,
    Text,
    useState
} from "pink-koala"
import { MenuRow } from "./MenuRow"
import { ColorPink, ColorGray, ColorWhite } from "./Styles"

export function Demo() {
    const [category, setCategory] = useState("shapes")

    return (
        <>
            <Layer id="main">
                <Layer id="background">
                    <Rectangle
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="#333"
                    />
                </Layer>
                <Row width="100%" height="100%">
                    <Column height="100%" width="200px">
                        <MenuRow
                            width="100%"
                            title="Shapes"
                            selected={category === "shapes"}
                            onClick={() => {
                                setCategory("shapes")
                            }}
                        />
                        <MenuRow
                            width="100%"
                            title="Layers"
                            selected={category === "layers"}
                            onClick={() => {
                                console.log("Layers")
                                setCategory("layers")
                            }}
                        />
                        <MenuRow
                            width="100%"
                            title="Layout"
                            selected={category === "layout"}
                            onClick={() => {
                                setCategory("layout")
                            }}
                        />
                        <MenuRow
                            width="100%"
                            title="Events"
                            selected={category === "events"}
                            onClick={() => {
                                setCategory("events")
                            }}
                        />
                    </Column>
                    {category === "shapes" && (
                        <Rectangle flex="8" height="100%" fill={ColorWhite}>
                            <Column width="100%" height="100%">
                                <Text fill={ColorPink} font="52px Helvetica">
                                    Shapes
                                </Text>
                                <Rectangle
                                    fill={ColorGray}
                                    height="3px"
                                    width="100%"
                                />
                            </Column>
                        </Rectangle>
                    )}
                    {category === "layers" && (
                        <Rectangle flex="8" height="100%" fill={ColorWhite}>
                            <Column width="100%" height="100%">
                                <Text fill={ColorPink} font="52px Helvetica">
                                    Layers
                                </Text>
                                <Rectangle
                                    fill={ColorGray}
                                    height="3px"
                                    width="100%"
                                />
                            </Column>
                        </Rectangle>
                    )}
                    {category === "layout" && (
                        <Rectangle flex="8" height="100%" fill={ColorWhite}>
                            <Column width="100%" height="100%">
                                <Text fill={ColorPink} font="52px Helvetica">
                                    Layout
                                </Text>
                                <Rectangle
                                    fill={ColorGray}
                                    height="3px"
                                    width="100%"
                                />
                            </Column>
                        </Rectangle>
                    )}
                    {category === "Events" && (
                        <Rectangle flex="8" height="100%" fill={ColorWhite}>
                            <Column width="100%" height="100%">
                                <Text fill={ColorPink} font="52px Helvetica">
                                    Events
                                </Text>
                                <Rectangle
                                    fill={ColorGray}
                                    height="3px"
                                    width="100%"
                                />
                            </Column>
                        </Rectangle>
                    )}
                </Row>
            </Layer>
        </>
    )
}
