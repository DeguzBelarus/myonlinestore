const Router = require("express");

const router = new Router();
const brandController = require("../controllers/brandController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", brandController.getAll);
router.post("/add", checkRoleMiddleware("ADMIN"), brandController.create);
router.put("/:id", checkRoleMiddleware("ADMIN"), brandController.update);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN"),
  brandController.delete
);

module.exports = router;
