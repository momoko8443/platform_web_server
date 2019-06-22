
const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const validatorApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});


const url = `http://${idm_domain}/api-msg/check/personal_register_code`;
/**
 * @api {post} /validator/register/person/code
 * @apiDescription  发送个人注册短信
 * @apiName validatorSmsPerson
 * @apiGroup Validator
 * @apiParam (jsonBody) {String} mobile 用户手机号
 * @apiParam (jsonBody) {String} code 用户收到的验证码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    "code": 0,
    "errors": null,
    "message": "success",
    "data": "验证通过",
    "extra": null,
    "timestamp": "2019-06-22 15:56:13"
}
 */
validatorApi.post('/register/person/code', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url,{
        qs: {
            mobile: body.mobile,
            code: body.code
        } 
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

module.exports = validatorApi;