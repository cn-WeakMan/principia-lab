/* Primary experiment 19, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','光照与影长','影子有多长','改变物体高度及光线相对地面的仰角。',[['物体高度(cm)',10,100,50,5],['太阳仰角(度)',15,75,45,5]],p=>[`理想模型影长 ≈ ${(p[0]/Math.tan(p[1]*Math.PI/180)).toFixed(1)} cm`,Math.min(200,p[0]/Math.tan(p[1]*Math.PI/180)),200],'水平地面、垂直物体和平行光近似；并非真实太阳轨迹模拟。',['shadows','geometry','measurement'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.18',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
