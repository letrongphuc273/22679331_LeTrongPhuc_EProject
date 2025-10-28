const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

router.post("/", isAuthenticated, productController.createProduct);
router.post("/buy", isAuthenticated, productController.createOrder);
router.get("/", isAuthenticated, productController.getProducts);

// Add :orderId to the path
router.get("/id/:id", isAuthenticated, productController.getProductById);
//get  orderId
router.get("/order/status/:orderId", isAuthenticated, productController.getOrderStatus);
module.exports = router;
