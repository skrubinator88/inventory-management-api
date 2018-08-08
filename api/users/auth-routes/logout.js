"use strict";
//route used for logging a user out
module.exports = function (req, res) {
    req.logout();
    console.log(req.isAuthenticated());
    res.send('successfully logged out');
};
