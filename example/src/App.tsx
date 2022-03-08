import React from "react"
import { PinkKoala } from "pink-koala"
import { Example } from "./Example"

const App = () => {
    return (
        <PinkKoala
            drawing={Example}
            drawingProps={{}}
            size={{ width: window.innerWidth, height: window.innerHeight }}
            layers={["background", "main", "overlay"]}
        />
    )
}

export default App
