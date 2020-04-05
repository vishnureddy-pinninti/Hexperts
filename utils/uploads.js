const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/img'));
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
});

const deleteImage = (imageUrl) => {
    let imageID = imageUrl;
    if (imageID.indexOf('/api/v1/images/' > -1)) {
        imageID = imageID.split('/api/v1/images/')[1];
    }
    fs.unlink(path.join(__dirname, '../uploads/img/', imageID), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    upload,
    deleteImage,
};