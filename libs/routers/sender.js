const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const senderApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.111.18.39:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-msg/send/personalRegister`;
/**
 * @api {post} /sender/register/person/code
 * @apiDescription  发送个人注册短信
 * @apiName senderRegisterPerson
 * @apiGroup Sender
 * @apiParam (jsonBody) {String} mobile 用户手机号
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    "code": 0,
    "errors": null,
    "message": "success",
    "data": "个人注册短信发送成功",
    "extra": null,
    "timestamp": "2019-06-22 15:54:56"
}
 */
senderApi.post('/register/person/code', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url,{
        qs: {
            mobile: body.mobile,
        } 
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

const url2 = `http://${idm_domain}/api-msg/send/enterpriseRegister`;
/**
 * @api {post} /sender/register/enterprise/code
 * @apiDescription  发送企业注册短信
 * @apiName senderRegisterEnterprise
 * @apiGroup Sender
 * @apiParam (jsonBody) {String} mobile 企业用户手机号
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    "code": 0,
    "errors": null,
    "message": "success",
    "data": "企业注册短信发送成功",
    "extra": null,
    "timestamp": "2019-06-22 15:54:56"
}
 */
senderApi.post('/register/enterprise/code', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url2,{
        qs: {
            mobile: body.mobile,
        } 
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});


const url3 = `http://${idm_domain}/api-msg/send/loginCode`;
/**
 * @api {post} /sender/login/code
 * @apiDescription  登录验证短信
 * @apiName senderLoginCode
 * @apiGroup Sender
 * @apiParam (jsonBody) {String} mobile 个人/企业用户手机号
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    "code": 0,
    "errors": null,
    "message": "success",
    "data": "登录验证短信发送成功",
    "extra": null,
    "timestamp": "2019-06-22 15:54:56"
}
 */
senderApi.post('/login/code', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.post(url3,{
        qs: {
            mobile: body.mobile,
        } 
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

module.exports = senderApi;