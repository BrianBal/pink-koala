import type { Size, AttributeCollection } from "./models/";
import "./PinkKoala.css";
export declare type PinkKoalaProps = {
    drawing: any;
    drawingProps: AttributeCollection | null;
    layers: string[];
    size: Size;
};
export declare const PinkKoala: (props: PinkKoalaProps) => JSX.Element;
