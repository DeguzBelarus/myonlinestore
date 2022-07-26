const { Type } = require("../models/dbmodels");
const ApiError = require("../errors/ApiError");

class TypeController {
  async create(request, response) {
    try {
      const { name } = request.body;
      const newType = await Type.create({ name });
      const allTypes = await Type.findAll();
      return response.status(201).json(allTypes);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const { lang, name } = request.body;
      const updatedType = await Type.findOne({ where: { id: id } });
      if (updatedType) {
        await updatedType.update({ name: name });
        const allTypes = await Type.findAll();
        return response.json(allTypes);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный тип не найден"
              : "The specified type was not found",
        });
      }
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      const { lang } = request.query;
      const deletedType = await Type.destroy({ where: { id: id } });
      if (deletedType) {
        const allTypes = await Type.findAll();
        return response.json(allTypes);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный тип не найден"
              : "The specified type was not found",
        });
      }
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }

  async getAll(request, response) {
    try {
      const allTypes = await Type.findAll();
      return response.json(allTypes);
    } catch (exception) {
      console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
      next(ApiError.badRequest(exception.message));
    }
  }
}

module.exports = new TypeController();
