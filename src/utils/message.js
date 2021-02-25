const generatemsg=(username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime(),
    }
}
const generatelocationmsg=(username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}
module.exports={generatemsg,generatelocationmsg}