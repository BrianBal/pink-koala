import React from "react"
import { PinkKoala } from "pink-koala"
//import { Example } from "./Example"
import { Snake } from "./Snake"

const App = () => {
    return (
        <PinkKoala
            drawing={Snake}
            drawingProps={{}}
            size={{ width: window.innerWidth, height: window.innerHeight }}
            layers={["background", "main", "overlay"]}
        />
    )
}

export default App
