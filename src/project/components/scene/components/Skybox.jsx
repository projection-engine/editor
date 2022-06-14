import styles from "../styles/Forms.module.css"
import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import Selector from "../../../../components/selector/Selector"
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import ImageProcessor from "../../../engine/utils/image/ImageProcessor"
import FileSystem from "../../../utils/files/FileSystem"

export default function Skybox(props) {
    const [currentImage, setCurrentImage] = useState(undefined)
    const [state, setState] = useState({
        resolution: props.selected.resolution,
        // gamma: props.selected.gamma, exposure: props.selected.exposure
    })

    useEffect(() => {
        if (props.selected.imageID) setCurrentImage(props.quickAccess.images.find(i => i.registryID === props.selected.imageID))
    }, [])

    const checkIcon = "check"
    return (<>
        <AccordionTemplate title={"Environment map"}>
            <Selector
                type={"image"}
                selected={currentImage}
                handleChange={async (src) => {
                    const rs = await document.fileSystem.readRegistryFile(src.registryID)
                    const file = !rs ? null : await document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + rs.path)
                    const res = !file ? null : await ImageProcessor.getImageBitmap(file)
                    if (res) {
                        props.submit({
                            blob: res, imageID: src.registryID
                        }, "blob")
                        setCurrentImage(props.quickAccess.images.find(i => i.registryID === src.registryID))
                    }
                }}
            />
        </AccordionTemplate>
        <AccordionTemplate title={"Resolution"}>
            <Dropdown className={styles.dropdown} styles={{background: "var(--pj-border-primary)"}}>
                {state.resolution}p
                <DropdownOptions>
                    <DropdownOption option={{
                        label: "512p",
                        icon: state.resolution === 512 ? checkIcon : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 512
                            })
                            props.submit(512, "resolution")
                        }
                    }}/>
                    <DropdownOption option={{
                        label: "1024p",
                        icon: state.resolution === 1024 ?checkIcon: undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 1024
                            })
                            props.submit(1024, "resolution")
                        }
                    }}/>
                    <DropdownOption option={{
                        label: "2048p",
                        icon: state.resolution === 2048 ? checkIcon : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 2048
                            })
                            props.submit(2048, "resolution")
                        }
                    }}/>
                    <DropdownOption option={{
                        label: "4096p",
                        icon: state.resolution === 4096 ? checkIcon : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 4096
                            })
                            props.submit(4096, "resolution")
                        }
                    }}/>
                </DropdownOptions>
            </Dropdown>
        </AccordionTemplate>
    </>)
}

Skybox.propTypes = {
    quickAccess: PropTypes.object, database: PropTypes.object, selected: PropTypes.object, submit: PropTypes.func
}