
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./logger');
const logger = log4js.getLogger();

const User = require('./models/User');
const cartModel = require("./models/Cart");


module.exports = (passport) => {

    const createHash = (password) =>{
        return bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10)
        )
    }

    passport.use('signup', new LocalStrategy(
        {
            passReqToCallback: true
        },
        (req, username, password, done)=>{
            User.findOne({username:username},(err, user)=>{
                if(err) return done(err)
                if(user) return done(null, false, {message:"user already exists"});
                const newUser = {
                    name: req.body.name,
                    username: username,
                    password: createHash(password),
                    address: req.body.address,
                    age: req.body.age,
                    phone: req.body.phone,
                    email: req.body.email,
                    avatar: req.body.avatar,
                }
                User.create(newUser,(err, userCreated)=>{
                    const cart = cartModel.create({ newUser: newUser._id});
                    logger.info("Cart successfully created:\n" + cart);
  
        
                    const template = `
                    <div>
                    <h1 style="color: blue;"> 
                        New registered user:
                    </h1>
                    <li>Name: ${newUser.name} ${newUser.username}</li>
                    <li>Email: ${newUser.email}</li>
                    <li>Phone: ${newUser.phone}</li>
                    </div>
                    `
                    logger.info("new registered user")
                    if(err) return done (err);
                    return done(null, userCreated);
                    
                })
            });

        }

    ))

    passport.use('login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    (req, username, password, done)=>{
        User.findOne({username:username},(err,userFound)=>{
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
        done(null, await User.findById(id));
      });

}


