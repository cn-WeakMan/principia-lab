(function(){'use strict';
function label(c,t,x,y,s=17){c.fillStyle='#d5e7f2';c.font=`${s}px system-ui`;c.textAlign='center';c.fillText(t,x,y)}function axes(c,W,H){c.strokeStyle='#58748b';c.lineWidth=2;c.beginPath();c.moveTo(45,30);c.lineTo(45,H-45);c.lineTo(W-25,H-45);c.stroke()}function bar(c,W,H,val,max,txt,yOffset=0){const left=35,width=W-80,y=H/2+yOffset;c.fillStyle='#263c53';c.fillRect(left,y,width,48);c.fillStyle='#53c9a8';c.fillRect(left,y,Math.max(0,Math.min(1,val/max))*width,48);label(c,txt,W/2,y-22)}

function extraDraw(kind,ctx,W,H,p,result){const [msg,val,max,second]=result;const safeMax=Math.max(1,max||1),safeVal=Math.max(0,val||0);
if(kind==='grid'||kind==='icons'){
 const count=kind==='icons'?Math.max(12,Math.ceil(safeMax)):20,shown=kind==='icons'?Math.round(safeVal):Math.round(Math.min(count,safeVal/safeMax*count));
 const columns=kind==='icons'?6:5,cell=Math.min(48,(W-110)/columns),rows=Math.ceil(count/columns),originX=(W-columns*cell)/2,originY=Math.max(25,(H-rows*cell)/2);
 for(let i=0;i<count;i++){const x=originX+(i%columns)*cell,y=originY+Math.floor(i/columns)*cell;ctx.beginPath();ctx.roundRect(x+3,y+3,cell-7,cell-7,6);ctx.fillStyle=i<shown?'#5ed5ba':'#293c54';ctx.fill();ctx.strokeStyle='#62849b';ctx.stroke();}
}else if(kind==='dual'){bar(ctx,W,H,safeVal,safeMax,`A：${Number(safeVal).toFixed(1)}`,-55);bar(ctx,W,H,second===undefined?safeMax-safeVal:second,safeMax,`B：${Number(second===undefined?safeMax-safeVal:second).toFixed(1)}`,55)}
else if(kind==='timeline'||kind==='steps'){const dots=kind==='steps'?Math.max(2,Math.min(6,Math.round(p[1]||3))):5;ctx.strokeStyle='#5c748b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(80,H/2);ctx.lineTo(W-80,H/2);ctx.stroke();for(let i=0;i<dots;i++){const x=80+(W-160)*i/(dots-1);ctx.beginPath();ctx.arc(x,H/2,12,0,2*Math.PI);ctx.fillStyle=i<=safeVal/safeMax*(dots-1)?'#5ed5ba':'#6588a5';ctx.fill();label(ctx,kind==='steps'?`第${i+1}次`:`${i+1}`,x,H/2+42,14)}}
else bar(ctx,W,H,safeVal,safeMax,`${Number(safeVal).toFixed(1)} / ${Number(safeMax).toFixed(1)}`);
}

window.PLAB_PRIMARY_DRAWING={label,axes,bar,extraDraw};
})();
