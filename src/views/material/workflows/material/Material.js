import Response from "../../templates/Response";

export default class Material extends Response {
    albedo
    metallic
    height
    roughness
    normal
    ao
    constructor() {
        super(
            [
                {label: 'Albedo', key: 'albedo', accept: ['Rgb', 'Rgba', 'TextureSample']},
                {label: 'Metallic', key: 'metallic', accept: ['Rgb', 'Rgba', 'TextureSample']},
                {label: 'Height', key: 'height', accept: ['Rgb', 'Rgba', 'TextureSample']},
                {label: 'Roughness', key: 'roughness', accept: ['Rgb', 'Rgba', 'TextureSample']},
                {label: 'Normal', key: 'normal', accept: ['Rgb', 'Rgba', 'TextureSample']},
                {label: 'Ambient occlusion', key: 'ao', accept: ['Rgb', 'Rgba', 'TextureSample']},
            ]);

        this.name = 'Material'

    }

}