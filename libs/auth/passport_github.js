// passport.js
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;

const client_ID = "dc72790b5ee64ac89a4d";
const client_secret = "112640d881bdcef50188fc8a8e0c9a322fe74331";
const return_url = "http://localhost:3000/benyun/oauth/github/callback";

passport.use(new GitHubStrategy({
        clientID: client_ID,
        clientSecret: client_secret,
        callbackURL: return_url
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, {accessToken, refreshToken, profile});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.profile.username);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});


module.exports = passport
