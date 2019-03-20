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
        let PropertyAdmin = sequelize.model("PropertyAdmin");
        let Image = sequelize.model("Image");
        let Location = sequelize.model("Location");
        let PropertyNeighborhood = sequelize.model("PropertyNeighborhood");
        let PaymentAccount = sequelize.model("PaymentAccount");
        let Invoice = sequelize.model("Invoice");
        let Inquiry = sequelize.model("Inquiry");
        let InquiryLog = sequelize.model("InquiryLog");
        let User = sequelize.model("User");
        let Amenity = sequelize.model("Amenity");
        let AmenityFeature = sequelize.model("AmenityFeature");
        let Appointment = sequelize.model("Appointment");
        let MaintenanceItem = sequelize.model("MaintenanceItem");
        let ApplicationRequest = sequelize.model("ApplicationRequest");
        let TenacitiAdmin = sequelize.model("TenacitiAdmin");

        //Property Owner Table
        PropertyOwner.hasMany(PropertyOwnerAdmin);
        PropertyOwner.hasMany(Property);
        PropertyOwner.hasMany(Invoice);
        PropertyOwner.hasOne(Image);

        //PropertyOwnerAdmin 1:1 relationship with PropertyOwner
        PropertyOwnerAdmin.belongsTo(PropertyOwner);

        //Property Table
        Property.hasMany(PropertyUnit);
        Property.hasOne(PropertyAdmin);
        Property.hasOne(PaymentAccount);
        Property.hasMany(Image);
        Property.hasMany(Amenity);
        Property.hasMany(Invoice);
        Property.hasMany(ApplicationRequest);
        Property.hasMany(InquiryLog);
        Property.hasMany(User);
        Property.hasMany(MaintenanceItem);
        Property.hasOne(Location);
        Property.belongsTo(PropertyNeighborhood);

        PropertyUnit.belongsTo(Property);
        PropertyUnit.hasMany(Image);
        PropertyUnit.hasMany(Appointment);

        User.belongsTo(Property);
        User.hasMany(Invoice);
        User.hasMany(InquiryLog);
        User.hasMany(Appointment);
        User.hasMany(MaintenanceItem);
        User.hasMany(Image);
        User.hasMany(ApplicationRequest);
        User.hasOne(Location);

        Image.belongsTo(Property);
        Image.belongsTo(PropertyOwner);
        Image.belongsTo(PropertyUnit);
        Image.belongsTo(User);

        Invoice.belongsTo(PropertyOwner);
        Invoice.belongsTo(User);
        Invoice.belongsTo(Property);
        Invoice.belongsTo(PropertyUnit);

        Appointment.belongsTo(PropertyUnit);
        Appointment.belongsTo(User);

        Location.belongsTo(Property);
        Location.belongsTo(User);

        Amenity.belongsTo(Property);
        Amenity.hasMany(AmenityFeature);

        AmenityFeature.belongsTo(Amenity);

        PropertyNeighborhood.hasMany(Property);

        PropertyAdmin.belongsTo(Property);
        PaymentAccount.belongsTo(Property)

        InquiryLog.hasMany(Inquiry);
        InquiryLog.belongsTo(User);
        InquiryLog.belongsTo(Property);

        Inquiry.belongsTo(InquiryLog);

        ApplicationRequest.belongsTo(User);
        ApplicationRequest.belongsTo(Property)
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