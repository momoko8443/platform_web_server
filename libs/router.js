const Router = require('koa-router');
const passport = require('koa-passport');
const rp = require('request-promise');

const usersApi = require('./routers/users');
const memebersApi = require('./routers/members');
const rolesApi = require('./routers/roles');
const applicationsApi = require('./routers/applications');

const SKIP_AUTH = !!+process.env.SKIP_AUTH;
const router = new Router({
  prefix: '/benyun'
});


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
  //let user = await getUser(ctx);
  let user = ctx.req.user.profile;
  ctx.body = user;
});

router.use('/api/users', usersApi.routes(), usersApi.allowedMethods());
router.use('/api/members', memebersApi.routes(), memebersApi.allowedMethods());
router.use('/api/roles', rolesApi.routes(), rolesApi.allowedMethods());
router.use('/api/applications', applicationsApi.routes(), applicationsApi.allowedMethods());

module.exports = router;
