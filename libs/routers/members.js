const Router = require('koa-router');
const rp = require('request-promise');
const membersApi = new Router();
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});
const url = 'http://47.111.18.121:8011/api-upms/saasuser/memberlist';
membersApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.post(url,{
        form: {
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            username: ''
        },
    }).then((result)=>{
        //console.log(result);
        //ctx.body = result.data;
        return result;
    });
    ctx.body = body.data;
});

membersApi.get('/:id', async (ctx,next)=>{

});

membersApi.post('/',async (ctx,next)=>{

});
module.exports = membersApi;