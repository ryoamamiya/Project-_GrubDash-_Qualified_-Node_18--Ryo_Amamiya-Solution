const router = require("express").Router();
const controller = require("./orders.controller");

// TODO: Implement the /orders routes needed to make the tests pass
router.route("/").get(controller.list).post(controller.create);
router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all((req, res, next) => {
    return next({
      status: 405,
      message: `Not allowed`,
    });
  });

module.exports = router;

