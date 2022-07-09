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
    Row
} from "pink-koala"
import { PKEvent } from "../../../dist/models"
///import { Welcome } from "./Welcome"

/* type SnakeProps = {
    width: number
    height: number
} */

export function Snake() {
    return (
        <>
            <Layer id="main">
                <Row
                    height="200px"
                    width="100%"
                    onClick={(event: PKEvent) => {
                        console.log("Row Clicked", event)
                    }}
                >
                    <Rectangle
                        id="Rect0"
                        sides="8"
                        height="100%"
                        fill="#333"
                        flex="3"
                        onClick={(event: PKEvent) => {
                            console.log("Rectangle Clicked", event)
                        }}
                    />
                    <Polygon
                        id="rect1"
                        flex="2"
                        height="50%"
                        sides="3"
                        fill="#ac0000"
                        onClick={(event: PKEvent) => {
                            console.log("Triangle Clicked", event)
                        }}
                    />
                    <Polygon
                        id="rect2"
                        flex="2"
                        height="50"
                        sides="5"
                        fill="#00ac00"
                        onClick={(event: PKEvent) => {
                            console.log("Pentagon Clicked", event)
                        }}
                    />
                    <Polygon
                        flex="1"
                        id="rect1"
                        height="50%"
                        sides="8"
                        fill="#0000ac"
                        onClick={(event: PKEvent) => {
                            console.log("Octogon Clicked", event)
                        }}
                    />
                </Row>
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
