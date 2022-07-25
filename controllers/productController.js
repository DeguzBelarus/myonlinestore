const uuid = require("uuid");
const path = require("path");

const { Product, ProductDescription } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class ProductController {
  async create(request, response, next) {
    try {
      let { name, price, productBrandId, productTypeId, description } =
        request.body;
      const { poster } = request.files;
      const fileName = uuid.v4() + ".jpg";
      poster.mv(path.resolve(__dirname, "..", "static", fileName));

      const newProduct = await Product.create({
        name,
        price,
        productBrandId,
        productTypeId,
        poster: fileName,
      });

      if (description) {
        description = JSON.parse(description);
        description.forEach((item) => {
          ProductDescription.create({
            title: item.title,
            description: item.description,
            productId: newProduct.id,
          });
        });
      }

      response.status(201).json(newProduct);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async getAll(request, response) {
    try {
      let { brandId, typeId, limit, page } = request.query;
      page = page || 1;
      limit = limit || 20;
      const offSet = page * limit - limit;

      let allProducts;
      if (!brandId && !typeId) {
        allProducts = await Product.findAndCountAll({ limit, offSet });
      }
      if (brandId && !typeId) {
        allProducts = await Product.findAndCountAll({
          where: { brandId },
          limit,
          offSet,
        });
      }
      if (!brandId && typeId) {
        allProducts = await Product.findAndCountAll({
          where: { typeId },
          limit,
          offSet,
        });
      }
      if (brandId && typeId) {
        allProducts = await Product.findAndCountAll({
          where: { typeId, brandId },
          limit,
          offSet,
        });
      }

      return response.json(allProducts);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }

  async getOne(request, response) {
    try {
      const { id } = request.params;
      const foundProduct = await Product.findOne({
        where: { id },
        include: [{ model: ProductDescription, as: "description" }],
      });
      response.json(foundProduct);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }
}

module.exports = new ProductController();
