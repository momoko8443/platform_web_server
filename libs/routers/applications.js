

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
 * @api {get} /applications
 * @apiDescription 获取租户下所有应用列表
 * @apiName getApplications
 * @apiGroup Applications
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 [
  {
    "id": 5,
    "appName": "PHP版ERP",
    "appExplain": null,
    "appLogo": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560703959272&di=cf05f7403c97922ada9ef20f221205f8&imgtype=0&src=http%3A%2F%2Fwww.sxuek.com%2Fuploadfile%2F2016%2F1223%2F20161223030625215.jpg",
    "webServerRedirectUri": "/oauth/authorize?client_id=benyunphperp&redirect_uri=http://inerp.yuneop.com/index.php/home/index&response_type=code&scope=all"
  },
]
 */
const url = `http://${idm_domain}/api-user/saasTenantApp/list`;
applicationsApi.get('/', async (ctx)=>{
    let tenantId = ctx.query.tenantId;
    let body  = await request.get(url,{
        qs: {
            tenantId: tenantId,
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
 * @api {get} /applications/:id/permissions
 * @apiDescription 获取应用的所有权限
 * @apiName getPermissionsByApplication
 * @apiGroup Applications
 * @apiParam (pathParams) {Number} :id 应用ID
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
[
  {
    "id": "175",
    "parentId": "0",
    "children": [
      {
        "id": "177",
        "parentId": "175",
        "children": [],
        "name": "修改"
      },
      {
        "id": "176",
        "parentId": "175",
        "children": [],
        "name": "新增"
      },
      {
        "id": "178",
        "parentId": "175",
        "children": [],
        "name": "删除"
      }
    ],
    "name": "收入类别"
  }
]
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