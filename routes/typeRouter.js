const Router = require("express");

const router = new Router();
const typeController = require("../controllers/typeController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", typeController.getAll);
router.post("/add", checkRoleMiddleware("ADMIN"), typeController.create);
router.put("/:id", checkRoleMiddleware("ADMIN"), typeController.update);
router.delete(
  "/:id/delete",
  checkRoleMiddleware("ADMIN"),
  typeController.delete
);

module.exports = router;
