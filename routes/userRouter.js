const Router = require("express");

const router = new Router();
const userController = require("../controllers/userController");
const checkAuthMiddleware = require("../middleware/checkAuthMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/authcheck", checkAuthMiddleware, userController.authCheck);
router.get("/", checkRoleMiddleware("ADMIN", "CREATOR"), userController.getAll);
router.get("/:id/cart", checkAuthMiddleware, userController.getCartProducts);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/addtocart", checkAuthMiddleware, userController.addCartProduct);
router.put(
  "/:id",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  userController.update
);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  userController.delete
);
router.delete(
  "/:id/cart/delete",
  checkAuthMiddleware,
  userController.deleteCartProduct
);

module.exports = router;
