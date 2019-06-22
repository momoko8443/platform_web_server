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
 * @apiDescription 根据用户名搜索平台下的用户列表
 * @apiName searchUsers
 * @apiGroup Users
 * @apiParam (queryParams) {String} username 用户名
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
    let body  = await request.post(url,{
        form: {
            size: parseInt(query.pageSize),
            total: parseInt(query.currentPage),
            username: query.username
        },
        headers: {
            'Authorization' : auth.buildBearerAuth(ctx)
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = body.data;
});



module.exports = usersApi;