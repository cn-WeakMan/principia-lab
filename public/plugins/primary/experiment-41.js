/* Primary experiment 42, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','志愿活动统计','合作劳动如何记录','改变参与人数和每人服务时间，计算总人时。',[['参与人数',1,20,8,1],['每人服务时长(小时)',1,6,2,1]],p=>[`总服务量 ${p[0]*p[1]} 人·小时；并非实际经过 ${p[0]*p[1]} 小时`,p[0]*p[1],120],'人时是工作量单位，不等同于经过时间或劳动成效。',['sharing','measurement','statistics'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.41',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
