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
      user.profile.username = user.profile.displayName;
      ctx.login(user);
      ctx.redirect("/main");
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
  //let user = await getUser(ctx);
  let user = ctx.req.user.profile;
  ctx.body = user;
});

router.get('/api/members', async (ctx) => {
  //let user = await getUser(ctx);
  ctx.body = [
    {"id":"123a","username":"aaaa","name":"AAAA","avatar":"https://img14.360buyimg.com/n0/jfs/t18448/200/2532654839/268503/b46a717e/5afe4d0cN10f96d55.jpg"},
    {"id":"123b","username":"bbbb","name":"BBBB","avatar":"https://img14.360buyimg.com/n0/jfs/t18448/200/2532654839/268503/b46a717e/5afe4d0cN10f96d55.jpg"},
    {"id":"123c","username":"cccc","name":"CCCC","avatar":"https://img14.360buyimg.com/n0/jfs/t18448/200/2532654839/268503/b46a717e/5afe4d0cN10f96d55.jpg"},
    {"id":"123d","username":"dddd","name":"DDDD","avatar":"https://img14.360buyimg.com/n0/jfs/t18448/200/2532654839/268503/b46a717e/5afe4d0cN10f96d55.jpg"}
  ];
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