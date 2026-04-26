import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{Pn as t,Rn as n}from"./vendor-misc-Bh0ZUXav.js";import{yi as r}from"./index-DFhfzAJ8.js";var i=e(n(),1),a=t(),o=[`bg-red-500`,`bg-blue-500`,`bg-green-500`,`bg-yellow-500`,`bg-purple-500`,`bg-pink-500`,`bg-orange-500`,`bg-cyan-500`];function s(){let[e,t]=(0,i.useState)([]);return(0,i.useEffect)(()=>{t(Array.from({length:40},(e,t)=>({id:t,left:Math.random()*100,delay:Math.random()*.5,duration:2+Math.random()*2,size:8+Math.random()*8,color:o[Math.floor(Math.random()*o.length)],rotation:Math.random()*360})))},[]),(0,a.jsxs)(`div`,{className:`pointer-events-none fixed inset-0 overflow-hidden`,children:[e.map(e=>(0,a.jsx)(`div`,{className:r(`absolute top-0 rounded-sm`,e.color),style:{left:`${e.left}%`,width:`${e.size}px`,height:`${e.size}px`,animation:`confetti-fall ${e.duration}s linear ${e.delay}s infinite`,transform:`rotate(${e.rotation}deg)`}},e.id)),(0,a.jsx)(`style`,{children:`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `})]})}export{s as t};