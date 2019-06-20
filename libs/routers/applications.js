

const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const applicationsApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});
const url = `http://${idm_domain}/api-user/saasTenantApp/list`;
applicationsApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.get(url,{
        qs: {
            tenantId: 1,
        },
        headers: {
            'Authorization' : auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});

const url2 = `http://${idm_domain}/api-user/saasAppPermission/tree`;
applicationsApi.get('/:appId/permissions', async (ctx)=>{
    let query = ctx.params;
    let body  = await request.get(url2,{
        qs: {
            tenantId: 1,
            appId: parseInt(query.appId),
        },
        headers: {
            'Authorization' : auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});

module.exports = applicationsApi;