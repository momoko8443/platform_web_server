const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const registerApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-user/register/personal`;
/**
 * @api {post} /register/person
 * @apiDescription 注册个人用户
 * @apiName registerUser
 * @apiGroup Register
 * @apiParam (jsonBody) {String} mobile 用户手机号
 * @apiParam (jsonBody) {String} password 用户设置的密码
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
registerApi.post('/person', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url,{
        qs: {
            mobile: body.mobile,
            password: body.password,
        } 
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

module.exports = registerApi;