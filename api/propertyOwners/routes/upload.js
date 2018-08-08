'use strict';
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileUploadController = require('../Services/fileUploadService');
const postController = require('../Controllers/posts');

const uploadInvoices = multer({
    storage: multer.memoryStorage()
}).array('propertyOwnerInvoices', 5);

module.exports = function (req, res, next) {
    let propertyOwnerId = parseInt(req.params.propertyOwnerId);
    if (Number.isNaN(propertyOwnerId)) {
        res.status(400).send({
            error: 'property Owner id must be a number'
        });
        return;
    }
    uploadInvoices(req, res, (err) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        if(!req.file && req.files.length === 0) {
            console.log('User did not provide a file');
            return res.status(400).send({
                success: false
            })
        }
        for( let i = 0; i < req.files.length; i++) {
            try{
                let file = req.files[i];
                let buffer = req.files[i].buffer;
                let fileName = req.files[i].fieldname + '-' + Date.now() + path.extname(req.files[i].originalname);
                if(fileUploadController.checkFileType(file.mimetype)) {
                    let fileLocation = './uploads/' + fileName;
                    console.log(fileLocation);
                    fs.writeFile(fileLocation, buffer, 'binary', function(err) {
                        if(err) {
                            console.error(err);
                            return res.status(500).send({
                                error: 'There was an error trying to upload file'
                            });
                        }
                        let opts = {
                            name: req.files[i].originalname,
                            location: fileLocation,
                            propertyId: req.body.propertyId || null
                        };
                        postController.addPropertyOwnerInvoice(propertyOwnerId, opts, (err, file) => {
                            if(err) {
                                console.error(err);
                                return res.status(500).send({
                                    error: 'There was an error trying to upload file'
                                });
                            }
                            if(file) {
                                return res.status(200).send()
                            }
                        });
                    })
            } else {
                    console.log('filetype is incorrect');
                    return res.status(400).send({
                        error: 'Invalid filetype'
                    })
                }
            } catch (err) {
                console.error(err);
                return next(err)
            }
        }

        // console.log(req.file);
        // if(err) {
        //     return res.status(500).send({
        //         error: 'Error uploading file'
        //     })
        // }
        // res.status(200).end();
    });
};