
module.exports = {
    checkFileType: function (fileType) {
        return fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileType === 'application/pdf'
    }
};