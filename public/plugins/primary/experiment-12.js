/* Primary experiment 13, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','语文说明顺序','写一份可复现的实验步骤','改变每次测量的时长，生成带数量信息的操作描述。',[['单次观测(秒)',10,60,30,5],['重复次数',1,6,3,1]],p=>[`先准备秒表；再每次观测 ${p[0]} 秒；重复 ${p[1]} 次；最后比较记录。总观测 ${p[0]*p[1]} 秒。`,p[0]*p[1],360],'完整实验还需要交代观察对象和控制条件。',['sentence','observation','measurement'],'steps'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.12',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
