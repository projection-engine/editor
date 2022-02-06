const fs = window.require('fs')
const path = window.require('path')
const {app} = window.require('@electron/remote')

export default class Database {
    constructor(name, options) {
        this._path = app.getAppPath() + '/projects'

        // this.version(1).stores({
        //     project: 'id, meta, settings',
        //     entity: 'id, linkedTo, project, blob',
        //
        //     file: 'id, project, name, creationDate, parent, instanceOf, type, size, previewImage',
        //     blob: 'id, parentFile, data, partIndex'
        // });

        // this.open()
    }


    // BLOB
    async getBlob(fileID) {
        // let response = ''
        // return new Promise(resolve => {
        //     this.table('blob')
        //         .where({parentFile: fileID})
        //         .toArray()
        //         .then(data => {
        //             data.sort(sortBlobs)
        //             data.forEach(d => {
        //                 response += d.data
        //             })
        //
        //             resolve(response)
        //         })
        // })


    }

    async postBlob(parentFile, data) {
        //
        // const parts = splitData(data)
        // console.trace(parts)
        // let promises = []
        // parts.forEach((p, i) => {
        //     promises.push(new Promise(resolve => {
        //         this.table('blob')
        //             .add({
        //                 id: randomID(),
        //                 parentFile,
        //                 data: p,
        //                 partIndex: i
        //             })
        //             .then(() => resolve())
        //             .catch(() => resolve())
        //     }))
        // })
        //
        // return Promise.all(promises)
    }

    async _deleteBlobParts(fileID) {
        // const existing = await this.table('blob')
        //     .where({parentFile: fileID})
        //     .toArray()
        // let promises = []
        //
        // existing.forEach(e => {
        //     promises.push(new Promise(resolve => {
        //         this.table('blob')
        //             .delete(e.id)
        //             .then(() => resolve())
        //             .catch(() => resolve())
        //     }))
        // })
        // return Promise.all(promises)
    }

    async updateBlob(fileID, newData) {
        // await this._deleteBlobParts(fileID)
        // return await this.postBlob(fileID, newData)
    }

    // FILE
    async listFiles(filters = {}) {
        // return this.table('file')
        //     .where({...filters})
        //     .toArray();
    }

    async listFilesWithFilter(callback) {
        // return this.table('file').filter(callback).toArray()
    }

    async deleteFile(fileID) {
        // let promises = []
        // const dependents = await this.listFiles({parent: fileID})
        //
        //
        // dependents.forEach(d => {
        //     promises.push(new Promise(r => {
        //         this.deleteFile(d.id)
        //             .then(() => r())
        //             .catch(() => r())
        //     }))
        // })
        // promises.push(new Promise(r => {
        //     this._deleteBlobParts(fileID)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        //
        // promises.push(new Promise(r => {
        //     this.table('file').delete(fileID)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        // return Promise.all(promises)
    }

    async updateFile(fileID, data) {
        // return this.table('file').update(fileID, data)
    }

    async getFile(fileID) {
        // return this.table('file').get(fileID)
    }

    async getFileWithBlob(fileID) {

        // const blob = await this.getBlob(fileID)
        // const file = await this.table('file').get(fileID)
        // return {
        //     ...file,
        //     blob
        // }
    }

    async postFile(fileData) {
        // return this.table('file').add(fileData)
    }

    async postFileWithBlob(fileData, blob) {
        // try {
        //     delete fileData.blob
        // } catch (e) {
        // }

        // await this.table('file').add(fileData)
        //
        // await this.postBlob(fileData.id, blob)
    }

    // PROJECT
    async getProject(projectID) {
        // return this.table('project').get(projectID)
    }

    async postProject(projectData) {
        // return this.table('project').add(projectData)
    }

    async deleteProject(projectID) {
        // let promises = []

        // const files = await this.listFiles({project: projectID})
        // files.forEach(f => promises.push(
        //     new Promise(r => {
        //         this.deleteFile(f.id)
        //             .then(() => r())
        //             .catch(() => r())
        //     })
        // ))
        // promises.push(new Promise(r => {
        //     this.table('project')
        //         .delete(projectID)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        //
        // return Promise.all(promises)
    }

    async updateProject(projectID, data) {
        // return this.table('project').update(projectID, data)
    }

    async listProject() {

        return new Promise(resolve => {
            resolve(Database.fromDirectory(this._path,'.projection'))
        })
    }
    static fromDirectory(startPath, extension){

        if (!fs.existsSync(startPath)){
            return []
        }
        let res = []
        let files=fs.readdirSync(startPath);
        for(let i=0;i<files.length;i++){
            let filename=path.join(startPath,files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(...Database.fromDirectory(filename,extension))
            else if (filename.indexOf(extension)>=0)
                res.push(files[i])
        }

        return res
    }
    // ENTITIES
    async listEntities(projectID) {
        // return this.table('entity').where({project: projectID}).toArray()
    }

    async postEntity(data) {
        // return this.table('entity').add(data)
    }

    async updateEntity(id, data) {
        // return this.table('entity').update(id, data)
    }

    async deleteEntity(id) {
        // let promises = []
        //
        // const related = await this.table('entity').where({linkedTo: id}).toArray()
        // related.forEach(f => promises.push(
        //     new Promise(r => {
        //         this.deleteEntity(f.id)
        //             .then(() => r())
        //             .catch(() => r())
        //     })
        // ))
        // promises.push(new Promise(r => {
        //     this.table('entity').delete(id)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        //
        // return Promise.all(promises)
    }
}