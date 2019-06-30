// passport.js
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const rp = require('request-promise');
const userService = require('../services/user');
const log = require('koa-log4').getLogger("idm");
const auth= require('../utils/auth');
const client_ID = "webApp";
const client_secret = "webApp";
const domain = process.env.DOMAIN? process.env.DOMAIN : "localhost:3000";
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";

let userPool = {};
passport.use(new LocalStrategy({passReqToCallback:true},(req,username,password,cb)=>{
    const type = req.body.type ? req.body.type : 'password';
    const url = buildTokenURL(type) + `?mobile=${username}&${type}=${password}`;
    let token;
    log.debug(`${username} is login now, login type is ${type}`);
    rp.post({
        headers:{
            'content-type': 'application/json',
            'Authorization':  auth.buildBasicAuth(client_ID, client_secret)
        },  
        url: url,
        json: true
    }).then((result)=>{
        token = result;
        log.debug(`${username} login success, access_token is ${token.access_token}`);
        return userService.getUser(token.access_token);
    }).then((result)=>{
        let user = {};
        user.profile = result;
        user.token = token;
        log.debug(`fetch ${username} profile success`);
        // if(Object.keys(userPool).length > 1000){
        //     userPool = {};
        // }
        let userKey = user.profile.mobile;
        userPool[userKey] = user;
        return cb(null, user);
    })
    .catch((error)=>{
        log.debug(`${username} login failed`);
        return cb(null, false);
    });
}));

passport.serializeUser(function(user, done) {
    let username = user.profile.mobile;
    // if(!userPool[username]){
    //     userPool[username] = user;
    // }
    done(null, username);
  });
  
passport.deserializeUser(function(username, done) {
    if(userPool[username]){
        done(null, userPool[username]);
    }else{
        done(null, null);
    }
});

function buildTokenURL(type){
    if(type === 'code'){
        return `http://${idm_domain}/api-auth/oauth/code/token`;
    }else{
        return `http://${idm_domain}/api-auth/oauth/mobile/token`;
    }
    
}
function buildUserProfileURL(){
    return `http://${idm_domain}/api-user/saasuser/users/current`;
}

function buildBasicAuth(username,password){
    var tmp = username+":"+password;
    var tmp = Buffer.from(tmp);
    return 'Basic ' + tmp.toString('base64');
}

function buildBearerAuth(access_token){
    return 'Bearer ' + access_token;
}


module.exports = passport
