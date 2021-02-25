const socket=io()
socket.on('welcomemsg',(msg)=>{
    console.log(msg)
    const html1=Mustache.render(msgtemplate,{
        username:msg.username,
        msg:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $msgplace.insertAdjacentHTML('beforeend',html1)
    
    autoscroll();
})
// socket.on('updatecount',(count)=>{
//     console.log("The count has been updated",count)
// })
// document.querySelector('#incbtn').addEventListener('click',()=>{
//     console.log("BUTTON CLICKED")
//     socket.emit('increment')
// })



const { username, room }=Qs.parse(location.search,{ ignoreQueryPrefix:true}); 
const $msgform=document.querySelector('#msgform')
const $msginput=$msgform.querySelector('input')
const $msgbtn=$msgform.querySelector('button')
const $locationbtn=document.querySelector('#locationbtn');
const $msgplace=document.querySelector('#msgplace')


const msgtemplate=document.querySelector('#msg-template').innerHTML
const locationtemplate=document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

const autoscroll=()=>{
    const $newmsg=$msgplace.lastElementChild
    const newmsgstyle=getComputedStyle($newmsg)
    const newmsgmargin=parseInt(newmsgstyle.marginBottom)
    const newmsgheight=$newmsg.offsetHeight + newmsgmargin
    const visibleheight=$msgplace.offsetHeight
    const containerheight=$msgplace.scrollHeight
      const scrolloffset=$msgplace.scrollTop + visibleheight
      if(containerheight - newmsgheight <= scrolloffset)
      {
        $msgplace.scrollTop=$msgplace.scrollHeight
      }
    console.log(newmsgmargin)
}
socket.on('roomdata',({room,users})=>{
console.log(room)
console.log(users)
const html=Mustache.render(sidebartemplate,{
    room,
    users
})
document.querySelector('#sidebar').innerHTML=html
})


socket.on('locationmsg',(msg)=>{
    console.log(msg);
    
    const html1=Mustache.render(locationtemplate,{
        username:msg.username,
        msg:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $msgplace.insertAdjacentHTML('beforeend',html1)
    autoscroll();
})
socket.on('submitform',(msg)=>{
    console.log('SOM',msg)
    const html=Mustache.render(msgtemplate,{
        username:msg.username,
        msg,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $msgplace.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
socket.on('locationsend',(latitude,longittude)=>{
    console.log('to all users',latitude,longittude)
    
})
$msgform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.inpmsg.value;
    $msgbtn.setAttribute('disabled','disabled');
    $msginput.value='';
    $msginput.focus();
   
    socket.emit('formsubmit',msg,(error)=>{
        if(error)
        {
            return console.log(error)
        }
        $msgbtn.removeAttribute('disabled');
        console.log('Message was Delieverd')
    });
})
$locationbtn.addEventListener('click',()=>{
    console.log(room)
    console.log(username)
    if(!navigator.geolocation)
    {
        return('BROWSER DOES NOT SUPPORT GEOLOCATION')
    }
    console.log("HIIII")
    $locationbtn.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((res)=>{
        
        socket.emit('sendlocation',res.coords.latitude,res.coords.longitude,()=>{
            console.log('Location Shared')
            
            $locationbtn.removeAttribute('disabled')
        });

    })
})


socket.emit('joinroom',{username,room},(error)=>{
   if(error)
   {
       alert(error);
       location.href="/"
   }
})
