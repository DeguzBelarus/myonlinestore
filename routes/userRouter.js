const Router = require("express");

const router = new Router();
const userController = require("../controllers/userController");
const checkAuthMiddleware = require("../middleware/checkAuthMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/authcheck", checkAuthMiddleware, userController.authCheck);
router.get("/", checkRoleMiddleware("ADMIN"), userController.getAll);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN"),
  userController.delete
);

module.exports = router;
