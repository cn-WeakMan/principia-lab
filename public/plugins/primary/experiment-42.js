/* Independent primary experiment: constant speed and distance */
(function(){'use strict';
const experiment={group:'数学与科学',name:'速度与路程',title:'时间增加，路程怎样变化？',description:'在速度保持不变时，观察路程与时间的正比例关系。',params:[['速度（米/秒）',1,10,3,1],['时间（秒）',0,20,5,1]],calc:p=>({text:`速度 ${p[0]} 米/秒 × 时间 ${p[1]} 秒 = 路程 ${p[0]*p[1]} 米`,limit:'只有速度保持不变时，路程才与时间成正比例。',links:['ratio','number','measurement']}),draw:(ctx,W,H,p)=>{ctx.save();ctx.fillStyle='#278b86';ctx.fillRect(70,H/2-15,Math.max(0,Math.min(W-140,(p[0]*p[1])/(10*20)*(W-140))),30);ctx.fillStyle='#1f2937';ctx.font='18px sans-serif';ctx.fillText(`路程 ${p[0]*p[1]} 米`,70,H/2-30);ctx.restore();}};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.42',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
