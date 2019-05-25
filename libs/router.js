const Router = require('koa-router');
const passport = require('koa-passport');
const rp = require('request-promise');

const client_ID = "dc72790b5ee64ac89a4d";
const client_secret = "112640d881bdcef50188fc8a8e0c9a322fe74331";

const router = new Router({
  prefix: '/benyun'
});

router.get('/auth/github', ctx => {
  return passport.authenticate('github', {
    scope: ['user']
  })(ctx)
});

router.get('/oauth/github/callback', async (ctx) => {
  // return passport.authenticate('github', (err, user, info, status) => {
  //   //ctx.body = {err, user, info, status}
  //   ctx.login(user);
  //   ctx.redirect("http://localhost:8081/#/authredirect?state=github&code=123");
  // })(ctx)
  const body = ctx.request.query;
  console.log(body);
  ctx.redirect("http://localhost:3000/#/authredirect?state="+ body.state + "&code="+ body.code);
});


router.post('/oauth/github/access_token', async (ctx) => {
  let token = await getAccessToken(ctx);
  if(token){
    ctx.session.isAuthenticated = true;
  }
  ctx.body = token;
});

router.use('/api/*', async (ctx, next) => {
  if (ctx.session.isAuthenticated) {
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


function getAccessToken(ctx){
  var options = {
    method: 'POST',
    uri: 'https://github.com/login/oauth/access_token',
    body: {
      client_id: client_ID,
      client_secret: client_secret,
      code: ctx.request.body.code,
      state: ctx.request.body.state
    },
    json: true // Automatically stringifies the body to JSON
  };
  return rp(options)
    .then(function (result) {
        console.log(result);
        return result;
    })
    .catch(function (err) {
        // POST failed...
        console.error(err);
    });
}


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