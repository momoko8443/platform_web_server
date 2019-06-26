const rp = require('request-promise');
const auth= require('../utils/auth');
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";

let url = `http://${idm_domain}/api-auth/oauth/remove/token`;
module.exports = {
    logout(token){
        return rp.get({
            url: url,
            qs:{
                access_token: token
            },
            json: true
        }).then((result)=>{
            return result;
        });
    }
}

