"use strict";
const filesystem = require('fs');
const models = {};

const singleton = function Singleton(){
    const Sequelize = require('sequelize');
    let sequelize = require('./config_db');
    let modelsPath = "";

    this.setup = function(path) {
        modelsPath = path;
        init();
    };

    this.model = function (name){
        return models[name];
    };

    this.Seq = function (){
        return Sequelize;
    };
    function init(){
        filesystem.readdirSync(modelsPath).forEach(function(name){
            const object = require(modelsPath + "/" + name);
            const options = object.options || {};
            const modelName = name.replace(/\.js$/i, "");
            models[modelName] = sequelize.define(modelName, object.model, options);
        });

        let Property = sequelize.model("Property");
        let PropertyOwner = sequelize.model("PropertyOwner");
        let PropertyUnit = sequelize.model("PropertyUnit");
        let PropertyOwnerAdmin = sequelize.model("PropertyOwnerAdmin");
        let Image = sequelize.model("Image");
        let Invoice = sequelize.model("Invoice");
        let User = sequelize.model("User");

        PropertyOwner.hasMany(PropertyOwnerAdmin);
        PropertyOwnerAdmin.belongsTo(PropertyOwner);

        PropertyOwner.hasMany(Property);
        Property.hasMany(PropertyUnit);
        PropertyUnit.belongsTo(Property);

        Image.belongsTo(Property);
        Image.belongsTo(PropertyOwner);
        Image.belongsTo(PropertyUnit);

        Property.hasMany(Image);
        Property.hasMany(User);
        User.belongsTo(Property);
        PropertyOwner.hasOne(Image);

        Invoice.belongsTo(PropertyOwner);
        Invoice.belongsTo(User);
        Invoice.belongsTo(Property);
        Invoice.belongsTo(PropertyUnit);

        Property.hasMany(Invoice);
        PropertyOwner.hasMany(Invoice);
        PropertyUnit.hasMany(Invoice);
        PropertyUnit.hasMany(Image);
        User.hasMany(Invoice);

    }
};

singleton.instance = null;

singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
};

module.exports = singleton.getInstance();