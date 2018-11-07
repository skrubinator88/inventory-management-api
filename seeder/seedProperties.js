const postsController = require('./Controllers/posts');

module.exports = function(req, res, next) {
    postsController.seedProperties('', function(err, seeded) {
        if(err) {
            return next(err);
        }
        if(seeded) {
            res.status(200).send('Database has been successfully seeded')
        }
    });
};