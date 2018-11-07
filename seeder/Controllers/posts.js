const fs = require('fs');
const dbmain = require("../../config/DB/DBmain");
const db = require('../../config/DB/config_db');
const uuidv4 = require('uuid/v4');
module.exports = {
    async seedPropertyOwnersAndNeighborhoods(file, cb) {
        let PropertyOwner = dbmain.model("PropertyOwner");
        let PropertyNeighborhood = dbmain.model("PropertyNeighborhood");
        try {
            fs.readFile(file + __dirname + '/apartments.com_scrape_data_10.6.2018.json', 'utf8', async function (err, data) {
                if (err) {
                    return cb(err, false);
                }
                let obj = JSON.parse(data);
                let properties = obj["properties"];
                await db.transaction(async t => {
                    let promises = [];
                    for(let i = 0; i < properties.length; i++) {
                        let newOwner = await PropertyOwner.findOrCreate({ where:
                                { 'propertyOwnerName' : properties[i].propertyOwnerName }});
                        let newNeighborhood = await PropertyNeighborhood.findOrCreate({ where:
                                { 'propertyNeighborhoodName' : properties[i].propertyNeighborhood }});
                        promises.push(newOwner);
                        promises.push(newNeighborhood);
                    }
                    return Promise.all(promises);
                }).then(() => {
                    console.log("Database successfully seeded");
                    return cb(null, true);
                })
            });
        } catch(error) {
            return cb(error, false);
        }
    },
    async seedProperties(file, cb) {
        let Property = dbmain.model("Property");
        let PropertyOwner = dbmain.model("PropertyOwner");
        let PropertyNeighborhood = dbmain.model("PropertyNeighborhood");
        let PropertyUnit = dbmain.model("PropertyUnit");
        let Location = dbmain.model("Location");
        let Image = dbmain.model("Image");
        let Amenity = dbmain.model("Amenity");
        let AmenityFeature = dbmain.model("AmenityFeature");

        try {
            let obj = require(__dirname + '/apartments.com_scrape_data_10.6.2018.json');

                let resultArr = obj["properties"];
                let properties = [];
                let names = [];
                let neighborhoods = [];
                for(let x = 0; x < resultArr.length; x++) {
                    if(neighborhoods.includes(resultArr[x].propertyNeighborhood)){
                        console.log('Neighborhood already added')
                    } else {
                        resultArr[x].propertyNeighborhood.id = uuidv4();
                        neighborhoods.push(resultArr[x].propertyNeighborhood);
                    }
                }
                for(let x = 0; x < resultArr.length; x++){
                    let owner_property = {};
                    let temp_owner = {};
                    if(names.includes(resultArr[x].propertyOwnerName)){
                        owner_property = Object.assign({}, resultArr[x]);
                        let location = names.indexOf(resultArr[x].propertyOwnerName);
                        properties[location].push(owner_property);
                        console.log("Property Owner already exists");
                    }
                    else{
                        names.push(resultArr[x].propertyOwnerName);
                        properties[names.indexOf(resultArr[x].propertyOwnerName)] = [];
                        let location = names.indexOf(resultArr[x].propertyOwnerName);
                        properties[location].push(resultArr[x].propertyOwnerName);
                        owner_property = Object.assign({}, resultArr[x]);
                        owner_property.id = uuidv4();
                        properties[location].push(owner_property);
                        console.log("New property owner added");

                    }
                }
                console.log(properties);
                let s_properties = [];
                for (let x = 0; x < properties.length; x++) {
                    for (let j = 1; j < properties[x].length; j++) {
                        s_properties.push(properties[x][j]);
                        console.log('Property added...');
                    }

                }

                let property_owner = dbmain.model("PropertyOwner");
                let neighborhood = dbmain.model("PropertyNeighborhood");
                let property = dbmain.model("Property");
                await db.transaction(async t => {
                    let amenitiesCount = 0;
                    let promises = [];
                    for (let i = 0; i < properties.length; i++) {
                        let newOwner = property_owner.create(await {'propertyOwnerName': properties[i][0], 'id': uuidv4()}, {transaction: t});
                        promises.push(newOwner);
                    }
                    let neighborhoodPromises = [];
                    for (let i = 0; i < neighborhoods.length; i++) {
                        let newNeighborhood = neighborhood.create(await {'propertyNeighborhoodName': neighborhoods[i], 'id': uuidv4()}, {transaction: t});
                        neighborhoodPromises.push(newNeighborhood);
                    }
                    promises.push.apply(promises, neighborhoodPromises);
                    return Promise.all(promises).then(async (ownersAndNeighborhoods) => {
                        let owners = ownersAndNeighborhoods.slice(0, properties.length);
                        let neighborhoods = ownersAndNeighborhoods.slice(properties.length, ownersAndNeighborhoods.length);

                        let propertyPromises = [];
                        for (let i = 0; i < owners.length; i++) {
                            for (let j = 1; j < properties[i].length; j++) {
                                for(let x = 0; x < neighborhoods.length; x++) {
                                    let neighbor = properties[i][j].propertyNeighborhood;
                                    if(neighborhoods[x].propertyNeighborhoodName === neighbor) {
                                        properties[i][j].neighborId = neighborhoods[x].id
                                    }
                                }
                                propertyPromises.push(await owners[i].createProperty({
                                    'id': uuidv4(),
                                    'propertyName': properties[i][j].propertyName,
                                    'propertyPhoneNumber': properties[i][j].propertyPhoneNumber,
                                    'propertyWebsite': properties[i][j].propertyWebsite_url,
                                    'PropertyOwnerId': owners[i].id,
                                    'PropertyNeighborhoodId': properties[i][j].neighborId
                                }, {transaction: t}))
                            }
                        }
                        return Promise.all(propertyPromises).then(async (props) => {
                            let unitPromises = [];
                            let imgPromises = [];
                            let amenityPromises = [];
                            for (let m = 0; m < props.length; m++) {
                                if(s_properties[m].properyUnit){
                                    for (let j = 0; j < s_properties[m].properyUnit.length; j++) {
                                        unitPromises.push(await props[m].createPropertyUnit({
                                            'id':uuidv4(),
                                            'name': s_properties[m].properyUnit[j].propertyUnitName,
                                            'bedroomAmount': s_properties[m].properyUnit[j].bedrooms,
                                            'bathroomAmount': s_properties[m].properyUnit[j].bathrooms,
                                            'rentPrice': s_properties[m].properyUnit[j].rent,
                                            'squareFeet': s_properties[m].properyUnit[j].squareFeet,
                                            'availability': s_properties[m].properyUnit[j].availability,
                                            'PropertyId': props[m].id
                                        }, {transaction: t}))
                                    }
                                }
                                if(s_properties[m].images) {
                                    for (let j = 0; j < s_properties[m].images.length; j++) {
                                        console.log(s_properties[m].images.length);
                                        imgPromises.push(await props[m].createImage({
                                            'id':uuidv4(),
                                            'ImgUrl': s_properties[m].images[j].url.match(/https.*\.jpg/)[0],
                                            'PropertyId': props[m].id
                                        }, {transaction: t}))
                                    }
                                }
                                unitPromises.push( await props[m].createLocation({
                                    'id':uuidv4(),
                                    'streetAddress': s_properties[m].propertyAddress,
                                    'city': s_properties[m].propertyCity,
                                    'state': s_properties[m].propertyState,
                                    'zipCode': s_properties[m].propertyZipCode,
                                    'PropertyId': s_properties[m].id
                                }, {transaction: t}));

                                if(s_properties[m].Amenities) {
                                    for (let j = 0; j < s_properties[m].Amenities.length; j++) {
                                        if(s_properties[m].Amenities[j].feature) {
                                            for(let k = 0; k < s_properties[m].Amenities[j].feature.length; k++) {
                                                amenityPromises.push(await props[m].createAmenity({
                                                    'id':uuidv4(),
                                                    'amenityName': s_properties[m].Amenities[j].feature[k].name,
                                                    'PropertyId': props[m].id
                                                }, {transaction: t}))
                                            }
                                        }
                                    }
                                }
                            }

                            unitPromises.push.apply(unitPromises, imgPromises);
                            unitPromises.push.apply(unitPromises, amenityPromises);
                            return Promise.all(unitPromises)
                        })
                    })
                }).then(() => {
                    console.log("Database successfully seeded");
                    return cb(null, true)
                }).catch(err => {
                    console.log("An error occurred trying to seed the database" + err);
                    return cb(err, false)
                })
        }catch(err) {
            return cb(err, false);
        }
    }
};