const { Brand } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class BrandController {
  async create(request, response, next) {
    try {
      const { name } = request.body;
      const newBrand = await Brand.create({ name });
      const allBrands = await Brand.findAll();
      return response.status(201).json(allBrands);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async update(request, response, next) {
    try {
      const { id } = request.params;
      const { lang, name } = request.body;
      const updatedBrand = await Brand.findOne({ where: { id: id } });
      if (updatedBrand) {
        await updatedBrand.update({ name: name });
        const allBrands = await Brand.findAll();
        return response.json(allBrands);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный бренд не найден"
              : "The specified brand was not found",
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
      const deletedBrand = await Brand.destroy({ where: { id: id } });
      if (deletedBrand) {
        const allBrands = await Brand.findAll();
        return response.json(allBrands);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный бренд не найден"
              : "The specified brand was not found",
        });
      }
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async getAll(request, response, next) {
    try {
      const allBrands = await Brand.findAll();
      return response.json(allBrands);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }
}

module.exports = new BrandController();
