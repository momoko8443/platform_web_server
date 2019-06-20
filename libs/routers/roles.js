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
 * @api {get} /benyun/api/roles
 * @apiDescription 获取租户下所有角色列表
 * @apiName getRoles
 * @apiGroup Roles
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiParam (queryParams) {Number} pageSize 页面大小
 * @apiParam (queryParams) {Number} currentPage 当前页码
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
const url3 = `http://${idm_domain}/api-user/saasRole/v1/`;
/**
 * @api {get} /benyun/api/roles/:id
 * @apiDescription 获取具体角色信息
 * @apiName getRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
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
rolesApi.get('/:id', async (ctx,next)=>{
    let roleId = ctx.params.id;
    let body = await request.get({
        url: url3 + '/'+roleId, 
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});
const url2 = `http://${idm_domain}/api-user/saasRole/add`;
/**
 * @api {post} /benyun/api/roles
 * @apiDescription 添加新角色
 * @apiName postRole
 * @apiGroup Roles
 * @apiParamExample {json} Request-Body:
 *  {
 *      "success" : "true",
 *      "result" : {
 *          "name" : "loginName",
 *          "password" : "loginPass"
 *      }
 *  }
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
 * @api {put} /benyun/api/roles/:id
 * @apiDescription 更新角色
 * @apiName putRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
 * @apiParamExample {json} Request-Body:
 *  {
 *      "success" : "true",
 *      "result" : {
 *          "name" : "loginName",
 *          "password" : "loginPass"
 *      }
 *  }
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
rolesApi.put('/:id',async (ctx,next)=>{
    let roleId = ctx.params.id;
    let role = ctx.request.body;
    console.log(JSON.stringify(role));
    let body  = await request.put({
        headers:{
            'content-type': 'application/json',
            'Authorization': auth.buildBearerAuth(ctx)
        },  
        url: url4 + '/' + roleId,
        body: role,
        json: true
    }).then((result)=>{
        return result;
    });
    ctx.body = body;
});

const url5 = `http://${idm_domain}/api-user/saasRole/v1/`;
/**
 * @api {delete} /benyun/api/roles/:id
 * @apiDescription 更新角色
 * @apiName deleteRole
 * @apiGroup Roles
 * @apiParam (pathParams) {Number} :id 角色ID
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