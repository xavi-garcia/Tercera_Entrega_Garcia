const productSchema = require("../schema/productsSchema");

//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/logger');
const logger = log4js.getLogger();

exports.getAll = async (req, res) => {
    try {
        let products = await productSchema.find();
        logger.info("Products: " + products);
        res.send(products);
    } catch (error) {
        logger.error(error)
    }
 
},

exports.getProdById = async (req, res) => {
    const { id } = req.params;
    try {
        const getId = await productSchema.findOne({_id: id});
        res.status(200).send(`<div style="border-style: ridge; margin:10px; padding:10px; width:250px; background-color:lavender">
          <img style="width:100px" src="${getId.thumbnail}" alt="${getId.name}">
            <p style="font-family:fantasy;"><strong>Name: </strong> ${getId.name}</p>
            <p style="font-family:fantasy;"><strong>Description: </strong> ${getId.description}</p>
            <p style="font-family:fantasy;"><strong>Code: </strong> ${getId.code}</p>
            <p style="font-family:fantasy;"><strong>Stock:</strong> ${getId.stock}</p>
            <p style="font-family:fantasy;"><strong>Price:</strong> ${getId.price}</p>
            <p style="font-family:fantasy;"><strong>Category:</strong> ${getId.category}</p>
        </div>`)
    } catch (error) {
        logger.error(error);
        res.status(500).send(`<div style="border:100px"><h1 style="font-family:fantasy;"> No such Product, Sorry!</h1>
        <img style="width:100px; margin-left:80px" src="https://c.tenor.com/5cs7FjjlA0sAAAAC/naruto-sorry.gif" alt=""></div>`);
    }
},


exports.getProdByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const getCategory = await productSchema.find({category: category});
        res.status(200).send(getCategory)
    } catch (error) {
        logger.error(error);
        res.status(500).send(`<div style="border:100px"><h1 style="font-family:fantasy;">Sorry!</h1>
        <img style="width:100px; margin-left:80px" src="https://c.tenor.com/5cs7FjjlA0sAAAAC/naruto-sorry.gif" alt=""></div>`);
    }
},



exports.uploadProd = async (req, res) => {
    const { body } = req;
    try {
      await productSchema.create(body);
      res.status(201).redirect("/admin/products");
    } catch (error) {
      logger.error(error);
      res.status(500).send(error)
    }
},

exports.updateProd = async (req, res) => {
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
