(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{19:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var a=n(1),r=n(0),o=n.n(r);function c(e){var t=e.notePlayer,n=o.a.useState(function(){return new Set}),r=Object(a.a)(n,2),c=r[0],i=r[1],u=o.a.useRef(new Set),l=o.a.useMemo(function(){return{setKeyPressed:function(e){var n=u.current;if(!n.has(e)){t.triggerAttack(e);var a=new Set(n).add(e);u.current=a,i(a)}},setKeyReleased:function(e){var n=u.current;if(n.has(e)){var a=new Set(n);a.delete(e),u.current=a,i(a),t.triggerRelease(e)}}}},[i]);return{pressedKeys:c,pressedKeysAPI:l,makeHandlers:function(e){return{onMouseOver:function(t){t.buttons>0&&l.setKeyPressed(e)},onMouseDown:function(){l.setKeyPressed(e)},onMouseUp:function(){l.setKeyReleased(e)},onMouseOut:function(){l.setKeyReleased(e)}}}}}},25:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(1),r=n(0);function o(e,t){var n="scaletoy-".concat(e),o=Object(r.useState)(function(){try{var e=window.localStorage.getItem(n);return e?JSON.parse(e):t}catch(a){return console.log(a),t}}),c=Object(a.a)(o,2),i=c[0],u=c[1];return[i,function(e){try{var t=e instanceof Function?e(i):e;u(t),window.localStorage.setItem(n,JSON.stringify(t))}catch(a){console.log(a)}}]}},26:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(0),r=n.n(a);function o(e,t){var n=r.a.useRef(e);r.a.useEffect(function(){var a=n.current;n.current=e,a!==e&&t(e,a)},[e,t])}},27:function(e,t,n){"use strict";var a=n(3),r=n(13),o=n(0),c=n.n(o),i=n(8),u=n(19),l=n(6);var s=["C","D","E","F","G","A","B"],m=new Set(["C","D","F","G","A"]),d={scale:"#4287f5",chord:"orange"};t.a=c.a.memo(function(e){var t=s.length*e.octaves,n=[],o=e.highlightKeys,f=e.highlightType,h=e.notePlayer,v=c.a.useMemo(function(){return o?o.map(i.a):null},[o]),p=Object(u.a)({notePlayer:h}),b=p.pressedKeys,y=p.makeHandlers;return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(r.a)(Array(e).keys()).map(function(e){return e+t})}(e.octaves,e.startOctave).forEach(function(e,t){s.forEach(function(r,o){var i=r+e,u=r+"#"+e;n.push(c.a.createElement("div",Object.assign({key:i},y(i),{style:Object(a.a)({},l.a.whiteKey,v&&v.includes(i)?{background:d[f]}:null,b.has(i)?l.a.pressed:null,{left:(t*s.length+o)*(l.a.whiteKey.width-1)})}),c.a.createElement("div",{style:l.a.noteLabel},"C"===r?i:r))),m.has(r)&&n.push(c.a.createElement("div",Object.assign({key:u},y(u),{style:Object(a.a)({},l.a.blackKey,v&&v.includes(u)?{background:d[f]}:null,{left:(t*s.length+o+1)*(l.a.whiteKey.width-1)-(l.a.blackKey.width-1)/2})})))})}),c.a.createElement("div",{style:l.a.container},c.a.createElement("div",{style:Object(a.a)({},l.a.keyboard,{width:t*l.a.whiteKey.width})},n))})},35:function(e,t,n){e.exports=n(52)},4:function(e,t,n){"use strict";n.d(t,"a",function(){return o}),n.d(t,"b",function(){return c});var a=n(1),r=n(0),o={boolean:{parse:function(e){return!(null==e||"false"===e)},stringify:function(e){return JSON.stringify(e)}},integer:{parse:function(e){var t=parseInt(e,10);if(Number.isNaN(t))throw new Error("invalid int when parsing: "+e);return t},stringify:function(e){return e.toString()}},string:{parse:function(e){return e},stringify:function(e){return e}}};function c(e,t,n){var o=Object(r.useState)(function(){try{var a=new URL(window.location.href).searchParams.get(e);return null!=a?n.parse(a):t}catch(r){return console.log(r),t}}),c=Object(a.a)(o,2),i=c[0],u=c[1];return[i,function(t){try{var a="function"===typeof t?t(i):t;u(a);var r=new URL(window.location.href);r.searchParams.set(e,n.stringify(a)),window.history.replaceState(null,null,r.toString())}catch(o){console.log(o)}}]}},40:function(e,t,n){},42:function(e,t,n){},52:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(33),c=n.n(o),i=(n(40),n(20)),u=n.n(i),l=n(24),s=n(1),m=n(4),d=n(25),f=(n(42),n(3)),h=n(34),v=n(2),p=n(11),b=n(12),y=n(9);function g(e,t){var n=document.createElement("a");document.body.appendChild(n),n.style="display: none";var a=URL.createObjectURL(e);n.href=a,n.download=t,n.click(),URL.revokeObjectURL(a),n.remove()}function E(e,t){var n=[],a=e.createMediaStreamDestination(),r=new MediaRecorder(a.stream);return t.connect(a),r.ondataavailable=function(e){n.push(e.data)},r.onstop=function(e){g(new Blob(n,{type:"audio/ogg; codecs=opus"}),"audio.ogg")},r}function k(e){var t=r.a.useRef(E(e.actx,e.inputNode)),n=r.a.useState(!1),a=Object(s.a)(n,2),o=a[0],c=a[1],i=r.a.useCallback(function(){return c(function(e){return!e})},[c]);return r.a.useEffect(function(){o?t.current.start():"inactive"!==t.current.state&&(t.current.stop(),t.current=E(e.actx,e.inputNode))},[o]),r.a.createElement("button",{onClick:i},o?"stop recording":"record audio")}var w=r.a.memo(function(e){return"undefined"==typeof MediaRecorder?r.a.createElement("button",{disabled:!0},"[recording not available]"):r.a.createElement(k,e)}),j=n(26);function O(e){var t=e.type,n=e.onChange,a=e.selectedPort,o=r.a.useState([]),c=Object(s.a)(o,2),i=c[0],u=c[1],l="input"==t?"inputs":"outputs";return r.a.useEffect(function(){navigator.requestMIDIAccess&&navigator.requestMIDIAccess().then(function(e){u(Array.from(e[l].values())),e.onstatechange=function(t){u(Array.from(e[l].values()))}})},[]),r.a.createElement("label",null,"midi ","input"==t?"in":"out",":"," ",r.a.createElement("select",{onChange:function(e){n(i[parseInt(e.currentTarget.value)])},value:i.indexOf(a)},r.a.createElement("option",{key:-1,value:-1},"(none)"),i.map(function(e,t){return r.a.createElement("option",{key:t,value:t},e.name)})))}var C=n(27),x=n(13),S=n(8),M=n(19),P=n(6),N=[1,5,6,3,2,7];var K=Object(f.a)({},P.a,{tonicKey:{background:"#ccc"},noteLabel:{width:20,marginTop:70,fontSize:10}}),D={scale:"#4287f5",chord:"orange"},A="asdfghjkl;'".split("");function R(e){return e[0]>"B"}var L=r.a.memo(function(e){var t=e.scaleSteps*e.octaves,n=[],a=e.highlightKeys,o=e.highlightType,c=e.notePlayer,i=r.a.useMemo(function(){return a?a.map(S.a):null},[a]),u=Object(M.a)({notePlayer:c}),l=u.pressedKeys,s=u.pressedKeysAPI,m=u.makeHandlers,d=r.a.useMemo(function(){var t=e.scalePitchClasses.map(S.a),n=N.slice(0,e.scaleSteps),a=n.map(function(e){return t[e-1]}),r=new Map(N.map(function(e){return[t[e-1],e]})),o=a.slice().sort(function(e,t){return R(e)===R(t)?e<t?-1:1:R(e)?-1:1});return{simplifiedPitchClasses:t,importance:n,simplifiedPitchClassesForImportance:a,notesScaleDegrees:r,sortedPitchClassesForImportance:o}},[e.scalePitchClasses,e.scaleSteps]),h=(d.simplifiedPitchClasses,d.importance,d.simplifiedPitchClassesForImportance),v=d.notesScaleDegrees,p=d.sortedPitchClassesForImportance,b=r.a.useCallback(function(t){var n=function(e){var t=A.indexOf(e);return t>-1?t:null}(t);return null==n?null:p[n%p.length]+Math.min(7,Math.max(0,e.startOctave+Math.floor(n/p.length)))},[p,e.startOctave]);return r.a.useEffect(function(){var t=function(t){var n=b(t.key);switch(null!=n&&s.setKeyPressed(n),t.key){case"z":e.setOctave(function(e){return Math.max(e-1,0)});break;case"x":e.setOctave(function(e){return Math.min(e+1,7)})}},n=function(e){var t=b(e.key);null!=t&&s.setKeyReleased(t)};return document.addEventListener("keydown",t),document.addEventListener("keyup",n),function(){document.removeEventListener("keydown",t),document.removeEventListener("keyup",n)}},[s,b,e.setOctave]),function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(x.a)(Array(e).keys()).map(function(e){return e+t})}(e.octaves,e.startOctave).forEach(function(t,a){p.forEach(function(c,u){var s=c+t,d=c===e.scalePitchClasses[0];n.push(r.a.createElement("div",Object.assign({key:s},m(s),{style:Object(f.a)({},K.whiteKey,d?K.tonicKey:null,i&&i.includes(s)?{background:D[o]}:null,l.has(s)?K.pressed:null,{left:(a*h.length+u)*(K.whiteKey.width-1)})}),r.a.createElement("div",{style:K.noteLabel},e.showScaleDegrees?v.get(c):d?s:c)))})}),r.a.createElement("div",{style:K.container},r.a.createElement("div",{style:Object(f.a)({},K.keyboard,{width:t*K.whiteKey.width})},n))}),I=n(28),T=function(e){var t=e.history,n=e.beatDurationSeconds,a=e.bpm,o=e.strumming,c=r.a.useCallback(function(){var e=new I.Midi;e.header.setTempo(a);var r=e.addTrack();t.forEach(function(e,t){var a=e.chordNotesForOctave,c=t*n*2,i=o/1e3;a.forEach(function(e,t){var a=t*i;r.addNote({midi:v.b(e).midi,time:c+a,duration:n+a})})}),g(new Blob([e.toArray()],{type:"audio/midi"}),"export.mid")},[t]);return r.a.createElement("button",{onClick:c},"export midi")};function B(e){var t=e.summary,n=e.children,a=e.startOpen,o=r.a.useState(a),c=Object(s.a)(o,2),i=c[0],u=c[1],l=r.a.useCallback(function(e){e.preventDefault(),e.stopPropagation(),u(!i)},[i]);return r.a.createElement("details",{open:i},r.a.createElement("summary",{onClick:l},t),i&&n)}function F(e){var t=e.label,n=e.options,a=e.value,o=e.onChange;return r.a.createElement("label",null,t,":"," ",r.a.createElement("select",{value:a,onChange:r.a.useCallback(function(e){return o(e.currentTarget.value)},[o])},n.map(function(e){return r.a.createElement("option",{key:e,value:e},e)})))}function z(e){var t=e.label,n=e.min,a=e.max,o=(e.step,e.value),c=e.formatValue,i=e.showValue,u=e.onChange;return r.a.createElement("label",null,t,":"," ",r.a.createElement("input",{type:"range",min:n,max:a,value:o,onChange:r.a.useCallback(function(e){u(parseInt(e.currentTarget.value))},[u])}),i&&r.a.createElement(r.a.Fragment,null," ",r.a.createElement("input",{type:"number",value:c?c(o):o,readOnly:!0})))}function U(e){var t=e.label,n=e.checked,a=e.onChange;return r.a.createElement("label",null,r.a.createElement("input",{type:"checkbox",onChange:r.a.useCallback(function(){return a(function(e){return!e})},[a]),checked:n}),t)}var J={major:"rgb(127,199,175)",minor:"rgb(255,158,157)",diminished:"rgb(218,216,167)"},q={display:"block",width:"100%",cursor:"pointer",color:"black",padding:4,paddingBottom:8,height:46,overflow:"hidden",textAlign:"center"},G=r.a.memo(function(e){var t=e.chordData,n=e.playChord,a=e.setLastChord,o=e.octave,c=e.strumming,i=e.strumMode,u=e.selected,l=e.showScaleDegrees,s=e.onMouseOver,m=null;return m=l?r.a.createElement("div",null,r.a.createElement("small",null,t.chord.intervals.join())):r.a.createElement("div",null,r.a.createElement("small",null,t.chordNotesForOctave.join())),r.a.createElement("div",{style:Object(f.a)({},q,{background:J[t.chordType],border:"1px solid",borderColor:u?"rgba(0,0,0,0.2)":"transparent"}),onMouseDown:function(){n(t,o,c,i),a(t.chordName),console.log(t)},onMouseEnter:function(e){e.buttons>0&&(n(t,o,c,i),a(t.chordName)),s(t.chordNotesForOctave)}},r.a.createElement("div",null,t.chordName,!1,m))}),X=!0,H=!0,V=[0,10,30,50,75,100,150,200],W={};V.forEach(function(e,t){W[e]=t});var $=["C","C#","D","D#","E","F","F#","G","G#","A","Bb","B"],Q={major:["major","minor","minor","major","major","minor","diminished"],minor:["minor","diminished","major","minor","minor","major","major"],dorian:["minor","minor","major","major","minor","diminished","major"],lydian:["major","major","minor","diminished","major","minor","minor"],phrygian:["minor","major","major","minor","diminished","major","minor"],ionian:["major","minor","minor","major","major","minor","diminished"],mixolydian:["major","minor","diminished","major","minor","minor","major"],locrian:["diminished","major","minor","minor","major","major","minor"]},Y=Object.keys(Q),Z=["i","ii","iii","iv","v","vi","vii"],_=Object.keys(Q).reduce(function(e,t){var n=Q[t];return e[t]=n.map(function(e,t){var n=Z[t];switch(e){case"major":return n.toUpperCase();case"minor":return n;case"diminished":return n+"\xb0";default:throw new Error("unknown scaleType '".concat(e,"'"))}}),e},{});function ee(e,t){return p.a(e+" "+t).notes.map(function(e,n){return a=p.b(Q[t][n]),r=e,a.map(function(e){return b.a("".concat(r).concat(e))}).sort(function(e,t){return e.intervals.length-t.intervals.length}).map(function(e){return"".concat(e.tonic).concat(e.aliases[0])});var a,r})}var te=140,ne=1/te*60,ae=144,re=128,oe=80;function ce(e,t,n,a){var r=v.b(t).midi,o=e;return e.forEach(function(e){e.message[1]==r&&(e.time=n-.01,e.message[0]=re)}),function(e,t){var n=e.concat(t);return n.sort(function(e,t){return e.time-t.time}),n}(o,[{message:[ae,r,oe],time:n},{message:[re,r,oe],time:a}])}function ie(e,t){var n=b.a(e),a=t[n.tonic];return n.intervals.map(function(e){return y.b(v.d(a,e))})}function ue(e,t,n){var a=p.a("".concat(e," ").concat(t)),r=a.notes,o=function(e,t){return e.intervals.map(function(n){return v.d("".concat(e.tonic).concat(t),n)})}(a,n),c={};o.forEach(function(e){c[v.b(e).pc]=e});var i=new Map(ee(e,t).map(function(e,n){return[n,e.map(function(e){var a=b.a(e);return{pos:n,chord:a,chordType:Q[t][n],chordNotesForOctave:ie(e,c),chordName:e,size:a.intervals.length*("Unknown"===a.quality?-1:1)}})]})),u=new Map(Array.from(i.values).map(function(e){return[e.chordName,e]})),l=new Set;return i.forEach(function(e,t){e.forEach(function(e){l.add(e.size)})}),{scaleType:t,key:e,scalePitchClasses:r,scalePosChords:i,scaleNotes:o,chordDatasByName:u,sizes:Array.from(l).sort(function(e,t){return e-t})}}var le={display:"flex"},se={flex:1},me={textAlign:"left"},de={textAlign:"center"};var fe=function(e){var t=e.audioApi,n=r.a.useCallback(function(){return t.actx.resume()},[t]),a=r.a.useCallback(function(){return t.actx.suspend()},[t]),o=Object(m.b)("key","C",m.a.string),c=Object(s.a)(o,2),i=c[0],u=c[1],l=Object(m.b)("strumming",V[2],m.a.integer),d=Object(s.a)(l,2),p=d[0],b=d[1],g=Object(m.b)("strumMode","up",m.a.string),E=Object(s.a)(g,2),k=E[0],x=E[1],S=Object(m.b)("includeExtra",!1,m.a.boolean),M=Object(s.a)(S,2),P=M[0],N=M[1],K=r.a.useState(null),D=Object(s.a)(K,2),A=D[0],R=D[1],I=Object(m.b)("octave",4,m.a.integer),J=Object(s.a)(I,2),q=J[0],Q=J[1],Z=Object(m.b)("scaleType","major",m.a.string),ee=Object(s.a)(Z,2),ie=ee[0],fe=ee[1],he=Object(m.b)("showScaleDegrees",!0,m.a.boolean),ve=Object(s.a)(he,2),pe=ve[0],be=ve[1],ye=Object(m.b)("scaleSteps",7,m.a.integer),ge=Object(s.a)(ye,2),Ee=ge[0],ke=ge[1],we=r.a.useState(null),je=Object(s.a)(we,2),Oe=je[0],Ce=je[1],xe=r.a.useCallback(function(e){return Ce({keys:e,type:"chord"})},[Ce]),Se=r.a.useState([]),Me=Object(s.a)(Se,2),Pe=Me[0],Ne=Me[1],Ke=r.a.useCallback(function(){return Ne([])},[Ne]),De=r.a.useMemo(function(){return ue(i,ie,q)},[i,ie,q]),Ae=r.a.useCallback(function(){Ce({keys:De.scaleNotes,type:"scale"})},[De]),Re=r.a.useState([]),Le=Object(s.a)(Re,2),Ie=Le[0],Te=Le[1],Be=r.a.useState(null),Fe=Object(s.a)(Be,2),ze=Fe[0],Ue=Fe[1],Je=r.a.useCallback(function(){Te(function(e){var n=e,a=De.scaleNotes.slice();a.push(v.d(a[0],"8P"));var r=t.actx.currentTime,o=0;return a.forEach(function(e){n=ce(n,e,r+(o+=ne),r+o+ne)}),n})},[Te,t,De]),qe=r.a.useCallback(function(e,n,a,r){var o=e.chordNotesForOctave;Te(function(e){var n=e,c=t.actx.currentTime,i=o.slice();return"down"===r?i.reverse():"random"===r&&Object(h.knuthShuffle)(i),i.forEach(function(e,t){n=ce(n,e,c+t*(a/1e3),c+ne+t*(a/1e3))}),n}),Ne(function(t){return t.concat(e)})},[Te,t]);Object(j.a)(De,Ae);var Ge=r.a.useMemo(function(){return ze?(ze.send,function(e){return ze.send(e)}):t.dx7?function(e){return t.dx7.onMidi(e)}:function(e){}},[t,ze]),Xe=r.a.useMemo(function(){return{triggerAttack:function(e){Ge([ae,v.b(e).midi,oe])},triggerRelease:function(e){Ge([re,v.b(e).midi,oe])}}},[Ge]);return r.a.useEffect(function(){var e=setInterval(function(){Te(function(e){return function(e,t,n){for(var a=0;a<e.length;a++){var r=e[a];if(r.time>t.actx.currentTime)break;n(r.message)}return 0===a?e:e.slice(a)}(e,t,Ge)})},1);return function(){clearInterval(e)}},[Ge]),r.a.createElement("div",{className:"App",style:me},r.a.createElement("div",null,r.a.createElement("button",{onClick:a},"pause audio"),r.a.createElement("button",{onClick:n},"resume audio"),t.dx7&&r.a.createElement(w,{actx:t.actx,inputNode:t.dx7}),r.a.createElement(O,{type:"output",selectedPort:ze,onChange:Ue}),r.a.createElement("div",{onMouseOver:Ae},r.a.createElement(F,{label:"key",options:$,value:De.key,onChange:u})," ",r.a.createElement(F,{label:"octave",options:[1,2,3,4,5,6,7],value:q,onChange:Q})," ",r.a.createElement(F,{label:"scale type",options:Y,value:ie,onChange:fe})," ",r.a.createElement("label",null,"scale notes: "),De.scaleNotes.map(function(e){return y.b(e)}).join()," ",r.a.createElement("button",{onClick:Je},"play scale")," ",r.a.createElement(U,{label:"show notes as scale degrees",onChange:be,checked:pe}))),r.a.createElement(B,{summary:"scale keyboard",startOpen:!0},r.a.createElement(F,{label:"scale steps",options:[1,2,3,4,5,6,7],value:Ee,onChange:ke}),r.a.createElement(L,{scalePitchClasses:De.scalePitchClasses,highlightKeys:Oe&&"scale"!==Oe.type?Oe.keys:null,setOctave:Q,startOctave:Math.max(0,q-1),octaves:5,highlightType:Oe?Oe.type:"scale",notePlayer:Xe,showScaleDegrees:pe,scaleSteps:Ee})),r.a.createElement(B,{summary:"keyboard",startOpen:!0},r.a.createElement(C.a,{highlightKeys:Oe?Oe.keys:null,startOctave:Math.max(0,q-1),octaves:5,highlightType:Oe?Oe.type:"scale",notePlayer:Xe})),H&&r.a.createElement("div",{style:me},r.a.createElement("details",null,r.a.createElement("summary",{style:me},r.a.createElement("div",{style:{display:"initial"}},"history/export")),r.a.createElement("div",{style:{padding:"8px 0"}},r.a.createElement(T,{bpm:te,history:Pe,strumming:p,beatDurationSeconds:ne}),r.a.createElement("button",{onClick:Ke},"clear history")),r.a.createElement("div",{style:{width:"90vw",overflow:"auto",display:"flex"}},Pe.slice().reverse().map(function(e,t){return r.a.createElement("div",{key:t,style:{width:"".concat(1/7*100,"vw")}},r.a.createElement(G,{chordData:e,playChord:qe,setLastChord:function(){},octave:q,strumming:p,strumMode:k,showScaleDegrees:pe,selected:!1,onMouseOver:xe}))}),0===Pe.length&&r.a.createElement("div",null,"played chords will appear here")))),r.a.createElement(B,{summary:"chord palette",startOpen:!0},r.a.createElement(z,{label:"strumming",min:0,max:V.length-1,value:W[p],onChange:function(e){b(V[e])}}),r.a.createElement(F,{label:"strum mode",options:["up","down","random"],value:k,onChange:x})," ",r.a.createElement(U,{label:"include extra chords",onChange:N,checked:P}),r.a.createElement("div",{style:Object(f.a)({},le,de)},r.a.createElement("div",{style:se},De.sizes.filter(function(e){return!!P||e>0}).sort(function(e,t){return X?e-t:t-e}).map(function(e,t){return r.a.createElement("div",{key:t},!1,r.a.createElement("br",null),r.a.createElement("div",{key:e,style:{display:"flex"}},Array.from(De.scalePosChords).map(function(n){var a=Object(s.a)(n,2),o=a[0],c=a[1];return r.a.createElement("div",{key:o,style:{flex:1}},0===t&&r.a.createElement("div",null,_[ie][o]),c.filter(function(t){return t.size===e}).sort(function(e,t){return e.chordName.length-t.chordName.length}).map(function(e,t){return r.a.createElement(G,Object.assign({key:t},{chordData:e,playChord:qe,setLastChord:R,octave:q,strumming:p,strumMode:k,showScaleDegrees:pe,selected:e.chordName===A,onMouseOver:xe}))}))})))})))),r.a.createElement(B,{summary:"midi events"},r.a.createElement("pre",{style:{height:300,overflow:"auto"}},Ie.map(function(e){return JSON.stringify(e)}).join("\n"))))},he=Boolean(new URL(document.location.href).searchParams.get("sampled"));function ve(e){if(null==e)throw new Error("unexpected null");return e}function pe(){var e=Object(d.a)("darkMode",!1),t=Object(s.a)(e,2),n=t[0],a=t[1];return r.a.useEffect(function(){n?ve(document.documentElement).classList.add("dark-mode"):ve(document.documentElement).classList.remove("dark-mode")},[n]),r.a.createElement("div",{style:{position:"absolute",top:0,right:0}},r.a.createElement("label",null,"dark mode:"," ",r.a.createElement("input",{type:"checkbox",checked:n,onChange:function(){return a(function(e){return!e})}})))}var be=function(){var e=r.a.useState(!1),t=Object(s.a)(e,2),a=t[0],o=t[1],c=r.a.useState(null),i=Object(s.a)(c,2),d=i[0],f=i[1],h=r.a.useCallback(function(){ve(document.querySelector(".dx7")).style.visibility="visible",o(!0)},[o]);r.a.useEffect(function(){function e(){return t.apply(this,arguments)}function t(){return(t=Object(l.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([n.e(4),n.e(3)]).then(n.bind(null,62));case 2:(0,e.sent.sampledDX7)().then(function(e){var t=e.dx7,n=e.actx;window.initDX7Shim(t,n)});case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}window.onDX7Init=function(t,n){if(!t)return e();f({dx7:t,actx:n}),"running"===n.state&&h()},he?e():window.initDX7("/scaletoy")},[]);var v=function(){var e=Object(m.b)("route","chordpalette",m.a.string);switch(Object(s.a)(e,1)[0]){case"exploder":return r.a.lazy(function(){return n.e(5).then(n.bind(null,63))});case"chordpalette":default:return fe}}();return d&&a?r.a.createElement(r.a.Suspense,{fallback:r.a.createElement("div",null,"loading...")},r.a.createElement("div",null,r.a.createElement(v,{audioApi:d}),r.a.createElement(pe,null))):r.a.createElement("div",{className:"App"},d?r.a.createElement("button",{style:{fontSize:42,borderRadius:9,cursor:"pointer"},onClick:function(){d.actx.resume(),h()}},"start"):"loading...")};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(be,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},6:function(e,t,n){"use strict";t.a={container:{textAlign:"center"},keyboard:{display:"inline-block",position:"relative",height:70,marginTop:16,marginBottom:20,cursor:"pointer"},whiteKey:{position:"absolute",borderBottomLeftRadius:4,borderBottomRightRadius:4,width:20,height:70,background:"white",border:"solid 1px black",zIndex:0},noteLabel:{width:20,marginTop:70},highlighted:{background:"orange"},blackKey:{position:"absolute",borderBottomLeftRadius:3,borderBottomRightRadius:3,width:9,height:50,background:"black",border:"solid 1px black",zIndex:1},pressed:{background:"#7f4af9"}}},8:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(2),r=n(9);function o(e){var t=r.b(e);return"b"===a.b(t).acc?r.a(t):t}}},[[35,1,2]]]);
//# sourceMappingURL=main.737b7708.chunk.js.map