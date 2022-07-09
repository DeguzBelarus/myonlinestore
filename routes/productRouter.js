const Router = require("express");

const router = new Router();
const productController = require("../controllers/productController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/", checkRoleMiddleware("ADMIN"), productController.create);

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);

module.exports = router;
