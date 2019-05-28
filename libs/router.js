const Router = require('koa-router');
const passport = require('koa-passport');
const rp = require('request-promise');

const router = new Router({
  prefix: '/benyun'
});


router.get('/oauth/github/callback', async (ctx) => {
  return passport.authenticate('github', (err, user, info, status) => {
    //ctx.body = {err, user, info, status}
    if(err){
      console.log(err);
    }else{
      ctx.login(user);
      //ctx.cookies.set('x-access-token',user['accessToken'],{httpOnly:false});
      ctx.redirect("http://localhost:3000/main");
    }
    
  })(ctx)
});

router.use('/api/*', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.status = 401
    ctx.body = {
      msg: 'auth fail'
    }
  }
});

router.get('/api/user', async (ctx) => {
  let user = await getUser(ctx);
  ctx.body = user;
});

module.exports = router;



function getUser(ctx){
  //'https://api.github.com/user',
  var options = {
    method: 'GET',
    uri: 'https://api.github.com/user',
    json: true,
    headers: {
      "User-Agent": 'benyun_eop',
      authorization: ctx.request.headers.authorization
    }
  };
  return rp(options)
    .then(function (result) {
        //console.log(result);
        return result;
    })
    .catch(function (err) {
        console.error(err);
    });
}