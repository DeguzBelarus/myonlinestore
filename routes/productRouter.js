const Router = require("express");

const router = new Router();
const productController = require("../controllers/productController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post("/add", checkRoleMiddleware("ADMIN"), productController.create);

module.exports = router;
