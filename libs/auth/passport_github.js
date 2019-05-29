// passport.js
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;

const client_ID = "We@lthW@yClientId";
const client_secret = "W@u&Jl2OPD";
const return_url = "http://47.111.18.121:3000/benyun/oauth/github/callback";

passport.use(new GitHubStrategy({
        clientID: client_ID,
        clientSecret: client_secret,
        callbackURL: return_url,
        tokenURL:"http://47.111.18.121:8081/oauth/token",
        userProfileURL:"http://47.111.18.121:8081/user",
        customHeaders: {
            Authorization: buildBasicAuth(client_ID,client_secret)
        }
        
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, {accessToken, refreshToken, profile});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.profile.displayName);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

function buildBasicAuth(username,password){
    var tmp = username+":"+password;
    var tmp = new Buffer(tmp);
    return "Basic " + tmp.toString('base64');
}


module.exports = passport
