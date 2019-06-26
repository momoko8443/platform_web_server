const rp = require('request-promise');
const auth= require('../utils/auth');
let idm_domain = process.env.IDM? process.env.IDM : "47.104.78.73:5200";

module.exports = {
    getUser(token){
        return rp.get({
            headers:{
                'Authorization': auth.buildBearerAuth(token)
            },
            url: buildUserProfileURL(),
            json: true
        }).then((result)=>{
            return result;
        });
    }
}

function buildUserProfileURL(){
    return `http://${idm_domain}/api-user/saasuser/users/current`;
}


