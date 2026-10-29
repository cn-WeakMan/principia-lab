/* Primary experiment 11, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','时间与钟表','一天的时间预算','分配学习和运动时间，观察剩余自由时间。',[['学习(小时)',0,10,4,1],['运动(小时)',0,6,2,1]],p=>[`已安排 ${p[0]+p[1]} 小时；一天剩余 ${24-p[0]-p[1]} 小时（含睡眠等）`,p[0]+p[1],24],'一天还需要睡眠、饮食等；不能把剩余时间全视为娱乐。',['pattern','story','rules'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.10',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
