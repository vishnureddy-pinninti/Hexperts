const loginMiddleware = require('../middlewares/loginMiddleware');
const { upload } = require('../utils/uploads');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.post('/api/v1/image.upload', loginMiddleware, upload.any(), async(req, res) => {
        res
            .status(200)
            .json({
                status: 'success',
                id: req.files[0].filename,
                path: `/api/v1/images/${req.files[0].filename}`,
            });
    });

    app.get('/api/v1/image-delete/:imageID', loginMiddleware, async(req, res) => {
        const { imageID } = req.params;
        fs.unlink(path.join(__dirname, '../uploads/img/', imageID), (err) => {
            if (err) {
                res
                    .status(500)
                    .json({
                        status: 'failure',
                    });
            }
            else {
                res
                    .status(200)
                    .json({
                        status: 'success',
                    });
            }
        });
    });
};