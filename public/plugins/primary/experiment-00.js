/* Primary experiment 01, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const experiment={name:'平均分与公平',title:'蛋糕怎么分？',description:'把一个蛋糕平均分给若干人，每人分到多少？再想想：均分和公平是否始终相同？',params:[['人数',2,8,4,1]],calc:p=>({v:1/p[0],text:`1 个蛋糕 ÷ ${p[0]} 人 = 每人 ${ (1/p[0]).toFixed(3)} 个（约 ${(100/p[0]).toFixed(1)}%）`,limit:'这是数量平均分配模型。真实公平还涉及需求、约定、权利与情境。',links:['fraction','fairness','sharing','plural']}),draw:(ctx,W,H,p)=>{const n=p[0],r=Math.min(W,H)*.29,cx=W/2,cy=H/2;for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+i*2*Math.PI/n,-Math.PI/2+(i+1)*2*Math.PI/n);ctx.closePath();ctx.fillStyle=`hsl(${160+i*260/n},50%,${40+i%2*12}%)`;ctx.fill();ctx.strokeStyle='#0b1728';ctx.lineWidth=3;ctx.stroke()}label(ctx,`每人：1/${n}`,W/2,H-26)}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.0',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
