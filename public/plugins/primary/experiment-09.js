/* Primary experiment 10, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','折扣与百分比','文具店折扣','设置原价与折扣，观察实际支付金额。',[['原价(元)',10,100,60,5],['折扣(%)',10,100,80,10]],p=>[`支付 ${(p[0]*p[1]/100).toFixed(2)} 元；节省 ${(p[0]*(100-p[1])/100).toFixed(2)} 元`,p[0]*p[1]/100,p[0]],'简化为直接折扣，不计其他优惠和费用。',['ratio','shopping','fraction'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.9',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
