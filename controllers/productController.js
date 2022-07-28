require("dotenv").config();
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const nodePath = require("path");

const { Product, ProductDescription } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class ProductController {
  async create(request, response, next) {
    try {
      let { name, price, productBrandId, productTypeId, description } =
        request.body;

      if (
        name.includes("*") ||
        name.includes("/") ||
        name.includes("\\") ||
        name.includes(":") ||
        name.includes("?") ||
        name.includes("|") ||
        name.includes('"') ||
        name.includes("'") ||
        name.includes("`") ||
        name.includes("<") ||
        name.includes(">")
      ) {
        return response.status(400).json({
          message:
            lang === "ru"
              ? "Запрещённые символы в названии"
              : "Forbidden characters in the name",
        });
      }

      const foundProductWithSameName = await Product.findOne({
        where: { name: name },
      });

      if (foundProductWithSameName) {
        return response.status(400).json({
          message:
            lang === "ru"
              ? "Указанное имя товара не никальное"
              : "The specified product name is not unique",
        });
      }

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
        poster,
      } = request.body;

      if (
        name.includes("*") ||
        name.includes("/") ||
        name.includes("\\") ||
        name.includes(":") ||
        name.includes("?") ||
        name.includes("|") ||
        name.includes('"') ||
        name.includes("'") ||
        name.includes("`") ||
        name.includes("<") ||
        name.includes(">")
      ) {
        return response.status(400).json({
          message:
            lang === "ru"
              ? "Запрещённые символы в названии"
              : "Forbidden characters in the name",
        });
      }

      const foundProductWithSameName = await Product.findOne({
        where: { name: name },
      });

      if (
        foundProductWithSameName &&
        foundProductWithSameName.dataValues.id !== Number(id)
      ) {
        return response.status(400).json({
          message:
            lang === "ru"
              ? "Указанное имя товара не никальное"
              : "The specified product name is not unique",
        });
      }

      const foundProductForUpdating = await Product.findOne({
        where: { id: id },
      });

      if (foundProductForUpdating) {
        if (
          Number(productTypeId) !==
            foundProductForUpdating._previousDataValues.productTypeId ||
          Number(productBrandId) !==
            foundProductForUpdating._previousDataValues.productBrandId
        ) {
          if (
            !fs.existsSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`
              )
            )
          ) {
            fs.mkdirSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`
              ),
              { recursive: true }
            );
          }

          if (
            fs.existsSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${foundProductForUpdating._previousDataValues.productTypeId}`,
                `${foundProductForUpdating._previousDataValues.productBrandId}`,
                `${foundProductForUpdating._previousDataValues.name}`
              )
            )
          ) {
            fs.renameSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${foundProductForUpdating._previousDataValues.productTypeId}`,
                `${foundProductForUpdating._previousDataValues.productBrandId}`,
                `${foundProductForUpdating._previousDataValues.name}`
              ),
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`,
                `${name}`
              ),
              (exception) => console.log(exception)
            );
          }
        } else if (name !== foundProductForUpdating._previousDataValues.name) {
          if (
            fs.existsSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${foundProductForUpdating._previousDataValues.productTypeId}`,
                `${foundProductForUpdating._previousDataValues.productBrandId}`,
                `${foundProductForUpdating._previousDataValues.name}`
              )
            )
          ) {
            fs.renameSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${foundProductForUpdating._previousDataValues.productTypeId}`,
                `${foundProductForUpdating._previousDataValues.productBrandId}`,
                `${foundProductForUpdating._previousDataValues.name}`
              ),
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`,
                `${name}`
              ),
              (exception) => console.log(exception)
            );
          }
        }

        if (typeof poster !== "string") {
          ({ poster } = request.files);

          if (
            fs.existsSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`,
                `${name}`
              )
            )
          ) {
            fs.rmdirSync(
              nodePath.join(
                __dirname,
                "..",
                "static",
                `${productTypeId}`,
                `${productBrandId}`,
                `${name}`
              ),
              { recursive: true, force: true }
            );
          }

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
          await ProductDescription.destroy({ where: { productId: id } });
          description.forEach((property) => {
            ProductDescription.create({
              title: property.title,
              description: property.description,
              productId: id,
            });
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

        if (
          fs.existsSync(
            nodePath.join(
              __dirname,
              "..",
              "static",
              `${foundProductForDeleting.productTypeId}`,
              `${foundProductForDeleting.productBrandId}`,
              `${foundProductForDeleting.name}`
            )
          )
        ) {
          fs.rmdirSync(
            nodePath.join(
              __dirname,
              "..",
              "static",
              `${foundProductForDeleting.productTypeId}`,
              `${foundProductForDeleting.productBrandId}`,
              `${foundProductForDeleting.name}`
            ),
            { recursive: true, force: true }
          );
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
      next(ApiError.badRequest(exception.message));
    }
  }
}

module.exports = new ProductController();
