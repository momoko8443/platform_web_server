const Router = require('koa-router');
const rp = require('request-promise');
const usersApi = new Router();
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = 'http://47.111.18.121:8011/api-upms/saasuser/memberlist';
usersApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.post(url,{
        form: {
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            username: query.username
        },
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});



module.exports = usersApi;