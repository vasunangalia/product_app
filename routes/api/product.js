const express = require("express");

const router = express.Router();

const Product = require("../../models/Product");

// @route    POST api/product
// @desc     Create a product
// @access   Private

router.get("/new", (req, res) => res.render("product"));
router.post(
  "/new",

  async (req, res) => {
    const { name, code, price, type } = req.body;

    let errors = [];

    if (!name || !price || !code || !type) {
      errors.push({ msg: "please fill the fields" });
    }

    if (errors.length > 0) {
      res.render("product", {
        errors,
        name,
        code,
        price,
        type
      });
    }
    try {
      const newProduct = new Product({
        name: req.body.name,
        code: req.body.code,
        price: req.body.price,
        type: req.body.type
      });

      const product = await newProduct.save();

      res.render("product");
    } catch (err) {
      // console.error(err.message);
      console.log(errors);
      res.render("product", {
        errors,
        name,
        code,
        price,
        type
      });
    }
  }
);

// @route    GET api/product
// @desc     Get product
// @access   Private

router.get("/all/:page", async (req, res) => {
  try {
    const skip = 5 * (req.params.page - 1);
    const product = await Product.find()
      .sort({ date: -1 })
      .limit(5)
      .skip(skip);

    const count = await Product.collection.countDocuments();
    // console.log(count);
    const limit = 5;
    countSend = Math.ceil(count / limit);
    // res.json(product);
    console.log(product);
    res.render("productlist", { product: product, countSend: countSend });
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// @route    GET api/product/type
// @desc     Get product by type
// @access   Private
router.get("/type/:page", async (req, res) => {
  try {
    // console.log(req.query.type);
    const skip = 5 * (req.params.page - 1);
    const product = await Product.find({ type: req.query.type })
      .sort({ date: -1 })
      .limit(5)
      .skip(skip);

    const count = await Product.find({ type: req.query.type }).count();

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const limit = 5;
    countSend = Math.ceil(count / limit);
    //res.json(product);
    const type = req.query.type;
    res.render("productlistbytype", {
      product: product,
      countSend: countSend,
      type: type
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
