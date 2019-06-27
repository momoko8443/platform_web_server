const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');
const passport = require('./libs/auth/passport_local');
const benyunRouter = require('./libs/router');
const Router = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const views = require('koa-views');
const authService = require('./libs/services/auth');
const router = new Router();

app.keys = ['secret', 'key'];
let skipAuth = process.env.SKIP_AUTH;
let domain = process.env.DOMAIN? process.env.DOMAIN : "localhost:3000";
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";
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
app.use(static(__dirname + '/public/main'));
app.use(static(__dirname + '/public/idm'));
app.use(static(__dirname + '/docs'));

// router.use('/*', async (ctx, next)=>{
//   if(!ctx.isAuthenticated()){
//     // const redirect_uri = buildRedirectUri();
//     // const loginUrl = buildLoginUri('code','user_info','benyun','We@lthW@yClientId',redirect_uri);
//     // ctx.response.redirect(loginUrl);
//     await ctx.render('login');
//   }else{
//     await next();
//   }
// });

router.use('/main',async (ctx, next)=>{
  if(!ctx.isAuthenticated()){
    // const redirect_uri = buildRedirectUri();
    // const loginUrl = buildLoginUri('code','user_info','benyun','We@lthW@yClientId',redirect_uri);
    // ctx.response.redirect(loginUrl);
    await ctx.redirect('/login');
  }else{
    await ctx.render('main')
  }
});
router.get('/login',
  async (ctx, next) => { 
    if(ctx.isAuthenticated()){
      await ctx.render('main');
    }else{
      await ctx.render('login');
    }
});

router.post('/login', passport.authenticate('local',{successRedirect: '/main'}));
router.get('/logout',async(ctx ,next)=>{
  if(ctx.isAuthenticated()){
    //ctx.logout();
    let token = ctx.req.user.token.access_token;
    let result = await authService.logout(token);
    await ctx.logout();
    await ctx.redirect('/login');
  }else{
    await ctx.redirect('/login');
  }
});

router.get('/main',async(ctx,next) => {
  if(ctx.isAuthenticated()){
    await ctx.render('main');
  }else{
    await ctx.redirect('/login');
  }
});
// app.use(async(ctx,next)=>{
//   console.log('aaa');
//   await next();
//   console.log('bbb');
// })
app.use(async(ctx, next) => {
  console.log('http request in',ctx.request.path);
  if(ctx.isAuthenticated()){
    console.log(new Date());
    const token = ctx.req.user.token.access_token;
    console.log('access token:', token);
  }
  await next();
  //console.log('http response out',ctx.request.path);
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(benyunRouter.routes());
app.use(benyunRouter.allowedMethods());


app.listen(3000, ()=>{
  console.log('domain',domain);
  console.log('idm', idm_domain);
  console.log(`listen on ${domain}`);
});

function buildLoginUri(response_type,scope,state,client_id,redirect_uri){
  return `http://${idm_domain}/oauth/authorize?response_type=${response_type}&scope=${scope}&state=${state}&client_id=${client_id}&redirect_uri=http://${domain}/benyun/oauth/github/callback`;
}

function buildRedirectUri(){
  return `http://${domain}/benyun/oauth/github/callback`;
}