module.exports = {
    filterDuplicates(pageAmount) {
        let completeProperties = [];
        for(let i = 1; i <= pageAmount; i++) {
            let obj = require(__dirname + `/../Controllers/apartments.com_page_${i}_12.29.18.json`);
            let properties = obj["properties"];
            for(let j = 0; j < properties.length; j++) {
                let isAdded = false;
                for(let k = 0; k < completeProperties.length; k++) {
                    if(properties[j].propertyName === completeProperties[k].propertyName) {
                        isAdded = true
                    }
                }
                if(!isAdded) {
                    completeProperties.push(properties[j])
                }
            }
        }
        return completeProperties;
    }
};