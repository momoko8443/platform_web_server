const Router = require('koa-router');
const rp = require('request-promise');
const rolesApi = new Router();
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        if(typeof(body) === 'string'){
            return JSON.parse(body);
        }
        return body;
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});
const url = 'http://47.111.18.121:8011/api-upms/saasRole/page';
rolesApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.get(url,{
        qs: {
            tenantId: 1,
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            roleName: ''
        },
    }).then((result)=>{
        //console.log(result);
        //ctx.body = result.data;
        return result;
    });
    ctx.body = body.data;
});
const url3 = "http://47.111.18.121:8011/api-upms/saasRole/v1/";
rolesApi.get('/:id', async (ctx,next)=>{
    let roleId = ctx.params.id;
    let body = await request.get({
        url: url3 + '/'+roleId, 
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});
const url2 = 'http://47.111.18.121:8011/api-upms/saasRole/add';
rolesApi.post('/',async (ctx,next)=>{
    let role = ctx.request.body;
    let body  = await request.post({
        headers:{
            'content-type': 'application/json'
        },  
        url: url2,
        body: role,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});
const url4 = 'http://47.111.18.121:8011/api-upms/saasRole/v1';
rolesApi.put('/',async (ctx,next)=>{
    let role = ctx.request.body;
    console.log(JSON.stringify(role));
    let body  = await request.put({
        headers:{
            'content-type': 'application/json'
        },  
        url: url4,
        body: role,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});
module.exports = rolesApi;