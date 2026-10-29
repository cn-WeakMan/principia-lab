/* Primary experiment 31, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','找零钱','购物找零实验','改变商品单价、购买数量及付款金额，观察余额和不足。',[['单价(元)',1,15,5,1],['购买件数',1,6,3,1],['付款(元)',10,100,30,5]],p=>[`总价 ${p[0]*p[1]} 元；${p[2]>=p[0]*p[1]?'找回 '+(p[2]-p[0]*p[1])+' 元':'还差 '+(p[0]*p[1]-p[2])+' 元'}`,Math.min(p[2],p[0]*p[1]),Math.max(p[2],p[0]*p[1])],'不考虑会员优惠、税费等，付款与价格均按整元计算。',['shopping','number','ratio'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.30',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
