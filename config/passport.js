const passport = require("passport"); //把 Passport 套件本身載入進來
const LocalStrategy = require("passport-local").Strategy; //passport-local的Strategy物件
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ where: { email } }) //用where
          .then((user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash("warning_msg", "That email is not registered!")
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(
                  null,
                  false,
                  req.flash("warning_msg", "Email or Password incorrect.")
                );
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );
  // 設定facebook策略
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);
        // profile {
        //   id: '5468445146******',
        //   username: undefined,
        //   displayName: '林',
        //   name: {
        //     familyName: undefined,
        //     givenName: undefined,
        //     middleName: undefined
        //   },
        //   gender: undefined,
        //   profileUrl: undefined,
        //   emails: [ { value: 'w**z@y**.com.tw' } ],
        //   provider: 'facebook',
        //   _raw: '{"email":"w**z\\u0040y**.com.tw","name":"\\u6797\\u5955\\u805e","id":"5468445146******"}',
        //   _json: {
        //     email: 'w**z@y**.com.tw',
        //     name: '林',
        //     id: '5468445146******'
        //   }
        // }
        console.log("accessToken", accessToken);
        // EAA***ZD
        console.log("refreshToken", refreshToken);
        //undefined
        console.log("done", done);
        //[Function: verified]

        const { name, email } = profile._json;
        //(與m不同)用where
        User.findOne({ where: { email } }).then((user) => {
          if (user) return done(null, user);
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) =>
              User.create({
                name,
                email,
                password: hash,
              })
            )
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id) //(與m不同)不用lean
      .then((user) => {
        user = user.toJSON(); //(與m不同).toJSON()
        done(null, user);
      })
      .catch((err) => done(err, null));
  });
};
