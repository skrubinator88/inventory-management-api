'use strict';
const dbmain = require('../../../config/DB/DBmain');
const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = {
    async updateUserById (id, attributes) {
        return new Promise(async (resolve, reject) => {
            let User = dbmain.model('User');
            try {
                if(attributes.password) {
                    let user = await User.findById(id);
                    if (user.password === attributes.password) {
                        return resolve(false)
                    } else {
                        bcrypt.genSalt(saltRounds, async (err, salt) => { //generate salt using saltRounds provided
                            if(err) return reject(err);
                                bcrypt.hash(attributes.password, salt, async (err, hash) => {
                                    if(err) return reject(err);
                                    //generate hash using password and salt generated
                                    attributes.password = hash;
                                    await User.update( attributes, { where: { id: id } });
                                    return resolve(true)
                                });
                        });
                    }
                } else {
                    await User.update( attributes, { where: { id: id } });
                    return resolve(true)
                }
            } catch (err) {
                return reject(err)
            }
        })
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