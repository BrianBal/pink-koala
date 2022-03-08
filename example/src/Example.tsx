/** @jsx createElement */
/** @jsxFrag Fragment */
import {
    createElement,
    useState,
    useEventListener,
    useTicker,
    pointLerp,
    Fragment,
    getSharedSupervisor
} from "pink-koala"

export function Example() {
    let w = window.innerWidth
    let h = window.innerHeight

    let [circlePt, setCirclePt] = useState({ x: 0, y: 0 })
    let [squarePt, setSquarePt] = useState({ x: 0, y: 10 })

    const onTrack = (e: MouseEvent) => {
        setCirclePt({ x: e.clientX, y: e.clientY })
    }

    const onStep = (e: any) => {
        let sup = getSharedSupervisor()
        console.log("onMouseMove", e, sup.currentContext)
        if (sup.currentContext) {
            sup.currentContext.requestRootUpdate()
            sup.currentContext.step({
                timeRemaining: () => {
                    return 4
                },
                didTimeout: false
            })
        }
    }

    useEventListener("mousemove", onTrack, [circlePt])
    useEventListener("keyup", onStep, [circlePt, setCirclePt])

    useTicker(() => {
        let pt = pointLerp({ x: squarePt.x, y: squarePt.y }, circlePt, 0.01)
        setSquarePt(pt)
    })

    return (
        <>
            <pklayer id="background">
                <pkrectangle x={0} y={0} width={w} height={h} fill="#00ca00" />
                <pkrectangle
                    x={0}
                    y={0}
                    width={w}
                    height={h / 3}
                    fill="#9999ff"
                />
            </pklayer>
            <pklayer id="main">
                <pkrectangle
                    x={squarePt.x}
                    y={squarePt.y}
                    width={20}
                    height={20}
                    fill="#f00"
                />
                <pkcircle
                    x={circlePt.x - 10}
                    y={circlePt.y - 10}
                    radius={10}
                    fill="#D00"
                />
                <pkpolygon
                    x={squarePt.x}
                    y={squarePt.y + 50}
                    width={20}
                    fill="#B00"
                    stroke="#fff"
                />
            </pklayer>
            <pklayer id="overlay">
                <pkgroup>
                    <pktext
                        font="20px Arial"
                        text="Hello World"
                        x={w / 2}
                        y={20}
                        fill="#fff"
                    />
                </pkgroup>
                <pkgroup>
                    <pktext
                        font="20px Arial"
                        text={`x: ${Math.floor(squarePt.x)}`}
                        x={w / 2}
                        y={40}
                        fill="#fff"
                    />
                </pkgroup>
            </pklayer>
        </>
    )
}
