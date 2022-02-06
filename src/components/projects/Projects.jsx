import styles from "./styles/Projects.module.css";
import EVENTS from "../../views/editor/utils/misc/EVENTS";
import PropTypes from 'prop-types'
import React, {useState} from "react";
import Card from "./components/Card";
import {Button} from "@f-ui/core";

export default function Projects(props) {

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                Your projects
              <div style={{display: 'flex', gap: '4px'}}>
                  <Button
                      className={styles.button}
                      variant={'outlined'}
                      onClick={() => props.onLoad()}>
                      Load project
                  </Button>
                  <Button
                      className={styles.button}
                      variant={'filled'}
                      onClick={() => props.onNew()}>
                      New project
                  </Button>
              </div>
            </div>
            <div className={styles.content}>
                {props.projects.map((p, i)=> (
                <React.Fragment key={p.id}>
                    <Card
                        onClick={() => props.redirect('/project?id=' + p.id)}
                        data={p} index={i}
                        onRename={newName  => {
                            // props.database.updateProject(p.id, {settings: JSON.stringify({...p.settings, projectName: newName})})
                        }}
                        onDelete={() => {
                            props.load.pushEvent(EVENTS.PROJECT_DELETE)
                            // props.database.deleteProject(p.id)
                            //     .then(() => {
                            //         props.load.finishEvent(EVENTS.PROJECT_DELETE)
                            //         props.refresh()
                            //     })
                            //     .catch(() => {
                            //         props.load.finishEvent(EVENTS.PROJECT_DELETE)
                            //     })

                        }}/>
                </React.Fragment>
                ))}
            </div>
        </div>

    )
}

Projects.propTypes = {
    onLoad: PropTypes.func,
    onNew: PropTypes.func,
    refresh: PropTypes.func,
    database: PropTypes.object,
    load: PropTypes.object,
    redirect: PropTypes.func,
    projects: PropTypes.array,
    setProjects: PropTypes.func
}