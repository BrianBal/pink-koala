/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    createElement,
    Fragment,
    Rectangle,
    Polygon,
    Layer,
    Column,
    Path,
    Group
} from "pink-koala"
///import { Welcome } from "./Welcome"

/* type SnakeProps = {
    width: number
    height: number
} */

export function Snake() {
    return (
        <>
            <Layer id="main">
                <Column height="100%" width="50%">
                    <Path
                        path={[
                            { x: 0, y: 0 },
                            { x: 100, y: 0 },
                            { x: 100, y: 100 },
                            { x: 0, y: 100 },
                            { x: 0, y: 0 }
                        ]}
                        width="100"
                        height="100"
                        fill="pink"
                        stroke="#000"
                    />
                    <Group flex="3" height="50%" width="50%">
                        <Rectangle
                            id="Rect0"
                            sides="8"
                            height="100%"
                            width="100%"
                            fill="#333"
                        >
                            <Polygon
                                id="rect1"
                                x="25%"
                                y="25%"
                                width="50%"
                                height="50%"
                                sides="3"
                                fill="#ac0000"
                            />
                            <Polygon
                                id="rect2"
                                x="25"
                                y="25"
                                width="50"
                                height="50"
                                sides="5"
                                fill="#00ac00"
                            />
                        </Rectangle>
                    </Group>
                    <Polygon
                        flex="1"
                        id="rect1"
                        width="50%"
                        height="50%"
                        sides="4"
                        fill="#0000ac"
                    />
                </Column>
                {/* <Column width="100%" height="100%">
                    <Row
                        width="100%"
                        height="200"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text fill="#0C0" font="90px Arial">
                            Snake
                        </Text>
                    </Row>
                    <Rectangle
                        flex="10"
                        fill="#f00"
                        width="100%"
                        height="100%"
                    />
                    <Rectangle fill="#0f0" width="100%" height="50px" />
                </Column> */}
            </Layer>
        </>
    )
}

// export function Snake(props: SnakeProps) {
//     console.log("Snake.props", props)
//     return <Router />
// }

/*
function Router() {
    const [page, setPage] = useState("welcome")
    let w = window.innerWidth
    let h = window.innerHeight

    const onPlay = () => {
        console.log("set page game")
        setPage("game")
    }

    console.log("Snake.data", page)

    return (
        <>
            <Welcome width={w} height={h} onPlay={onPlay} page={page} />
            {page === "game" && (
                <pkrect x={0} y={0} width={w} height={h} fill="#f00" />
            )}
        </>
    )
}
*/
