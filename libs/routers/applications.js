

const Router = require('koa-router');
const rp = require('request-promise');
const applicationsApi = new Router();
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});
const url = 'http://47.111.18.121:8011/api-upms/saasTenantApp/list';
applicationsApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.get(url,{
        qs: {
            tenantId: 1,
        },
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});

const url2 = 'http://47.111.18.121:8011/api-upms/saasAppPermission/tree';
applicationsApi.get('/:appId/permissions', async (ctx)=>{
    let query = ctx.params;
    let body  = await request.get(url2,{
        qs: {
            tenantId: 1,
            appId: parseInt(query.appId),
        },
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});
module.exports = applicationsApi;