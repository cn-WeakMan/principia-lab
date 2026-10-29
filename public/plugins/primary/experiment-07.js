/* Primary experiment 08, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','长方形面积','为花坛铺草坪','调整花坛长和宽，比较面积和周长。',[['长度(m)',1,12,6,1],['宽度(m)',1,10,4,1]],p=>[`面积 ${p[0]*p[1]} m²；周长 ${2*(p[0]+p[1])} m`,p[0]*p[1],120],'仅适用于长方形，面积与周长单位不同。',['geometry','measurement','description'],'grid'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.7',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
