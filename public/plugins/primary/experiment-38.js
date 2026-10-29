/* Primary experiment 39, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','声音与振动次数','橡皮筋的振动','用振动次数与观察时长计算平均每秒振动次数。',[['振动次数',10,200,80,10],['观察时间(秒)',1,20,4,1]],p=>[`平均振动频率 ${ (p[0]/p[1]).toFixed(1)} 次/秒（Hz）`,p[0]/p[1],200],'这是平均频率的算术演示，不模拟真实声音频谱或音高感知。',['measurement','ratio','observation'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.38',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
