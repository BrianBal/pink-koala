/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { createElement, Fragment, useEventListener } from "pink-koala"
import { Button } from "../components/Button"
import { Row } from "../components/Row"
import { Column } from "../components/Column"

type WelcomeProps = {
    height: number
    width: number
    onPlay: () => void
}

export function Welcome(props: WelcomeProps) {
    const onClick = () => {
        props.onPlay()
    }

    useEventListener("click", onClick, [onClick, props.onPlay])

    console.log("Welcome")

    return (
        <>
            <pklayer id="background">
                <pkrect
                    x={0}
                    y={0}
                    width={props.width}
                    height={props.height}
                    fill="#232323"
                />
            </pklayer>
            <pklayer id="main">
                <pkrect x="0" y="0" width="375" height="480" fill="#666">
                    <Column
                        x="0"
                        y="0"
                        width="375"
                        height="480"
                        justifyContent="center"
                    >
                        <pktext
                            x="0"
                            height="75"
                            text="SNAKE"
                            fill="#23CC23"
                            font="50px Verdana"
                            center
                        />
                        <Row
                            justifyContent="space-evenly"
                            x="0"
                            height="40"
                            width="375"
                        >
                            <Button
                                width={120}
                                height={40}
                                text="Leaders"
                                onClick={onClick}
                                strokeWidth="2"
                            />
                            <Button
                                width={120}
                                height={40}
                                text="Play"
                                onClick={onClick}
                                strokeWidth="2"
                            />
                            <Button
                                width={100}
                                height={40}
                                text="Quit"
                                onClick={onClick}
                                strokeWidth="2"
                            />
                        </Row>
                    </Column>
                </pkrect>
            </pklayer>
            <pklayer id="overlay"></pklayer>
        </>
    )
}
