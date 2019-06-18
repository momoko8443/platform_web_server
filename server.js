const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');
const passport = require('./libs/auth/passport_github');
const benyunRouter = require('./libs/router');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const views = require('koa-views');
const router = new Router();

app.keys = ['secret', 'key'];
let domain = process.env.DOMAIN? process.env.DOMAIN : "localhost:3000";
let idm_domain = process.env.IDM? process.env.IDM : "localhost:8081";
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 30 * 60 * 1000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  };

app.use(views('views',{extension:'html'}));
app.use(session(CONFIG, app));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(static(__dirname + '/public'));

router.use('/main',async (ctx, next)=>{
  if(!ctx.isAuthenticated()){
    const redirect_uri = buildRedirectUri();
    const loginUrl = buildLoginUri('code','user_info','benyun','We@lthW@yClientId',redirect_uri);
    ctx.response.redirect(loginUrl);
  }
  await next();
});
router.get('/main',async(ctx,next) => {
  await ctx.render('main');
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(benyunRouter.routes());
app.use(benyunRouter.allowedMethods());
app.listen(3000, ()=>{
  console.log(`listen on ${domain}`);
});

function buildLoginUri(response_type,scope,state,client_id,redirect_uri){
  return `http://${idm_domain}/oauth/authorize?response_type=${response_type}&scope=${scope}&state=${state}&client_id=${client_id}&redirect_uri=http://${domain}/benyun/oauth/github/callback`;
}

function buildRedirectUri(){
  return `http://${domain}/benyun/oauth/github/callback`;
}