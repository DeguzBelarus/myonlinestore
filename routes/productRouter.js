const Router = require("express");

const router = new Router();
const productController = require("../controllers/productController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post(
  "/add",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  productController.create
);
router.put(
  "/:id",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  productController.update
);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  productController.delete
);

module.exports = router;
