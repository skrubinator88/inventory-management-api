"use strict";
const queryController = require('../Controllers/queries');
//route used for retrieving a specific user
module.exports = async function (req, res) {
    req.io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('newMessage', function() {
            console.log('new message recieved');
        });
    });
    let inquiryLogId = parseInt(req.params.inquiryLogId);
    if (Number.isNaN(inquiryLogId)) {
        res.status(400).send({
            error: 'property owner id must be a number'
        });
        return;
    }
    await queryController.getInquiryLogById(inquiryLogId, function(err, inquiryLog) {
        if(err) {
            return res.status(500).send({
                error: 'An error occurred trying to retrieve property admin'
            })
        } else {
            res.status(200).send(inquiryLog)
        }
    })
};