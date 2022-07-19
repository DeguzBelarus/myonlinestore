const Router = require("express");

const router = new Router();
const typeController = require("../controllers/typeController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", typeController.getAll);
router.post(
  "/add",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  typeController.create
);
router.put(
  "/:id",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  typeController.update
);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN", "CREATOR"),
  typeController.delete
);

module.exports = router;
