module.exports = {
    buildBearerAuth(ctx){
        let access_token;
        if((typeof ctx) === 'string'){
            access_token = ctx;
        }else{
            access_token = ctx.req.user.token.access_token;
        }
        return 'Bearer ' + access_token;
    },
    buildBasicAuth(username,password){
        var tmp = username+":"+password;
        var tmp = Buffer.from(tmp);
        return "Basic " + tmp.toString('base64');
    },
};