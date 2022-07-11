const productSchema = require("../schema/productsSchema");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

exports.get = async (req, res) => {
    products = await productSchema.find();
    logger.info("Products: " + products);
    res.status(200).send(products);
},

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const getId = await productSchema.findOne({_id: id});
        res.status(200).send(getId);
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},

exports.upload = async (req, res) => {
    const { body } = req;
    try {
      await productSchema.create(body);
      res.status(201).redirect("/admin/products");
    } catch (error) {
      logger.error(error);
      res.status(500).send(error)
    }
},

exports.update = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const update = await productSchema.updateOne({ _id: id, }, { $set: body, });
        res.status(201).redirect('/admin/products');
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
},


exports.deleteProd = async (req, res) => {
    const { id } = req.params;
    try {
        await productSchema.deleteOne({ _id: id });
        res.status(200).send("Product deleted");
    } catch (err){
        logger.error("Id not found" + err)
        res.status(500).send(err);
    }
},

exports.deleteAll = async (req, res) => {
    await productSchema.deleteMany({});
    res.status(200).send("All products were deleted");
}
