/* Primary experiment 29, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','公平分配的余数','班级分发画笔','让彩笔数量和人数改变，观察无法均分时如何处理。',[['彩笔数量',1,40,23,1],['学生人数',2,12,6,1]],p=>[`每人 ${Math.floor(p[0]/p[1])} 支，剩余 ${p[0]%p[1]} 支；如何协商余下部分？`,p[0]%p[1],p[1]],'平均分的余数不是道德上的唯一合理分配方法。',['fairness','sharing','fraction'],'grid'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.28',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
