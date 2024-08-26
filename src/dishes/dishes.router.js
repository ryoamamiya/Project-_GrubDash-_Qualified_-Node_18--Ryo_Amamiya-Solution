const router = require("express").Router();
const controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass

router.route("/").get(controller.list).post(controller.create);
router
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all((req, res, next) => {
    return next({
      status: 405,
      message: `Not allowed`,
    });
  });

module.exports = router;

