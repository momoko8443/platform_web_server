const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const industryApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});

const url = `http://${idm_domain}/api-user/industry/list`;
/**
 * @api {get} /industry
 * @apiDescription 获取行业列表
 * @apiName getIndustry
 * @apiGroup Industry
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
industryApi.get('/', async (ctx)=>{
    let body = ctx.request.body;
    let result  = await request.get(url,{})
    .then((result)=>{
        return result;
    });
    ctx.body = result.data;
});



module.exports = industryApi;