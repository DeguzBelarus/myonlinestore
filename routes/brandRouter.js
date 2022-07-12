const Router = require("express");

const router = new Router();
const brandController = require("../controllers/brandController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/add", checkRoleMiddleware("ADMIN"), brandController.create);

router.get("/", brandController.getAll);

module.exports = router;
