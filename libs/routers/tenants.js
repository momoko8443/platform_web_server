const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const tenantsApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-user/saasTenantApp/switchTenant`;
/**
 * @api {put} /api/current_tenant
 * @apiDescription 切换当前登录用户的租户
 * @apiName switchTenant
 * @apiGroup Tenants
 * @apiParam (jsonBody) {String} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
	"code": 0,
	"errors": "这是错误",
	"message": "成功",
	"data": "返回数据",
	"extra": "附加数据",
	"timestamp": ""
}
 */
tenantsApi.put('/', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url,{
        qs: {
            tenantId: body.tenantId
        },
        headers: {
            'Authorization' : auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});



module.exports = tenantsApi;