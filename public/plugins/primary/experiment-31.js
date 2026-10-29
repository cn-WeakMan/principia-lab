/* Primary experiment 32, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','周长与围栏','围住一个花园','调整长和宽，探究周长与面积为什么不同。',[['长(米)',1,15,8,1],['宽(米)',1,12,5,1]],p=>[`长方形周长 ${2*(p[0]+p[1])} 米，面积 ${p[0]*p[1]} 平方米`,2*(p[0]+p[1]),60],'只适用于长方形；周长与面积单位不同，不可直接相减比较。',['geometry','measurement','ratio'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.31',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
