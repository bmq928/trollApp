const fs = require('fs')
const path = require('path')
const rootMedia = 'media'

const dir = (req, res) => {
    const root = path.join(__dirname, '..', '..', 'public', 'media')

    console.log('start')


    // const findAllDir = (root) => {

    //     const data = {}
    //     const makeNewFolder = (folder) => {
    //         data[folder] = []
    //     }

    //     // push the chosen file to data_variable that the attribute is folder
    //     const addAFileToFolder = (folder, file) => {
    //         data[folder].push({
    //             file: file,
    //             link: path.join(rootMedia, folder, file)
    //         })
    //     }
    //     const readdirPromise = (dir) => {
    //         return new Promise((resolve, reject) => {
    //             fs.readdir(dir, (err, files) => {
    //                 if (err) reject(err)
    //                 else resolve(files)
    //             })
    //         })
    //     }

    //     //return a promise
    //     //attach all file in a dir to the data_variable that the attribute is folder

    //     return readdirPromise(root)
    //         .then(folders => {
    //             folders.forEach(folder => {
    //                 const dir = path.join(root, folder);
    //                 readdirPromise(dir)
    //                     .then(files => {
    //                         files.forEach(file => {
    //                             addAFileToFolder(folder, file);
    //                         })
    //                     }).catch(err => console.error.bind(console))
    //             })
    //             return data;
    //         })
    //         .catch(err => console.error.bind(console))

    //     // return new Promise((resolve, reject) => {
    //     //     fs.readdir(root, (err, folders) => {
    //     //         if (err) reject(err)
    //     //         else resolve(folders)
    //     //     })
    //     // }).then(folders => {
    //     //     folders.forEach(folder => {
    //     //         makeNewFolder(folder);
    //     //         const dir = path.join(root, folder);
    //     //         fs.readdir(dir, (err, files) => {
    //     //             if (err) console.error.bind(console)
    //     //             else {
    //     //                 // console.log(data)
    //     //                 files.forEach(file => {
    //     //                     addAFileToFolder(folder, file)
    //     //                 })
    //     //             }
    //     //         })

    //     //     })
    //     //     return data;
    //     // })
    // }

    // const findAllDir = (root) => {
    //     // let folderList = []
    //     let data = {}

    //     return new Promise((resolve, reject) => {
    //         fs.readdir(root, (err, folders) => {
    //             if (err) reject(err)
    //             else resolve(folders)
    //         })
    //     }).then(folders => {
    //         let promises = []


    //         folders.forEach(folder => {
    //             const dir = path.join(root, folder);
    //             data[folder] = []

    //             promises.push(new Promise((resolve, reject) => {
    //                 fs.readdir(root, (err, files) => {
    //                     if (err) reject(err)
    //                     else resolve(files)
    //                 })
    //             }).then(files => {
    //                 return files.map(file => {
    //                     return {
    //                         folder,
    //                         file,
    //                         link: path.join(rootMedia, folder, file)
    //                     }
    //                 })
    //             }).catch(err => console.log(err)))
    //         })

    //         Promise.all(promises).then(values => {
    //             values.forEach(arr => arr.forEach(item => {
    //                 const { folder, file, link } = item;
    //                 data[folder].push({ file, link })
    //             }))
    //         })

    //     }).then(() => data)


    // }

    const readFolder = (root) => {

        return new Promise((resolve, reject) => {
            fs.readdir(root, (err, files) => {
                if (err) reject(err)
                else resolve(files)
            })
        })
    }

    //because if use findAllDir(root).then() we will create 2 branch of promise
    readFolder(root)
        .then(folders => {
            let data = {}
            folders.forEach(folder => {
                const dir = path.join(root, folder);
                try {
                    data[folder] = fs.readdirSync(dir).map(file => {
                        return {
                            file,
                            link: path.join(rootMedia, folder, file)
                        }
                    })
                } catch (err) {
                    console.error(err)
                    throw err;
                }
            })
            return data;
        }).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).json(err)
        })
}

module.exports.dir = dir