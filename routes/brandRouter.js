const Router = require("express");

const router = new Router();
const brandController = require("../controllers/brandController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", brandController.getAll);
router.post(
  "/add",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  brandController.create
);
router.put(
  "/:id",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  brandController.update
);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  brandController.delete
);

module.exports = router;
