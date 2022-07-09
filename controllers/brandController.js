const { Brand } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class BrandController {
  async create(request, response) {
    try {
      const { name } = request.body;
      const newBrand = await Brand.create({ name });
      return response.status(201).json(newBrand);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }

  async getAll(request, response) {
    try {
      const allBrands = await Brand.findAll();
      return response.json(allBrands);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }
}

module.exports = new BrandController();
