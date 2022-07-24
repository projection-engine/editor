import IMAGE_WORKER_ACTIONS from "../windows/project/libs/engine/data/IMAGE_WORKER_ACTIONS"

export default function imageWorker(){
    const src = `
    self.onmessage = async ({data: {type, data, id}}) => {
        const IMAGE_WORKER_ACTIONS = ${JSON.stringify(IMAGE_WORKER_ACTIONS)}
        try{
            switch (type){
                case IMAGE_WORKER_ACTIONS.RESIZE_IMAGE:{
                    const {image, width, height, sizePercent, quality} = data
                    const imageToLoad = await createImageBitmap(await (await fetch(image)).blob())
                    const widthF = width ? width : sizePercent ? imageToLoad.width * sizePercent : imageToLoad.width
                    const heightF = height ? height : sizePercent ? imageToLoad.height * sizePercent : imageToLoad.height
                    if (widthF === 0 || heightF === 0)
                        self.postMessage(undefined)
                    if (imageToLoad.width === widthF && imageToLoad.height === heightF)
                        self.postMessage(image)

                    else {
                        const canvas = new OffscreenCanvas(widthF, heightF),
                            ctx = canvas.getContext("2d")
                        ctx.drawImage(imageToLoad, 0, 0, widthF, heightF)
                        const canvasBlob = await canvas.convertToBlob({
                            type: "image/png",
                            quality: quality
                        })
                        const reader = new FileReader()
                        reader.readAsDataURL(canvasBlob)
                        reader.onloadend = () => self.postMessage({data: reader.result, id})
                    }
                    break
                }
                case IMAGE_WORKER_ACTIONS.COLOR_TO_IMAGE:{
                    const {
                        color,
                        resolution
                    } = data
                    const c = new OffscreenCanvas(resolution, resolution)
                    let ctx = c.getContext("2d")
                    ctx.fillStyle = typeof color === "string" ? color : "rgba(" + color[0] + ","+ color[1] + "," + color[2] + "," + color[3] +")"
                    ctx.fillRect(0, 0, resolution, resolution)
                    const canvasBlob = await c.convertToBlob({
                        type: "image/png",
                        quality: .1
                    })
                    const reader = new FileReader()
                    reader.onloadend = () => self.postMessage({data: reader.result, id})
                    reader.readAsDataURL(canvasBlob)

                    break
                }
                case IMAGE_WORKER_ACTIONS.IMAGE_BITMAP:{
                    const {base64, onlyData} = data
                    const b = onlyData ? base64 : base64.split(";base64,")[1]
                    const buffer = Buffer.from(b, "base64")
                    const blob = new Blob([buffer], { type: "base64" })
                    const bitmap = await  createImageBitmap(blob) 
                    self.postMessage({data: bitmap, id})
                    break
                }
                case IMAGE_WORKER_ACTIONS.NOISE_DATA: {
                    const { w, h } = data
                    const kernels = []
                    const RAND_MAX = 1.,
                        KERNEL_SIZE = 64

                    for (let i = 0; i < KERNEL_SIZE; i++) {
                        const scale = i / KERNEL_SIZE
                        const m = (0.1 + 0.9 * scale * scale)
                        const v = []
                        v[0] = (2.0 * Math.random() / RAND_MAX - 1.0) * m
                        v[1] = (2.0 * Math.random() / RAND_MAX - 1.0) * m
                        v[2] = (2.0 * Math.random() / RAND_MAX - 1.0) * m

                        kernels[i] = v
                    }

                    let p = w * h
                    const noiseTextureData = new Float32Array(p * 2)

                    for (let i = 0; i < p; ++i) {
                        let index = i * 2
                        noiseTextureData[index] = Math.random() * 2.0 - 1.0
                        noiseTextureData[index + 1] = Math.random() * 2.0 - 1.0
                    }
                    self.postMessage({data: {
                            noise: noiseTextureData,
                            kernels
                        }, id})
                    break
                }
                default:
                    self.postMessage({data: null, id})
                    break
            }

        }catch (error){
            console.error(error)
            self.postMessage({data: null, id})
        }
    }
    `
    const workerBlob = new Blob([src], {type: "application/javascript"});
    const workerUrl = URL.createObjectURL(workerBlob);
    return new Worker(workerUrl);
}

