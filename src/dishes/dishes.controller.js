const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (!name) {
    return next({ status: 400, message: "Dish must include a name" });
  }
  if (!description) {
    return next({ status: 400, message: "Dish must include a description" });
  }
  if (!price) {
    return next({ status: 400, message: "Dish must include a price" });
  }
  if (price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  if (!image_url) {
    return next({ status: 400, message: "Dish must include an image_url" });
  }

  const newDish = {
    id: nextId(), // make sure you have a utility to generate unique IDs
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const { dishId } = req.params;
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  if (!name) {
    return next({ status: 400, message: "Dish must include a name" });
  }
  if (!description) {
    return next({ status: 400, message: "Dish must include a description" });
  }
  if (!price) {
    return next({ status: 400, message: "Dish must include a price" });
  }
  if (price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  if (!image_url) {
    return next({ status: 400, message: "Dish must include an image_url" });
  }
  if (id && id !== dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }

  res.locals.dish = {
    id: dishId,
    name,
    description,
    price,
    image_url,
  };
  res.json({ data: res.locals.dish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create,
  read: [dishExists, read],
  update: [dishExists, update],
  list,
};

