const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
const membersApi = new Router();
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-user/saasuser/page`;
/**
 * @api {get} /members
 * @apiDescription 获取租户下所有成员列表
 * @apiName getMembers
 * @apiGroup Members
 * @apiParam (queryParams) {Number} pageSize 页面大小
 * @apiParam (queryParams) {Number} currentPage 当前页码
 * @apiParam (queryParams) {Number} tenantId 租户ID
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
membersApi.get('/', async (ctx)=>{
    let query = ctx.query;
    let body  = await request.post(url,{
        form: {
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            tenantId: query.tenantId ? query.tenantId:1
        },
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});


const url2 = `http://${idm_domain}/api-user/saasuser/v1`;
/**
 * @api {delete} members/:id
 * @apiDescription 移除租户下某个成员
 * @apiName deleteMember
 * @apiGroup Members
 * @apiParam (pathParams) {Number} :id 成员ID
 * @apiParam (queryParams) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 {
  "code": 0,
  "errors": null,
  "message": "success",
  "data": "删除成功",
  "extra": null,
  "timestamp": "2019-06-20 20:02:20"
}
 */
membersApi.delete('/:id', async (ctx,next)=>{
    let memberId = ctx.params.id;
    let tenantId = ctx.query.tenantId;
    let body = ctx.request.body;
    let result = await request.delete({
        url: url2 + '/' + memberId + '?tenantId=' + tenantId, 
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        },
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});


membersApi.get('/:id', async (ctx,next)=>{

});


const url3 = `http://${idm_domain}/api-user/saasuser/add`;
/**
 * @api {post} /members
 * @apiDescription 为租户添加新成员
 * @apiName postMember
 * @apiGroup Members
 * @apiParam (jsonBody) {String} username 新成员的平台用户名
 * @apiParam (jsonBody) {Number} tenantId 租户ID
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
  "code": 0,
  "errors": null,
  "message": "success",
  "extra": null,
  "timestamp": "2019-06-20 20:15:46"
}
 */
membersApi.post('/',async (ctx,next)=>{
    let body = ctx.request.body;
    let result  = await request.post(url,{
        form: {
            userName: body.username,
            tenantId: body.tenantId ? body.tenantId:1
        },
        headers:{
            'Authorization': auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    delete result['data'];
    ctx.body = result;
});
module.exports = membersApi;