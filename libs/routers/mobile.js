const Router = require('koa-router');
const rp = require('request-promise');
const auth = require('../utils/auth');
const mobileApi = new Router();
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";
function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'] && response.headers['content-type'].search('application/json') > -1) {
        return JSON.parse(body);
    }else {
        return body;
    }
}
let request = rp.defaults({transform:autoParse});


const url = `http://${idm_domain}/api-user/register/mobileitexist`;
/**
 * @api {get} /mobile
 * @apiDescription 查询手机号是否存在
 * @apiName getMobile
 * @apiGroup Mobile
 * @apiParam (queryParams) {String} mobile 手机号
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
{
    code:0
    data:"恭喜！验证通过"
    errors:null
    extra:null
    message:"success"
    timestamp:"2019-06-26 17:14:48"
}
 */
mobileApi.get('/', async (ctx)=>{
    let mobile = ctx.query.mobile;
    let result  = await request.get(url,{
        qs: {
            mobile: mobile
        }
    }).then((result)=>{
        return result;
    });
    ctx.body = result;
});

module.exports = mobileApi;