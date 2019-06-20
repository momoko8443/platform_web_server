// passport.js
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;
const auth= require('../utils/auth');

const client_ID = "We@lthW@yClientId";
const client_secret = "W@u&Jl2OPD";
const domain = process.env.DOMAIN? process.env.DOMAIN : "localhost:3000";
let idm_domain = process.env.IDM? process.env.IDM : "localhost:8081";
let userPool = {};
passport.use(new GitHubStrategy({
        clientID: client_ID,
        clientSecret: client_secret,
        callbackURL: buildCallbackURL(),
        tokenURL: buildTokenURL(),
        userProfileURL:buildUserProfileURL(),
        customHeaders: {
            Authorization: auth.buildBasicAuth(client_ID,client_secret)
        }     
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, {accessToken, refreshToken, profile});
    }
));

passport.serializeUser(function(user, done) {
    let username = user.profile.username;
    if(!userPool[username]){
        userPool[username] = user;
    }
    done(null, username);
  });
  
passport.deserializeUser(function(username, done) {
    if(userPool[username]){
        done(null, userPool[username]);
    }else{
        done(null, null);
    }
});

function buildCallbackURL(){
    return `http://${domain}/benyun/oauth/github/callback`;
}

function buildTokenURL(){
    return `http://${idm_domain}/oauth/token`;
}
function buildUserProfileURL(){
    return `http://${idm_domain}/user`;
}

module.exports = passport;
