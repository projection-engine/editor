import {Alert, Button, Modal, TextField,} from "@f-ui/core";
import styles from './styles/Home.module.css'
import React from "react";
import Projects from "./components/projects/Projects";

import PropTypes from "prop-types";
import FileSystem from "../../services/workers/FileSystem";

import EVENTS from "../../services/utils/misc/EVENTS";
import useProjects from "./hooks/useProjects";
import SideBar from "./components/sidebar/SideBar";

const fs = window.require('fs')
export default function Home(props) {
    const {
        projects,
        openModal, setOpenModal,
        projectName, setProjectName,
        alert, setAlert,
        load, uploadRef,
          setProjects,
        startPath, setStartPath
    } = useProjects(fs)

    return (
        <div className={styles.wrapper}>

            <Alert open={alert.type !== undefined} variant={alert.type} handleClose={() => setAlert({})}>
                <div style={{color: 'var(--fabric-color-primary)'}}>
                    {alert.message}
                </div>
            </Alert>
            <Modal
                open={openModal}
                handleClose={() => {
                    setProjectName('')
                    setOpenModal(false)
                }} className={styles.modal}>
                <TextField
                    handleChange={e => setProjectName(e.target.value)}
                    label={'Project name'}
                    placeholder={'Project name'}
                    value={projectName} size={'small'}/>
                <Button
                    variant={'filled'}
                    disabled={projectName === ''}
                    className={styles.submitButton}
                    onClick={() => {
                        FileSystem.createProject(projectName)
                            .then(res => {
                                setProjects(prev => {
                                    return [...prev, {
                                        id: res,
                                        meta: {
                                            name: projectName
                                        }
                                    }]
                                })
                            })

                        setProjectName('')
                        setOpenModal(false)

                    }}
                >
                    Create project
                </Button>
            </Modal>
            <SideBar  />
            <input style={{display: 'none'}}
                   type={'file'}
                   accept={['.projection']}
                   onChange={f => {
                       load.pushEvent(EVENTS.PROJECT_IMPORT)
                       // TODO - IMPORT
                       f.target.value = ''
                   }}
                   ref={uploadRef}/>

            <Projects
                onNew={() => setOpenModal(true)}
                onLoad={() => uploadRef.current.click()}

                deleteProject={pjID => {
                    load.pushEvent(EVENTS.PROJECT_DELETE)

                    fs.rm(
                        localStorage.getItem('basePath') + '\\projects\\' + pjID,
                        {recursive: true, force: true},
                        (e) => {

                            load.finishEvent(EVENTS.PROJECT_DELETE)
                            setProjects(prev => {
                                return prev.filter(e => e.id !== pjID)
                            })
                        })
                }}
                renameProject={(newName, projectID) => {
                    const pathName = localStorage.getItem('basePath') + projectID + '/.meta'
                    fs.readFile(pathName, (e, res) => {
                        if (res && !e) {
                            fs.writeFile(pathName, JSON.stringify({
                                ...JSON.parse(res.toString()),
                                name: newName
                            }), (e) => {
                                if (!e)
                                    setAlert({
                                        type: 'success',
                                        message: 'Project renamed'
                                    })
                                else
                                    setAlert({
                                        type: 'error',
                                        message: 'Error renaming project.'
                                    })
                            })
                        }
                    })
                }}
                refresh={() => refresh()}
                load={load} projects={projects}
                redirect={id => {
                    props.redirect(id)
                }}
                setProjects={setProjects}/>
        </div>
    )
}

Home.propTypes = {
    redirect: PropTypes.func.isRequired
}