

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

/**
 * @api {get} /benyun/api/applications
 * @apiDescription 获取租户下所有应用列表
 * @apiName getApplications
 * @apiGroup Applications
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "success" : "true",
 *      "result" : {
 *          "name" : "loginName",
 *          "password" : "loginPass"
 *      }
 *  }
 */
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
/**
 * @api {get} /benyun/api/applications/:id/permissions
 * @apiDescription 获取租户下所有应用列表
 * @apiName getPermissionsByApplication
 * @apiGroup Applications
 * @apiParam (pathParams) {Number} :id 应用ID
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "success" : "true",
 *      "result" : {
 *          "name" : "loginName",
 *          "password" : "loginPass"
 *      }
 *  }
 */
applicationsApi.get('/:appId/permissions', async (ctx)=>{
    let appId = ctx.params.appId;
    let tenantId = ctx.query.tenantId;
    let body  = await request.get(url2,{
        qs: {
            tenantId: parseInt(tenantId),
            appId: parseInt(appId),
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