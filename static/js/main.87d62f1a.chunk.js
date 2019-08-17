(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{17:function(e,t,n){e.exports=n(26)},23:function(e,t,n){},24:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},25:function(e,t,n){},26:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(15),c=n.n(o),i=(n(23),n(1)),u=n(3),l=(n(24),n(25),n(2)),s=n(8),m=n(9);function d(e,t){var n=[],a=e.createMediaStreamDestination(),r=new MediaRecorder(a.stream);return t.connect(a),r.ondataavailable=function(e){n.push(e.data)},r.onstop=function(e){var t=new Blob(n,{type:"audio/ogg; codecs=opus"});document.createElement("audio");!function(e,t){var n=document.createElement("a");document.body.appendChild(n),n.style="display: none";var a=URL.createObjectURL(e);n.href=a,n.download=t,n.click(),URL.revokeObjectURL(a),n.remove()}(t,"audio.ogg")},r}var h=r.a.memo(function(e){var t=r.a.useRef(d(e.actx,e.inputNode)),n=r.a.useState(!1),a=Object(i.a)(n,2),o=a[0],c=a[1],u=r.a.useCallback(function(){return c(function(e){return!e})},[c]);return r.a.useEffect(function(){o?t.current.start():"inactive"!==t.current.state&&(t.current.stop(),t.current=d(e.actx,e.inputNode))},[o]),r.a.createElement("button",{onClick:u},o?"stop recording":"record audio")});function f(e,t){var n="scaletoy-".concat(e),r=Object(a.useState)(function(){try{var e=window.localStorage.getItem(n);return e?JSON.parse(e):t}catch(a){return console.log(a),t}}),o=Object(i.a)(r,2),c=o[0],u=o[1];return[c,function(e){try{var t=e instanceof Function?e(c):e;u(t),window.localStorage.setItem(n,JSON.stringify(t))}catch(a){console.log(a)}}]}function v(e){var t=e.onChangeOutput,n=e.selectedOutput,a=r.a.useState([]),o=Object(i.a)(a,2),c=o[0],u=o[1];return r.a.useEffect(function(){navigator.requestMIDIAccess().then(function(e){u(Array.from(e.outputs.values())),e.onstatechange=function(t){u(Array.from(e.outputs.values()))}})},[]),r.a.createElement("label",null,"midi out:"," ",r.a.createElement("select",{onChange:function(e){t(c[parseInt(e.currentTarget.value)])},value:c.indexOf(n)},r.a.createElement("option",{key:-1,value:-1},"(none)"),c.map(function(e,t){return r.a.createElement("option",{key:t,value:t},e.name)})))}var p=n(16);var b=["C","D","E","F","G","A","B"],g=new Set(["C","D","F","G","A"]),y={container:{textAlign:"center"},keyboard:{display:"inline-block",position:"relative",height:70,marginTop:20},whiteKey:{position:"absolute",borderBottomLeftRadius:4,borderBottomRightRadius:4,width:20,height:70,background:"white",border:"solid 1px black",zIndex:0},noteLabel:{width:20,marginTop:70},highlighted:{background:"#ff9"},blackKey:{position:"absolute",borderBottomLeftRadius:3,borderBottomRightRadius:3,width:9,height:50,background:"black",border:"solid 1px black",zIndex:1}};var E=r.a.memo(function(e){var t=b.length*e.octaves,n=[];return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(p.a)(Array(e).keys()).map(function(e){return e+t})}(e.octaves,e.startOctave).forEach(function(t,a){b.forEach(function(o,c){var i=o+t,l=o+"#"+t;n.push(r.a.createElement("div",{key:i,style:Object(u.a)({},y.whiteKey,e.highlightKeys&&e.highlightKeys.includes(i)?y.highlighted:null,{left:(a*b.length+c)*(y.whiteKey.width-1)})},r.a.createElement("div",{style:y.noteLabel},i))),g.has(o)&&n.push(r.a.createElement("div",{key:l,style:Object(u.a)({},y.blackKey,e.highlightKeys&&e.highlightKeys.includes(l)?y.highlighted:null,{left:(a*b.length+c+1)*(y.whiteKey.width-1)-(y.blackKey.width-1)/2})}))})}),r.a.createElement("div",{style:y.container},r.a.createElement("div",{style:Object(u.a)({},y.keyboard,{width:t*y.whiteKey.width})},n))}),k=!0,j=!1,w=[0,10,30,50,75,100,150,200],O={};w.forEach(function(e,t){O[e]=t});var C=["C","C#","D","D#","E","F","F#","G","G#","A","Bb","B"],x={major:["major","minor","minor","major","major","minor","diminished"],minor:["minor","diminished","major","minor","minor","major","major"],dorian:["minor","minor","major","major","minor","diminished","major"],lydian:["major","major","minor","diminished","major","minor","minor"],phrygian:["minor","major","major","minor","diminished","major","minor"],ionian:["major","minor","minor","major","major","minor","diminished"],mixolydian:["major","minor","diminished","major","minor","minor","major"],locrian:["diminished","major","minor","minor","major","major","minor"]},N=Object.keys(x),S=["i","ii","iii","iv","v","vi","vii"],A=Object.keys(x).reduce(function(e,t){var n=x[t];return e[t]=n.map(function(e,t){var n=S[t];switch(e){case"major":return n.toUpperCase();case"minor":return n;case"diminished":return n+"\xb0";default:throw new Error("unknown scaleType '".concat(e,"'"))}}),e},{});function T(e,t){return s.a(e+" "+t).notes.map(function(e,n){return a=s.b(x[t][n]),r=e,a.map(function(e){return m.a("".concat(r).concat(e))}).sort(function(e,t){return e.intervals.length-t.intervals.length}).map(function(e){return"".concat(e.tonic).concat(e.aliases[0])});var a,r})}var I=1/140*60,K=144,L=128,M=80,R=!1;function B(e){var t=function(e,t,n){var a=s.a("".concat(e).concat(t," ").concat(n)).notes;return a.push((r=l.b(a[0]),o=1,"".concat(r.pc).concat(r.oct+o))),a;var r,o}("c",4,"major"),n=0,a=null;setInterval(function(){null!=a&&e.dx7.onMidi([L,l.b(t[a]).midi,M]),e.dx7.onMidi([K,l.b(t[n]).midi,M]),a=n,n=(n+1)%t.length},1e3*I)}function D(e,t,n,a){var r=l.b(t).midi,o=e;return e.forEach(function(e){e.message[1]==r&&(e.time=n-.01,e.message[0]=L)}),function(e,t){var n=e.concat(t);return n.sort(function(e,t){return e.time-t.time}),n}(o,[{message:[K,r,M],time:n},{message:[L,r,M],time:a}])}function F(e,t){var n=m.a(e),a=t[n.tonic];return n.intervals.map(function(e){return l.d(a,e)})}function z(e,t,n){var a=s.a("".concat(e," ").concat(t)),r=a.notes,o=function(e,t){return e.intervals.map(function(n){return l.d("".concat(e.tonic).concat(t),n)})}(a,n),c={};o.forEach(function(e){c[l.b(e).pc]=e});var i=new Map(T(e,t).map(function(e,n){return[n,e.map(function(e){var a=m.a(e);return{pos:n,chord:a,chordType:x[t][n],chordNotesForOctave:F(e,c),chordName:e,size:a.intervals.length*("Unknown"===a.quality?-1:1)}})]})),u=new Map(Array.from(i.values).map(function(e){return[e.chordName,e]})),d=new Set;return i.forEach(function(e,t){e.forEach(function(e){d.add(e.size)})}),{scaleType:t,key:e,scalePitchClasses:r,scalePosChords:i,scaleNotes:o,chordDatasByName:u,sizes:Array.from(d).sort(function(e,t){return e-t})}}var U={major:"rgb(127,199,175)",minor:"rgb(255,158,157)",diminished:"rgb(218,216,167)"},J={display:"block",width:"100%",cursor:"pointer",color:"black",padding:4,paddingBottom:8,height:46,overflow:"hidden"},G={display:"flex"},P={flex:1},q=r.a.memo(function(e){var t=e.chordData,n=e.playChord,a=e.setLastChord,o=e.octave,c=e.strumming,i=e.selected,l=e.onMouseOver;return r.a.createElement("div",{style:Object(u.a)({},J,{background:U[t.chordType],border:"1px solid",borderColor:i?"rgba(0,0,0,0.2)":"transparent"}),onClick:function(){n(t,o,c),a(t.chordName),console.log(t)},onMouseOver:function(){l(t)}},r.a.createElement("div",null,t.chordName,!1,r.a.createElement("div",null,r.a.createElement("small",null,t.chordNotesForOctave.join()),!1)))});function W(e){var t=e.audioApi,n=r.a.useCallback(function(){return t.actx.resume()},[t]),a=r.a.useCallback(function(){return t.actx.suspend()},[t]),o=f("key","C"),c=Object(i.a)(o,2),u=c[0],s=c[1],m=f("strumming",w[2]),d=Object(i.a)(m,2),p=d[0],b=d[1],g=f("includeExtra",!1),y=Object(i.a)(g,2),x=y[0],S=y[1],T=r.a.useState(null),K=Object(i.a)(T,2),L=K[0],M=K[1],R=f("octave",4),B=Object(i.a)(R,2),F=B[0],U=B[1],J=f("scaleType","major"),W=Object(i.a)(J,2),X=W[0],$=W[1],H=r.a.useState(null),Q=Object(i.a)(H,2),V=Q[0],Y=Q[1],Z=r.a.useState([]),_=Object(i.a)(Z,2),ee=_[0],te=_[1],ne=r.a.useMemo(function(){return z(u,X,F)},[u,X,F]),ae=r.a.useCallback(function(){return S(function(e){return!e})}),re=r.a.useState([]),oe=Object(i.a)(re,2),ce=oe[0],ie=oe[1],ue=r.a.useState(null),le=Object(i.a)(ue,2),se=le[0],me=le[1],de=r.a.useCallback(function(){ie(function(e){var n=e,a=ne.scaleNotes.slice();a.push(l.d(a[0],"8P"));var r=t.actx.currentTime,o=0;return a.forEach(function(e){n=D(n,e,r+(o+=I),r+o+I)}),n})},[ie,t,ne]),he=r.a.useCallback(function(e,n,a){var r=e.chordNotesForOctave;ie(function(e){var n=e,o=t.actx.currentTime;return r.forEach(function(e,t){n=D(n,e,o+t*(a/1e3),o+I+t*(a/1e3))}),n}),te(function(t){return t.concat(e)})},[ie,t]);return r.a.useEffect(function(){var e=setInterval(function(){ie(function(e){return function(e,t,n){for(var a=0;a<e.length;a++){var r=e[a];if(r.time>t.actx.currentTime)break;n?(n.send,n.send(r.message)):t.dx7.onMidi(r.message)}return 0===a?e:e.slice(a)}(e,t,se)})},1);return function(){clearInterval(e)}},[se]),r.a.createElement("div",{className:"App"},r.a.createElement("button",{onClick:a},"pause audio"),r.a.createElement("button",{onClick:n},"resume audio"),r.a.createElement(h,{actx:t.actx,inputNode:t.dx7}),r.a.createElement(v,{selectedOutput:se,onChangeOutput:me}),r.a.createElement("div",null,r.a.createElement("label",null,"key:"," ",r.a.createElement("select",{value:ne.key,onChange:function(e){return s(e.currentTarget.value)}},C.map(function(e){return r.a.createElement("option",{key:e,value:e},e)})))," ",r.a.createElement("label",null,"octave:"," ",r.a.createElement("select",{value:F,onChange:function(e){return U(parseInt(e.currentTarget.value))}},[1,2,3,4,5,6,7].map(function(e){return r.a.createElement("option",{key:e,value:e},e)})))," ",r.a.createElement("label",null,"scale type:"," ",r.a.createElement("select",{value:X,onChange:function(e){return $(e.currentTarget.value)}},N.map(function(e){return r.a.createElement("option",{key:e,value:e},e)})))," ",r.a.createElement("label",null,"scale notes: "),ne.scaleNotes.join()," ",r.a.createElement("button",{onClick:de},"play scale")," ",r.a.createElement("label",null,"strumming:",r.a.createElement("input",{type:"range",min:0,max:9,value:O[p],onChange:function(e){b(w[parseInt(e.currentTarget.value)])}})," ",r.a.createElement("input",{hidden:!0,type:"number",value:p,readOnly:!0})),r.a.createElement("label",null,r.a.createElement("input",{type:"checkbox",onChange:ae,checked:x}),"include extra chords")),r.a.createElement(E,{highlightKeys:V?V.chordNotesForOctave:null,startOctave:F,octaves:3}),r.a.createElement("div",{style:G},r.a.createElement("div",{style:P},ne.sizes.filter(function(e){return!!x||e>0}).sort(function(e,t){return k?e-t:t-e}).map(function(e,t){return r.a.createElement("div",{key:t},!1,r.a.createElement("br",null),r.a.createElement("div",{key:e,style:{display:"flex"}},Array.from(ne.scalePosChords).map(function(n){var a=Object(i.a)(n,2),o=a[0],c=a[1];return r.a.createElement("div",{key:o,style:{flex:1}},0===t&&r.a.createElement("div",null,A[X][o]),c.filter(function(t){return t.size===e}).sort(function(e,t){return e.chordName.length-t.chordName.length}).map(function(e,t){return r.a.createElement(q,Object.assign({key:t},{chordData:e,playChord:he,setLastChord:M,octave:F,strumming:p,selected:e.chordName===L,onMouseOver:Y}))}))})))})),j&&r.a.createElement("div",{style:{width:"10vw"}},r.a.createElement("details",null,r.a.createElement("summary",null,r.a.createElement("div",null,"history")),r.a.createElement("div",{style:{height:"90vh",overflow:"auto"}},ee.slice().reverse().map(function(e,t){return r.a.createElement(q,Object.assign({key:t},{chordData:e,playChord:he,setLastChord:function(){},octave:F,strumming:p,selected:!1,onMouseOver:Y}))}),0===ee.length&&r.a.createElement("div",null,r.a.createElement("br",null),"played chords will appear here"))))),r.a.createElement("pre",{style:{height:300,overflow:"auto"}},ce.map(function(e){return JSON.stringify(e)}).join("\n")))}function X(){var e=r.a.useState(!1),t=Object(i.a)(e,2),n=t[0],a=t[1];return r.a.useEffect(function(){n?document.documentElement.classList.add("dark-mode"):document.documentElement.classList.remove("dark-mode")},[n]),r.a.createElement("div",{style:{position:"absolute",top:0,right:0}},r.a.createElement("label",null,"dark mode:"," ",r.a.createElement("input",{type:"checkbox",checked:n,onChange:function(){return a(function(e){return!e})}})))}(new AudioContext).state;var $=function(){var e=r.a.useState(!1),t=Object(i.a)(e,2),n=t[0],a=t[1],o=r.a.useState(null),c=Object(i.a)(o,2),u=c[0],l=c[1],s=r.a.useCallback(function(){document.querySelector(".dx7").style.visibility="visible",a(!0)},[a]);return r.a.useEffect(function(){window.onDX7Init=function(e,t){var n={dx7:e,actx:t};R&&B(n),l(n),"running"===t.state&&s()},initDX7("/scaletoy")},[]),u&&n?r.a.createElement("div",null,r.a.createElement(W,{audioApi:u}),r.a.createElement(X,null)):r.a.createElement("div",{className:"App"},u?r.a.createElement("button",{style:{fontSize:42,borderRadius:9,cursor:"pointer"},onClick:function(){u.actx.resume(),s()}},"start"):"loading")};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement($,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[17,1,2]]]);
//# sourceMappingURL=main.87d62f1a.chunk.js.map