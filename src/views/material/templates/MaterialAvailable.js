import TextureSample from "../workflows/material/TextureSample";
import Color from "../workflows/material/Color";

export const materialAvailable=[
    {
        label: 'Texture sample',
        dataTransfer: 'texture-sample',
        tooltip: 'Texture sample node.',
        getNewInstance: () => new TextureSample()
    },
    {
        label: 'Color',
        dataTransfer: 'rgb',
        tooltip: 'Color node.',
        getNewInstance: () => new Color()
    }
]