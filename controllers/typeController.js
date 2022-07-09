const { Type } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class TypeController {
  async create(request, response) {
    try {
      const { name } = request.body;
      const newType = await Type.create({ name });
      return response.status(201).json(newType);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }

  async getAll(request, response) {
    try {
      const allTypes = await Type.findAll();
      return response.json(allTypes);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
    }
  }
}

module.exports = new TypeController();
