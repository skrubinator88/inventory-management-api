const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const Xray = require('x-ray');
const x = Xray();
const $ = require('jquery');
const dbmain = require("../config/DB/DBmain");
const db = require('../config/DB/config_db');


module.exports = function(req, res) {
   nightmare
        .goto("https://www.apartments.com/")
        .wait(2500)
        .type('input[id="quickSearchLookup"]', 'atlanta, ga')
        .wait(2500)
        .click('a[class="go"]')
        .wait(3000)
        .then( async function() {
            let urls = [];
            for (let i = 1; i <= 28; i++) {
                let url = 'https://www.apartments.com/' + i + '/?bb=4oyh04ijgIg4qk5mP';
                urls.push(url);
            }
            await urls.reduce(function (accumulator, url,) {
                return accumulator.then(function (results) {
                    return nightmare
                        .goto(url)
                        .wait(3000)
                        .evaluate(async function () {
                            let properties = [];
                            await $('.placardHeader').each(function () {

                                let object = {};
                                let a = $(this).find('a');
                                let location = $(this).find('.location');
                                object["address"] = location.text();
                                object["link"] = a.attr('href');
                                properties.push(object);
                            });
                            return properties;
                        })
                        .then(function (result) {
                            results.push.apply(results, result);
                            return results;
                        });
                });
            }, Promise.resolve([]))
                .then(function (hrefs) {
                    return hrefs.reduce((accumulator, href) => {
                        //return the accumulated promise results, followed by...
                        return accumulator.then(function (results) {
                            return nightmare
                                .wait(2000)
                                //click on the href
                                .goto(href.link)
                                //get the html
                                .evaluate(async function () {
                                    let units = [];
                                    let object = {};
                                    let address = '';
                                   await $('.propertyAddress').each(function() {
                                        let address_column = $('h2', this);
                                        address_column.find("span").each(function() {
                                            address += $(this).text() + ', ';
                                        })
                                    });
                                    object["location"] = address;
                                    let logo = $('.logoColumnContainer');
                                    object["owner"] = logo.find('.logo').attr('alt') || 'empty';
                                    object["name"] = $('.propertyName').text().split("\n")[1].trim();
                                    object["phoneNumber"] = $('.contactPhone').text().substring(0,12);
                                   await $('.rentalGridRow').each(function () {
                                        let unit = {};
                                        unit["name"] = $(this).find('.unit  ').text();
                                        unit["bedrooms"] = $(this).attr('data-beds');
                                        unit["bathrooms"] = $(this).attr('data-baths');
                                        unit["rentPrice"] = $(this).find('.rent').text().split("\n")[1].trim();
                                        unit["squareFeet"] = $(this).find('.sqft').text();
                                        unit["deposit"] = $(this).find('.deposit ').text();
                                        unit["availability"] = $(this).find('.available').text().split("\n")[1].trim();
                                        units.push(unit);
                                    });
                                    object["units"] = units;
                                    let imgs = [];
                                    await $('.itemInner').each(function () {
                                        let img = {};
                                        let imgInfo = $(this).find('img');
                                        img["src"] = imgInfo.attr('src');
                                        imgs.push(img);
                                    });
                                    object["images"] = imgs;
                                    return object
                                }).then(function(result) {
                                    results.push(result);
                                    return results;
                                })
                        })
                    }, Promise.resolve([])) //kick off the reduce with a promise that resolves an empty array
                        .then(async function (resultArr) {
                            //if I haven't made a mistake above with the `Array.reduce`, `resultArr` should now contain all of your links' results
                            let properties = [];
                            let names = [];
                            for(let x = 0; x < resultArr.length; x++){
                                let owner_property = {};
                                let temp_owner = {};
                                if(names.includes(resultArr[x].owner)){
                                    owner_property = Object.assign({}, resultArr[x]);
                                    let location = names.indexOf(resultArr[x].owner);
                                    properties[location].push(owner_property);
                                    console.log("Property Owner already exists");
                                }
                                else{
                                    names.push(resultArr[x].owner);
                                    temp_owner = [];
                                    properties[names.indexOf(resultArr[x].owner)] = temp_owner;
                                    let location = names.indexOf(resultArr[x].owner);
                                    properties[location].push(resultArr[x].owner);
                                    owner_property = Object.assign({}, resultArr[x]);
                                    properties[location].push(owner_property);
                                    console.log("New property owner added");

                                }
                            }
                            console.log(properties);
                            let s_properties = [];
                            for(let x = 0; x < properties.length; x++){
                                for(let j = 1; j < properties[x].length; j++){
                                    s_properties.push(properties[x][j]);
                                    console.log('Property added...');
                                }
                            }

                            let property_owner = dbmain.model("PropertyOwner");
                            let property = dbmain.model("Property");
                            await db.transaction(t => {
                                let promises = [];
                                for(let i = 0; i < properties.length; i++){
                                    let newOwner = property_owner.create({ 'name': properties[i][0]}, { transaction: t });
                                    promises.push(newOwner);
                                }
                                return Promise.all(promises).then((owners) => {
                                    let propertyPromises = [];
                                    for( let i = 0; i < owners.length; i++){
                                        for( let j = 1; j < properties[i].length; j++) {
                                            propertyPromises.push(owners[i].createProperty({
                                                'name': properties[i][j].name,
                                                'location': properties[i][j].location,
                                                'phoneNumber': properties[i][j].phoneNumber,
                                                'PropertyOwnerId': owners[i].id
                                            }, { transaction: t }))
                                        }
                                    }
                                    return Promise.all(propertyPromises).then((props) => {
                                        let unitPromises = [];
                                        let imgPromises = [];
                                        for(let m = 0; m < props.length; m++){
                                            for(let j = 0; j < s_properties[m].units.length; j++){
                                                unitPromises.push(props[m].createPropertyUnit({
                                                    'name': s_properties[m].units[j].name,
                                                    'bedroomAmount': s_properties[m].units[j].bedrooms,
                                                    'bathroomAmount': s_properties[m].units[j].bathrooms,
                                                    'rentPrice': s_properties[m].units[j].rentPrice,
                                                    'squareFeet': s_properties[m].units[j].squareFeet,
                                                    'depositAmount': s_properties[m].units[j].deposit,
                                                    'availability': s_properties[m].units[j].availability,
                                                    'PropertyId': props[m].id
                                                }, { transaction : t }))
                                            }

                                            for(let j = 0; j < s_properties[m].images.length; j++){
                                                imgPromises.push(props[m].createImage({
                                                    'ImgUrl': s_properties[m].images[j].src,
                                                    'PropertyId': props[m].id
                                                }, { transaction : t }))
                                            }
                                        }
                                        unitPromises.push.apply(unitPromises, imgPromises);
                                        return Promise.all(unitPromises);
                                    })
                                })
                            }).then(() => {
                                console.log("Database successfully seeded");
                                res.status(200).send("Database successfully seeded")
                            }).catch(err => {
                                console.log("An error occurred trying to seed the database" + err);
                                res.status(500).send({
                                    error: "An error occurred trying to seed the database. \n Error: "+ err
                                })
                            })

                        })
                })
        });
};