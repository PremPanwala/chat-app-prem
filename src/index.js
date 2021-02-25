const express=require('express');
const path=require('path')
const http=require('http')
const socket=require('socket.io')
const app=express();
const port=process.env.PORT || 3000;
const {generatemsg,generatelocationmsg}=require('./utils/message')
const publicpath=path.join(__dirname,'../public')
const {addusers,getuser,removeuser,getuserinroom}=require('../src/utils/user')
const server=http.createServer(app);
const io=socket(server);
const Filter=require('bad-words')
//let count=0;
let msg="welcome";
io.on('connection',(socket)=>{
    console.log("NEW CLIENT CONNECTION")
    
    
    // socket.emit('updatecount',count)
    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('updatecount',count)
    // })
    socket.on('joinroom',({username,room},callback)=>{
        const { error , user }=addusers({id:socket.id,username,room})
        if(error)
        {
            return callback(error);
        }
        socket.join(user.room)
        console.log(username,room)
           socket.emit('welcomemsg',generatemsg('Admin','WELCOME'))
            socket.broadcast.to(user.room).emit('welcomemsg',generatemsg('Admin',`${user.username} has joined`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getuserinroom(user.room)
            })
            callback();
    })


    socket.on('disconnect',()=>{
        const user=removeuser(socket.id);
        if(user)
        {
            io.to(user.room).emit('welcomemsg',generatemsg(user.username,`A ${user.username} has been left`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getuserinroom(user.room)
            })
        }
        
    })
    socket.on('sendlocation',(latitude,longittude,callback)=>{
        const user=getuser(socket.id)
        io.to(user.room).emit('locationmsg',generatelocationmsg(user.username,`https://google.com/maps?q=${latitude},${longittude}`));
        callback();
    })
    socket.on('formsubmit',(msg,callback)=>{
        const user=getuser(socket.id);
        if(!user)
        {
            return callback('NO USER FOUND')    
        }
        
        const filter=new Filter();
        if(filter.isProfane(msg))
        {
            return callback('Bad Words are not allowed')
        }
        //console.log("Form Submitted",msg)
        io.to(user.room).emit('welcomemsg',generatemsg(user.username,msg))
        callback();
    })
})

app.use(express.static(publicpath))
server.listen(port,()=>{
    console.log('SERVER STARTED '+port)
})