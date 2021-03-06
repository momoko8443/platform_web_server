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


const url = `http://${idm_domain}/api-user/register/teanatitexist`;
/**
 * @api {get} /tenants
 * @apiDescription 查询租户信息(判断租户名是否已存在)
 * @apiName getTenant
 * @apiGroup Tenants
 * @apiParam (queryParams) {String} tenantName 租户名
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    code:0
    data:"恭喜！验证通过"
    errors:null
    extra:null
    message:"success"
    timestamp:"2019-06-26 17:14:48"
}
 */
tenantsApi.get('/', async (ctx)=>{
    let tenantName = ctx.query.tenantName;
    let result  = await request.get(url,{
        qs: {
            tenantName: tenantName
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

module.exports = tenantsApi;