const path = require('path');
const { v4: uuidv4 } = require('uuid')


const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const splittedFilename = archivo.name.split('.');
        const extension = splittedFilename[splittedFilename.length - 1];

        if (!allowedExtensions.includes(extension)) {
            return reject(`El archivo no tiene una extensión permitida (${extension}). Intente con un archivo tipo ${allowedExtensions}`)
        }

        const uniqueFilename = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, uniqueFilename);

        archivo.mv(uploadPath, err => {
            if (err) {
                return reject(err);
            }

            resolve(uniqueFilename);
        });

    })

}

module.exports = {
    uploadFile
}