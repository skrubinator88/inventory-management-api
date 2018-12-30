'use strict';

const dbmain = require('../../../config/DB/DBmain');
// const { sendNotification } = require('../../../config/apnManager');

module.exports = {
    async deleteImage (imageId, cb) {
        let Image = dbmain.model('Image');
        try {
            await Image.destroy({
                where: {
                    id: imageId
                }
            });
            cb(null, true);
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }
};