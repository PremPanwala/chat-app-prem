const users=[]
const addusers=({id,username,room})=>{

     username=username.trim().toLowerCase();
     room=room.trim();
    if(!username || !room)
    {
        return {
            error:'username and room must be provided'
        }
    }
    const ans=users.find((user)=>{
        return user.room===room && user.username===username
    })
    if(ans)
    {
        return{
            error:'Username already exists'
        }
    }
    const user={id,username,room}
    users.push(user);
    return {user}
}
const removeuser=(id)=>{
const ans=users.findIndex((user)=>{
    return user.id===id
});
if(ans!=-1)
{
    return users.splice(ans,1)[0]
}
}
const getuser=(id)=>{
    const ans=users.find((user)=>{
        return user.id===id;
    })
    return ans;
}
const getuserinroom=(room)=>{
    const ans=users.filter((user)=>{
        return user.room===room
    })
    return ans;
}


module.exports={
    addusers,
    removeuser,
    getuser,
    getuserinroom
}



