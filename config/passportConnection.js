const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
//Import Schemas
const UserSchema = require('../schema/userSchema');
const CartSchema = require("../schema/cartSchema");

//MailSender
const mailSender = require('./notificationServices/mailSender');

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

    const registerUser = async (req, username, password, done) => {
    const { name, address, age, phone, email, avatar } = req.body;
    try {
      if (await UserSchema.exists({ username})) {
        logger.error("This username is taken");
        return done(null, false, {
          message: "This username already"
        });
      }

      const user = await UserSchema.create({
        name,
        username,
        password: createHash(password),
        // confirmPassword: createHash(confirmPassword),
        address,
        age,
        phone,
        email,
        avatar
      });
      done(null, {
        ...user,
        id: user._id
      });
      const cart = await CartSchema.create({ user: user._id.toString() });
      logger.info("Cart successfully created:\n" + cart);
      const emailTemplate = `<div>
                                <h1 style="color: blue;"> User registered:</h1>
                                <li>Username: ${user.username}</li>
                                <li>Mail: ${user.email}</li>
                            </div>`

      await mailSender.aNewUserMail(emailTemplate);
      logger.info("New User Registered")
    } catch (err) {
        logger.error(err)
      done(err);
    }
  };

  passport.use(
    "signup",
    new LocalStrategy(
      { usernameField: "username", passwordField: "password", passReqToCallback: true },
      registerUser
    )
  );

    passport.use('login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    (req, username, password, done)=>{
        UserSchema.findOne({username:username},(err,userFound)=>{
            if(err) return done(err);
            if(!userFound) return done(null, false, {message:"user does not exists"})
            if(!bcrypt.compare(password, userFound.password)){
                return done(null, false,{message:"invalid password"})
            }
            req.session.user = {username: userFound.username}
            done(null, userFound);
        })
    }
    ))

    passport.serializeUser((user, done)=>{
        return done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        done(null, await UserSchema.findById(id));
      });

}
