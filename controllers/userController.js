const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../errors/ApiError");
const { User, Cart, CartProduct, Product } = require("../models/dbmodels");

class UserController {
  async registration(request, response, next) {
    try {
      const { email, password, nickname, role, lang } = request.body;

      if (!email || !password || !nickname) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Недостаточно данных для регистрации"
              : "Insufficient data for registration"
          )
        );
      }
      if (
        email.length < 8 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.length > 255
      ) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Указанный email некорректный"
              : "The specified email is incorrect"
          )
        );
      }
      if (password.length < 8) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Минимальная длина пароля - 8 символов"
              : "The minimum password length is 8 characters"
          )
        );
      }
      if (password.length > 255) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Максимальная длина пароля - 255 символов"
              : "The maximum password length is 255 characters"
          )
        );
      }
      if (nickname.length < 2) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Минимальная длина никнейма - 2 символа"
              : "The minimum nickname length is 2 characters"
          )
        );
      }
      if (nickname.length > 10) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Максимальная длина никнейма - 10 символа"
              : "The maximum nickname length is 10 characters"
          )
        );
      }

      let candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Указанный email уже используется"
              : "The specified email is already in use"
          )
        );
      }

      candidate = await User.findOne({ where: { nickname } });
      if (candidate) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Указанный никнейм уже используется"
              : "The specified nickname is already in use"
          )
        );
      }

      const cryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        role,
        nickname,
        password: cryptedPassword,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          email,
          nickname,
          role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "13h" }
      );

      await Cart.create({ userId: newUser.id });

      return response.status(201).json({
        token,
        message:
          lang === "ru"
            ? "Регистрация успешно завершена!"
            : "Registration is successfully completed!",
      });
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async login(request, response, next) {
    try {
      const { email, password, lang } = request.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Неверные данные для входа в систему"
              : "Invalid login information"
          )
        );
      }

      const passwordIsMatch = bcrypt.compareSync(password, user.password);
      if (!passwordIsMatch) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Неверные данные для входа в систему"
              : "Invalid login information"
          )
        );
      }

      const token = jwt.sign(
        {
          id: user.id,
          email,
          nickname: user.nickname,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "13h" }
      );

      return response.json({
        token,
        message:
          lang === "ru"
            ? "Вы успешно вошли в систему!"
            : "You have successfully logged in!",
      });
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async authCheck(request, response, next) {
    try {
      const { lang } = request.body;
      const token = jwt.sign(
        {
          id: request.user.id,
          email: request.user.email,
          nickname: request.user.nickname,
          role: request.user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "13h" }
      );

      return response.json({
        token,
        message:
          lang === "ru"
            ? "Авторизация подтверждена!"
            : "Authorization is confirmed!",
      });
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async update(request, response, next) {
    try {
      const { id } = request.params;
      const { lang, nickname, role } = request.body;
      const requestUserRole = request.user.role;
      if (requestUserRole !== "CREATOR" && role === "CREATOR") {
        return response.status(403).json({
          message: lang === "ru" ? "Нет прав" : "No rights",
        });
      }

      const updatedUser = await User.findOne({ where: { id: id } });
      if (updatedUser) {
        await updatedUser.update({ nickname: nickname, role: role });
        const allUsers = await User.findAll();
        return response.json(allUsers);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный пользователь не найден"
              : "The specified user was not found",
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

      const deletedUser = await User.findOne({ where: { id: id } });
      if (deletedUser) {
        const requestUserRole = request.user.role;
        if (requestUserRole !== "CREATOR" && deletedUser.role === "CREATOR") {
          return response.status(403).json({
            message: lang === "ru" ? "Нет прав" : "No rights",
          });
        }

        const foundCart = await Cart.findOne({ where: { userId: id } });

        if (foundCart) {
          await CartProduct.destroy({ where: { cartId: foundCart.id } });
          await Cart.destroy({ where: { userId: id } });
        }

        await User.destroy({ where: { id: id } });

        const allUsers = await User.findAll();
        return response.json(allUsers);
      } else {
        return response.status(204).json({
          message:
            lang === "ru"
              ? "Указанный пользователь не найден"
              : "The specified user was not found",
        });
      }
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async getAll(request, response, next) {
    try {
      const allUsers = await User.findAll();
      return response.json(allUsers);
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async getCartProducts(request, response, next) {
    try {
      const { id } = request.params;
      const { lang } = request.query;

      const foundCart = await Cart.findOne({ where: { userId: id } });

      if (!foundCart) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Запрашивая корзина покупок не найдена"
              : "Requesting shopping cart not found"
          )
        );
      }

      const cartProducts = await CartProduct.findAll({
        where: { cartId: foundCart.id },
        include: [
          {
            model: Product,
            as: "details",
          },
        ],
      });
      return response.json(cartProducts);
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }

  async addCartProduct(request, response, next) {
    try {
      const { id, productId } = request.body;
      const { lang } = request.query;

      const foundCart = await Cart.findOne({ where: { userId: id } });

      if (!foundCart) {
        return next(
          ApiError.badRequest(
            lang === "ru"
              ? "Запрашивая корзина покупок не найдена"
              : "Requesting shopping cart not found"
          )
        );
      }

      await CartProduct.create({ cartId: foundCart.id, productId });

      const cartProducts = await CartProduct.findAll({
        where: { cartId: foundCart.id },
      });
      return response.status(201).json(cartProducts);
    } catch (exception) {
      next(ApiError.badRequest(exception.message));
    }
  }
}

module.exports = new UserController();
