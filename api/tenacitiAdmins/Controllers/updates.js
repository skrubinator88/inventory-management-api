'use strict';
const dbmain = require('../../../config/DB/DBmain');

module.exports = {
    async updateUserById (id, attributes) {
        let User = dbmain.model('User');
        try {
            let updatedUser = User.update( attributes, { where: { id: id } });
            return 'success';
        } catch (err) {
            console.error(err);
            return 'fail';
        }
    },
    async updateProfilePhoto (id, imgLocation) {
        let Image = dbmain.model('Image');
        Image.findOrCreate({
            where: {UserId: id}
        }).spread(async (photo, created) => {
            try {
                if (photo) {
                    let updatedPhoto = await Image.update({imgUrl: imgLocation}, {where: {id: photo.id}});
                }
            } catch (err) {
                console.error(err);
            }
        })
    }
};