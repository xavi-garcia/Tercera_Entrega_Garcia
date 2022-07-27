const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
//Import Schemas
const UserSchema = require('../schema/userSchema');
const CartSchema = require("../schema/cartSchema");

//MailSender
const nodeMailSender = require('./notificationServices/mailSender');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();


module.exports = (passport) => {

    const createHash = (password) =>{
        return bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10)
        )
    }
    const createSecondHash = (confirmPassword) =>{
      return bcrypt.hashSync(
          confirmPassword,
          bcrypt.genSaltSync(10)
      )
  }

  const authenticateUser = async (username, password, done) => {
    try {
      if (!(await UserSchema.exists({ username }))) {
        logger.error("username doesn't exist");
        return done(null, false, { message: "User doesn't exist" });
      }
      const user = await UserSchema.findOne({ username: username });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect password" });
      }
      done(null, user);
    } catch (err) {
      logger.error(err);
      done(err)
    }
  };

    const registerUser = async (req, username, password, done) => {
    const { name, address, age, phone, email, avatar, confirmPassword } = req.body;
    try {
      if (await UserSchema.exists({username})) {
        logger.error("This username is taken");
        return done(null, false, {message: "This username already exists"})}

      const user = await UserSchema.create({
        name,
        username,
        password: createHash(password),
        confirmPassword: createSecondHash(confirmPassword),
        address,
        age,
        phone,
        email,
        avatar
      });
      if ( password != confirmPassword) {logger.error('Passwords must be the same'); return done(null, false, {message: "password and confirm password must be the same"})}
      done(null, {
        ...user,
        id: user._id
      });
      const cart = await CartSchema.create({ user: user._id.toString(), address: user.address });
      logger.info("Cart successfully created:\n" + cart);
      const emailTemplate = `<div>
                                <h1 style="color: blue;"> User registered:</h1>
                                <li>Username: ${user.username}</li>
                                <li>Mail: ${user.email}</li>
                            </div>`

      await nodeMailSender.aNewUserMail(emailTemplate);
      logger.info("New User Registered")
  
    } catch (err) {
        logger.error(err)
      done(err);
    }
  };


      passport.use(
        "login",
        new LocalStrategy(
          { usernameField: "username", passwordField: "password" },
          authenticateUser
        )
      );

      passport.use(
        "signup",
        new LocalStrategy(
          { usernameField: "username", passwordField: "password", confirmPasswordField:"password", passReqToCallback: true },
          registerUser
        )
      );

    passport.serializeUser((user, done)=>done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        done(null, await UserSchema.findById(id));
    });

}
