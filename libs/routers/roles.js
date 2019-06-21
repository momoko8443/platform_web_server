const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const rolesApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
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
const url = `http://${idm_domain}/api-user/saasRole/page`;
/**
 * @api {get} /roles
 * @apiDescription 获取租户下所有角色列表
 * @apiName getRoles
 * @apiGroup Roles
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiParam (queryParams) {Number} pageSize 页面大小
 * @apiParam (queryParams) {Number} currentPage 当前页码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "records": [
    {
      "id": "1",
      "roleName": "超级管理员2",
      "roleAlias": "SYSTEM",
      "tenantId": "1",
      "sort": 1
    },
    {
      "id": "1135799116570017793",
      "roleName": "采购员2",
      "roleAlias": null,
      "tenantId": "1",
      "sort": 1
    }
  ],
  "total": 2,
  "size": 3,
  "current": 1,
  "searchCount": true,
  "pages": 1
}
 */
rolesApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.get(url,{
        qs: {
            tenantId: parseInt(query.tenantId),
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            roleName: ''
        },
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});
const url3 = `http://${idm_domain}/api-user/saasRole/v1`;
/**
 * @api {get} /roles/:id
 * @apiDescription 获取具体角色信息
 * @apiName getRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "roleId": "1141691215347347458",
  "roleName": "testRole",
  "userList": [
    "1"
  ],
  "reqRoleDtoReqs": [
    {
      "appId": 5,
      "pemssionIds": [
        175,
        177,
        176,
        178
      ]
    }
  ],
  "tenantId": "1"
}
 */
rolesApi.get('/:id', async (ctx,next)=>{
    let roleId = ctx.params.id;
    let body = await request.get({
        url: url3 + '/'+roleId, 
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        }, 
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});
const url2 = `http://${idm_domain}/api-user/saasRole/add`;
/**
 * @api {post} /roles
 * @apiDescription 添加新角色
 * @apiName postRole
 * @apiGroup Roles
 * @apiParamExample {json} Request-Body:
{
  "roleName": "testRole",
  "userList": [
    "1"
  ],
  "reqRoleDtoReqs": [
    {
      "appId": "5",
      "pemssionIds": [
        "175",
        "177",
        "176",
        "178"
      ]
    }
  ],
  "tenantId": "1"
}
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "code": 0,
  "errors": null,
  "message": "success",
  "data": "新增成功",
  "extra": null,
  "timestamp": "2019-06-20 20:56:12"
}
 */
rolesApi.post('/',async (ctx,next)=>{
    let role = ctx.request.body;
    let body  = await request.post({
        headers:{
            'content-type': 'application/json',
            'Authorization': auth.buildBearerAuth(ctx)
        }, 
        url: url2,
        body: role,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});
const url4 = `http://${idm_domain}/api-user/saasRole/v1`;
/**
 * @api {put} /roles/:id
 * @apiDescription 更新角色
 * @apiName putRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
 * @apiParamExample {json} Request-Body:
{
  "roleName": "testRole",
  "userList": [
    "1"
  ],
  "reqRoleDtoReqs": [
    {
      "appId": "5",
      "pemssionIds": [
        "175",
        "177",
        "176",
        "178"
      ]
    }
  ],
  "tenantId": "1"
}
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "code": 0,
  "errors": null,
  "message": "success",
  "data": "修改成功",
  "extra": null,
  "timestamp": "2019-06-20 22:37:18"
}
 */
rolesApi.put('/:id',async (ctx,next)=>{
    let roleId = ctx.params.id;
    let role = ctx.request.body;
    console.log(JSON.stringify(role));
    let body  = await request.put({
        headers:{
            'content-type': 'application/json',
            'Authorization': auth.buildBearerAuth(ctx)
        },  
        url: url4,
        body: role,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});

const url5 = `http://${idm_domain}/api-user/saasRole/v1`;
/**
 * @api {delete} /roles/:id
 * @apiDescription 更新角色
 * @apiName deleteRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "code": 0,
  "errors": null,
  "message": "success",
  "data": "删除成功",
  "extra": null,
  "timestamp": "2019-06-20 22:44:17"
}
 */
rolesApi.delete('/:id', async (ctx, next)=>{
    let roleId = ctx.params.id;
    let body  = await request.delete({
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        },  
        url: url5 + '/' + roleId,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});
module.exports = rolesApi;