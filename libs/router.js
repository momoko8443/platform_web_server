const Router = require('koa-router');
const passport = require('koa-passport');
const rp = require('request-promise');
const userService = require('../libs/services/user');
const registerApi = require('./routers/register');
const senderApi = require('./routers/sender');
const industryApi = require('./routers/industry');
const validatorApi = require('./routers/validator');
const usersApi = require('./routers/users');
const memebersApi = require('./routers/members');
const rolesApi = require('./routers/roles');
const tenantsApi = require('./routers/tenants');
const mobileApi = require('./routers/mobile');
const applicationsApi = require('./routers/applications');

const SKIP_AUTH = !!+process.env.SKIP_AUTH;
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";
const router = new Router({
  prefix: '/benyun'
});

router.post('/jumper',async (ctx) => {
  let body = ctx.request.body;
  let appUrl = decodeURI(body.appUrl);
  console.log(appUrl);
  const access_token = ctx.req.user.token.access_token;
  const redirectUrl = 'http://' + idm_domain + appUrl; //+ '&access_token=' + access_token;
  console.log(redirectUrl);
  ctx.body = redirectUrl;
})

router.get('/oauth/github/callback', async (ctx) => {
  return passport.authenticate('github', (err, user, info, status) => {
    //ctx.body = {err, user, info, status}
    if(err){
      console.log(err);
    }else{
      user.profile.username = user.profile.displayName;
      ctx.login(user);
      ctx.redirect("/main");
    }
    
  })(ctx)
});

router.use('/api/*', async (ctx, next) => {
  if (ctx.isAuthenticated() || SKIP_AUTH) {
    await next()
  } else {
    ctx.status = 401;
    //ctx.redirect("/main#/error");
    ctx.body = {
      msg: 'auth fail'
    }
  }
});

router.get('/api/user', async (ctx) => {
  let token = ctx.req.user.token.access_token;
  let user = await userService.getUser(token);
  ctx.body = user;
});

router.use('/mobile', mobileApi.routes(), mobileApi.allowedMethods());
router.use('/tenants', tenantsApi.routes(), tenantsApi.allowedMethods());
router.use('/industry',industryApi.routes(), industryApi.allowedMethods());
router.use('/sender',senderApi.routes(), senderApi.allowedMethods());
router.use('/validator',validatorApi.routes(), validatorApi.allowedMethods());
router.use('/register',registerApi.routes(), registerApi.allowedMethods());


router.use('/api/users', usersApi.routes(), usersApi.allowedMethods());
router.use('/api/members', memebersApi.routes(), memebersApi.allowedMethods());
router.use('/api/roles', rolesApi.routes(), rolesApi.allowedMethods());
router.use('/api/applications', applicationsApi.routes(), applicationsApi.allowedMethods());

module.exports = router;
