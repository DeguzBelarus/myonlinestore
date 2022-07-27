require("dotenv").config();
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const { Product, ProductDescription } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class ProductController {
  async create(request, response, next) {
    try {
      let { name, price, productBrandId, productTypeId, description } =
        request.body;
      const { poster } = request.files;
      const fileName = uuid.v4() + ".jpg";
      poster.mv(
        path.resolve(
          __dirname,
          "..",
          "static",
          `${productTypeId}`,
          `${productBrandId}`,
          `${name}`,
          fileName
        )
      );

      const newProduct = await Product.create({
        name,
        price,
        productBrandId,
        productTypeId,
        poster: fileName,
      });

      if (description) {
        description = JSON.parse(description);
        description.forEach((property) => {
          ProductDescription.create({
            title: property.title,
            description: property.description,
            productId: newProduct.id,
          });
        });
      }

      const allProducts = await Product.findAll();
      response.status(201).json(allProducts);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async update(request, response, next) {
    try {
      const { id } = request.params;
      let {
        lang,
        name,
        price,
        productBrandId,
        productTypeId,
        description,
        posterData,
      } = request.body;

      const foundProductForUpdating = await Product.findOne({
        where: { id: id },
      });

      if (foundProductForUpdating) {
        if (posterData !== "none") {
          const { poster } = request.files;
          fs.rmdirSync(
            __dirname +
              `/../static/${foundProductForUpdating.productTypeId}/${foundProductForUpdating.productBrandId}/${foundProductForUpdating.name}`,
            { recursive: true, force: true }
          );

          const fileName = uuid.v4() + ".jpg";
          poster.mv(
            path.resolve(
              __dirname,
              "..",
              "static",
              `${productTypeId}`,
              `${productBrandId}`,
              `${name}`,
              fileName
            )
          );

          await foundProductForUpdating.update({
            name: name,
            price: price,
            productBrandId: productBrandId,
            productTypeId: productTypeId,
            poster: fileName,
          });
        } else {
          await foundProductForUpdating.update({
            name: name,
            price: price,
            productBrandId: productBrandId,
            productTypeId: productTypeId,
          });
        }

        if (description) {
          description = JSON.parse(description);
          description.forEach((property) => {
            ProductDescription.update(
              {
                title: property.title,
                description: property.description,
              },
              { where: { productId: foundProductForUpdating.id } }
            );
          });
        }

        const allProducts = await Product.findAll();
        return response.json(allProducts);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный товар не найден"
              : "The specified product was not found",
        });
      }
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async delete(request, response, next) {
    try {
      const { id } = request.params;
      const { lang } = request.query;

      const foundProductForDeleting = await Product.findOne({
        where: { id: id },
      });
      if (foundProductForDeleting) {
        await ProductDescription.destroy({
          where: { productId: id },
        });
        await Product.destroy({ where: { id: id } });

        fs.rmdirSync(
          __dirname +
            `/../static/${foundProductForDeleting.productTypeId}/${foundProductForDeleting.productBrandId}/${foundProductForDeleting.name}`,
          { recursive: true, force: true }
        );

        const allProducts = await Product.findAll();
        return response.json(allProducts);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный товар не найден"
              : "The specified product was not found",
        });
      }
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async getAll(request, response, next) {
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
      next(ApiError.badRequest(exception.message));
    }
  }

  async getOne(request, response, next) {
    try {
      const { id } = request.params;
      const foundProduct = await Product.findOne({
        where: { id },
        include: [{ model: ProductDescription, as: "description" }],
      });
      response.json(foundProduct);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }
}

module.exports = new ProductController();
