import React from "react"
import { PinkKoala } from "pink-koala"
//import { Example } from "./Example"
// import { Snake } from "./Snake"
import { Demo } from "./Demo"

const App = () => {
    return (
        <PinkKoala
            drawing={Demo}
            drawingProps={{}}
            size={{ width: window.innerWidth, height: window.innerHeight }}
            layers={["background", "main", "overlay"]}
        />
    )
}

export default App
