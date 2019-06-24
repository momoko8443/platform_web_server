const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const usersApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-user/saasuser/memberlist`;
/**
 * @api {get} /api/users
 * @apiDescription 根据手机号搜索平台下的用户列表
 * @apiName searchUsers
 * @apiGroup Users
 * @apiParam (queryParams) {String} mobile 手机号
 * @apiParam (queryParams) {Number} pageSize 页面大小
 * @apiParam (queryParams) {Number} currentPage 当前页码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "records": [
    {
      "id": "1",
      "userName": "test",
      "headImgUrl": "http://img2.imgtn.bdimg.com/it/u=3937854204,4209154356&fm=11&gp=0.jpg",
      "mobile": "13000000000",
      "status": "1"
    }
  ],
  "total": 1,
  "size": 10,
  "current": 1,
  "searchCount": true,
  "pages": 1
}
 */
usersApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let result  = await request.post(url,{
        form: {
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            mobile: query.mobile
        },
        headers: {
            'Authorization' : auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = result.data;
});

const url2 = `http://${idm_domain}/api-user/saasTenantApp/switchTenant`;
/**
 * @api {put} /api/users/current_tenant
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
usersApi.put('/current_tenant', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url2,{
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



module.exports = usersApi;