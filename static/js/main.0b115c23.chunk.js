(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{11:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var a=n(5),r=n(9);function c(e){var t=r.c(e);return"b"===a.a(t).acc?r.a(t):t}},15:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(2),r=n(0),c=n.n(r);function o(e){var t=e.summary,n=e.children,r=e.startOpen,o=c.a.useState(r),i=Object(a.a)(o,2),u=i[0],s=i[1],l=c.a.useCallback(function(e){e.preventDefault(),e.stopPropagation(),s(!u)},[u]);return c.a.createElement(c.a.Fragment,null,c.a.createElement("details",{open:u},c.a.createElement("summary",{onClick:l},t),u&&n))}},16:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var a=n(0),r=n.n(a);function c(e){var t=e.label,n=e.checked,a=e.onChange,c=e.align;return r.a.createElement("label",null,"right"===c&&t,r.a.createElement("input",{type:"checkbox",onChange:r.a.useCallback(function(){return a(!n)},[n,a]),checked:n}),"right"!==c&&t)}},26:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var a=n(2),r=n(0),c=n.n(r);function o(e){var t=e.notePlayer,n=c.a.useState(function(){return new Set}),r=Object(a.a)(n,2),o=r[0],i=r[1],u=c.a.useRef(new Set),s=c.a.useMemo(function(){return{setKeyPressed:function(e){var n=u.current;if(!n.has(e)){t.triggerAttack(e);var a=new Set(n).add(e);u.current=a,i(a)}},setKeyReleased:function(e){var n=u.current;if(n.has(e)){var a=new Set(n);a.delete(e),u.current=a,i(a),t.triggerRelease(e)}}}},[i,t]);return{pressedKeys:o,pressedKeysAPI:s,makeHandlers:function(e){return{onMouseOver:function(t){t.buttons>0&&s.setKeyPressed(e)},onMouseDown:function(){s.setKeyPressed(e)},onMouseUp:function(){s.setKeyReleased(e)},onMouseOut:function(){s.setKeyReleased(e)}}}}}},30:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var a=n(2),r=n(0);function c(e,t){var n="scaletoy-".concat(e),c=Object(r.useState)(function(){try{var e=window.localStorage.getItem(n);return e?JSON.parse(e):t}catch(a){return console.log(a),t}}),o=Object(a.a)(c,2),i=o[0],u=o[1];return[i,function(e){try{var t=e instanceof Function?e(i):e;u(t),window.localStorage.setItem(n,JSON.stringify(t))}catch(a){console.log(a)}}]}},31:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var a=n(0),r=n.n(a);function c(e,t){var n=r.a.useRef(e);r.a.useEffect(function(){var a=n.current;n.current=e,a!==e&&t(e,a)},[e,t])}},32:function(e,t,n){"use strict";var a=n(3),r=n(14),c=n(0),o=n.n(c),i=n(11),u=n(26),s=n(8);var l=["C","D","E","F","G","A","B"],m=new Set(["C","D","F","G","A"]),d={scale:"#0867ff",keys:"orange"};t.a=o.a.memo(function(e){var t=l.length*e.octaves,n=[],c=e.highlightKeys,f=e.highlightScale,h=e.notePlayer,v=o.a.useMemo(function(){return c?c.map(i.a):null},[c]),b=o.a.useMemo(function(){return f?f.map(i.a):null},[f]),p=o.a.useCallback(function(e,t){var n="#"===e[1];return Object(a.a)({},v&&v.includes(t)?{background:d.keys}:null,b&&b.includes(e)?{boxShadow:"inset -0px -4px ".concat(d.scale)}:{boxShadow:"inset -0px -4px #".concat(n?"333":"aaa")})},[b,v]),y=Object(u.a)({notePlayer:h}),g=y.pressedKeys,E=y.makeHandlers;return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(r.a)(Array(e).keys()).map(function(e){return e+t})}(e.octaves,e.startOctave).forEach(function(e,t){l.forEach(function(r,c){var i=r+e,u=r+"#"+e;n.push(o.a.createElement("div",Object.assign({key:i},E(i),{style:Object(a.a)({},s.a.whiteKey,p(r,i),g.has(i)?s.a.pressed:null,{left:(t*l.length+c)*(s.a.whiteKey.width-1)})}),o.a.createElement("div",{style:s.a.noteLabel},"C"===r?i:r))),m.has(r)&&n.push(o.a.createElement("div",Object.assign({key:u},E(u),{style:Object(a.a)({},s.a.blackKey,p(r+"#",u),g.has(u)?s.a.pressed:null,{left:(t*l.length+c+1)*(s.a.whiteKey.width-1)-(s.a.blackKey.width-1)/2})})))})}),o.a.createElement("div",{style:s.a.container},o.a.createElement("div",{style:Object(a.a)({},s.a.keyboard,{width:t*s.a.whiteKey.width})},n))})},41:function(e,t,n){e.exports=n(58)},46:function(e,t,n){},47:function(e,t,n){},58:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(38),o=n.n(c),i=(n(46),n(2)),u=n(6),s=n(30),l=(n(47),n(3)),m=n(14),d=n(39),f=n(5),h=n(40),v=n(19),b=n(13),p=n(9);function y(e,t){var n=document.createElement("a");document.body.appendChild(n),n.style="display: none";var a=URL.createObjectURL(e);n.href=a,n.download=t,n.click(),URL.revokeObjectURL(a),n.remove()}function g(e,t){var n=[],a=e.createMediaStreamDestination(),r=new MediaRecorder(a.stream);return t.connect(a),r.ondataavailable=function(e){n.push(e.data)},r.onstop=function(e){y(new Blob(n,{type:"audio/ogg; codecs=opus"}),"audio.ogg")},r}function E(e){var t=r.a.useRef(g(e.actx,e.inputNode)),n=r.a.useState(!1),a=Object(i.a)(n,2),c=a[0],o=a[1],u=r.a.useCallback(function(){return o(function(e){return!e})},[o]);return r.a.useEffect(function(){c?t.current.start():"inactive"!==t.current.state&&(t.current.stop(),t.current=g(e.actx,e.inputNode))},[c]),r.a.createElement("button",{onClick:u},c?"stop recording":"record audio")}var k=r.a.memo(function(e){return"undefined"==typeof MediaRecorder?r.a.createElement("button",{disabled:!0},"[recording not available]"):r.a.createElement(E,e)}),O=n(31);function j(e){var t=e.type,n=e.onChange,a=e.selectedPort,c=r.a.useState([]),o=Object(i.a)(c,2),u=o[0],s=o[1],l="input"==t?"inputs":"outputs";return r.a.useEffect(function(){navigator.requestMIDIAccess&&navigator.requestMIDIAccess().then(function(e){s(Array.from(e[l].values())),e.onstatechange=function(t){s(Array.from(e[l].values()))}})},[]),r.a.createElement("label",null,"midi ","input"==t?"in":"out",":"," ",r.a.createElement("select",{onChange:function(e){n(u[parseInt(e.currentTarget.value)])},value:u.indexOf(a)},r.a.createElement("option",{key:-1,value:-1},"(none)"),u.map(function(e,t){return r.a.createElement("option",{key:t,value:t},e.name)})))}var w=n(32),C=n(11),x=n(26),S=n(8),M=[1,5,6,3,2,7];var P=Object(l.a)({},S.a,{tonicKey:{background:"#ccc"},noteLabel:{width:20,marginTop:70,fontSize:10}}),N={scale:"#4287f5",chord:"orange"},K="asdfghjkl;'".split("");function D(e){return e[0]>"B"}var A="chord";var R=r.a.memo(function(e){var t=e.scaleSteps*e.octaves,n=[],a=e.highlightKeys,c=e.notePlayer,o=r.a.useMemo(function(){return a?a.map(C.a):null},[a]),i=Object(x.a)({notePlayer:c}),u=i.pressedKeys,s=i.pressedKeysAPI,d=i.makeHandlers,f=r.a.useMemo(function(){var t=e.scalePitchClasses.map(C.a),n=M.slice(0,e.scaleSteps),a=n.map(function(e){return t[e-1]}),r=new Map(M.map(function(e){return[t[e-1],e]})),c=a.slice().sort(function(e,t){return D(e)===D(t)?e<t?-1:1:D(e)?-1:1});return{simplifiedPitchClasses:t,importance:n,simplifiedPitchClassesForImportance:a,notesScaleDegrees:r,sortedPitchClassesForImportance:c}},[e.scalePitchClasses,e.scaleSteps]),h=(f.simplifiedPitchClasses,f.importance,f.simplifiedPitchClassesForImportance),v=f.notesScaleDegrees,b=f.sortedPitchClassesForImportance,p=r.a.useCallback(function(t){var n=function(e){var t=K.indexOf(e);return t>-1?t:null}(t);return null==n?null:b[n%b.length]+Math.min(7,Math.max(0,e.startOctave+Math.floor(n/b.length)))},[b,e.startOctave]);return r.a.useEffect(function(){var t=function(t){var n=p(t.key);switch(null!=n&&s.setKeyPressed(n),t.key){case"z":e.setOctave(function(e){return Math.max(e-1,0)});break;case"x":e.setOctave(function(e){return Math.min(e+1,7)})}},n=function(e){var t=p(e.key);null!=t&&s.setKeyReleased(t)};return document.addEventListener("keydown",t),document.addEventListener("keyup",n),function(){document.removeEventListener("keydown",t),document.removeEventListener("keyup",n)}},[s,p,e.setOctave]),function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(m.a)(Array(e).keys()).map(function(e){return e+t})}(e.octaves,e.startOctave).forEach(function(t,a){b.forEach(function(c,i){var s=c+t,m=c===e.scalePitchClasses[0];n.push(r.a.createElement("div",Object.assign({key:s},d(s),{style:Object(l.a)({},P.whiteKey,m?P.tonicKey:null,o&&o.includes(s)?{background:N[A]}:null,u.has(s)?P.pressed:null,{left:(a*h.length+i)*(P.whiteKey.width-1)})}),r.a.createElement("div",{style:P.noteLabel},e.showScaleDegrees?v.get(c):m?s:c)))})}),r.a.createElement("div",{style:P.container},r.a.createElement("div",{style:Object(l.a)({},P.keyboard,{width:t*P.whiteKey.width})},n))}),F=n(33),I=function(e){var t=e.history,n=e.beatDurationSeconds,a=e.bpm,c=e.strumming,o=r.a.useCallback(function(){var e=new F.Midi;e.header.setTempo(a);var r=e.addTrack();t.forEach(function(e,t){var a=e.chordNotesForOctave,o=t*n*2,i=c/1e3;a.forEach(function(e,t){var a=t*i;r.addNote({midi:f.a(e).midi,time:o+a,duration:n+a})})}),y(new Blob([e.toArray()],{type:"audio/midi"}),"export.mid")},[t]);return r.a.createElement("button",{onClick:o},"export midi")},L=n(15);function T(e){var t=e.label,n=e.options,a=e.type,c=e.value,o=e.onChange;return r.a.createElement("label",null,t,":"," ",r.a.createElement("select",{value:c,onChange:r.a.useCallback(function(e){return o("number"===a?parseFloat(e.currentTarget.value):e.currentTarget.value)},[o,a])},n.map(function(e){return r.a.createElement("option",{key:e,value:e},e)})))}function B(e){var t=e.label,n=e.min,a=e.max,c=(e.step,e.value),o=e.formatValue,i=e.showValue,u=e.onChange;return r.a.createElement("label",null,t,":"," ",r.a.createElement("input",{type:"range",min:n,max:a,value:c,onChange:r.a.useCallback(function(e){u(parseInt(e.currentTarget.value))},[u])}),i&&r.a.createElement(r.a.Fragment,null," ",r.a.createElement("input",{type:"number",value:o?o(c):c,readOnly:!0})))}var z=n(16),U={major:"rgb(127,199,175)",minor:"rgb(255,158,157)",diminished:"rgb(218,216,167)"},J={display:"block",width:"100%",cursor:"pointer",color:"black",padding:4,paddingBottom:8,height:46,overflow:"hidden",textAlign:"center"},G=r.a.memo(function(e){var t=e.chordData,n=e.playChord,c=e.endChord,o=e.source,i=(e.octave,e.strumming),u=e.strumMode,s=e.selected,m=e.showScaleDegrees,d=e.onMouseOver,f=null,h=Object(a.useRef)(!1);return f=m?r.a.createElement("div",null,r.a.createElement("small",null,t.chord?t.chord.intervals.join():"")):r.a.createElement("div",null,r.a.createElement("small",null,t.chordNotesForOctave.join())),r.a.createElement("div",{style:Object(l.a)({},J,{background:U[t.chordType]||"#ccc",border:"1px solid",borderColor:s?"rgba(0,0,0,0.2)":"transparent"}),onMouseDown:function(){h.current=!0,n(t,i,u,o),console.log(t)},onMouseUp:function(){h.current&&c(t,i,u,o),h.current=!1},onMouseEnter:function(e){e.buttons>0&&(h.current=!0,n(t,i,u,o)),d(t.chordNotesForOctave)},onMouseLeave:function(e){e.buttons>0&&(h.current&&c(t,i,u,o),h.current=!1)}},r.a.createElement("div",null,t.chordName,!1,f))});function H(e){var t=e.children,n=e.className,a=e.name,c=e.sticky,o=e.onSetSticky;return r.a.createElement("div",{className:n,style:c?{position:"sticky",top:-1,zIndex:2}:{position:"relative"}},t,r.a.createElement("div",{style:{position:"absolute",top:1,right:1}},r.a.createElement(z.a,{label:"sticky",onChange:r.a.useCallback(function(e){o(a,e)},[o,a]),checked:c,align:"right"})))}function W(e){e.scaleData;var t=e.playChord,n=e.endChord,a=e.strumming,c=e.strumMode,o=e.showScaleDegrees,i=e.setHighlightedKeys,u=e.lastChord,s=u?r.a.createElement(r.a.Fragment,null,"".concat(u.chord.symbol)+(u.chord.name.length>2?" (".concat(u.chord.name,")"):""),u.rotations&&r.a.createElement("div",{style:{display:"flex"}},u.rotations.map(function(e,u){return r.a.createElement("div",{key:u,style:{width:"".concat(1/7*100,"vw"),height:46,overflow:"hidden"}},r.a.createElement(G,{chordData:e,playChord:t,endChord:n,strumming:a,strumMode:c,showScaleDegrees:o,selected:!1,onMouseOver:i,source:"nearby"}))}))):null;return r.a.createElement("div",{style:{height:60,overflow:"hidden"}},s)}var q=!0,X=!0,V=[0,10,30,50,75,100,150,200],Y={};V.forEach(function(e,t){Y[e]=t});var $=["C","C#","D","D#","E","F","F#","G","G#","A","Bb","B"],Q={major:["major","minor","minor","major","major","minor","diminished"],minor:["minor","diminished","major","minor","minor","major","major"],dorian:["minor","minor","major","major","minor","diminished","major"],lydian:["major","major","minor","diminished","major","minor","minor"],phrygian:["minor","major","major","minor","diminished","major","minor"],ionian:["major","minor","minor","major","major","minor","diminished"],mixolydian:["major","minor","diminished","major","minor","minor","major"],locrian:["diminished","major","minor","minor","major","major","minor"]},Z=Object.keys(Q),_=["i","ii","iii","iv","v","vi","vii"],ee=Object.keys(Q).reduce(function(e,t){var n=Q[t];return e[t]=n.map(function(e,t){var n=_[t];switch(e){case"major":return n.toUpperCase();case"minor":return n;case"diminished":return n+"\xb0";default:throw new Error("unknown scaleType '".concat(e,"'"))}}),e},{});function te(e,t){return v.a(e+" "+t).notes.map(function(e,n){return function(e,t){return e.map(function(e){return b.b("".concat(t).concat(e))}).sort(function(e,t){return e.intervals.length-t.intervals.length}).map(function(e){return"".concat(e.tonic).concat(e.aliases[0])})}(v.b(Q[t][n]),Object(C.a)(e))})}var ne=140,ae=1/ne*60,re=144,ce=128,oe=80;function ie(e,t,n,a){var r=f.a(t).midi,c=e;return e.forEach(function(e){e.message[1]===r&&(e.time=n-.01,e.message[0]=ce)}),ue(c,[{message:[re,r,oe],time:n},{message:[ce,r,oe],time:a}])}function ue(e,t){var n=e.concat(t);return n.sort(function(e,t){return e.time-t.time}),n}function se(e,t,n,a,r,c,o){for(var i=b.b(e),u=b.c(e.slice(i.tonic.length),t,t),s=function(e,t){var n=b.b(e),a=t[n.tonic];return n.intervals.map(function(e){return p.c(f.b(a,e))})}(e,r),l=[],m=function(e){if(h.a(u.intervals[u.intervals.length-1])>=7)return"break";var t=u.tonic,n=u.symbol.slice(f.a(u.tonic).pc.length),a=b.c(n,t,s[e]);if(a.empty)return"break";l.push({chordName:u.symbol,chord:a,chordNotesForOctave:a.intervals.map(function(e){return Object(C.a)(f.b(a.tonic,e))})})},d=0;d<s.length;d++){if("break"===m(d))break}return{degree:n,chord:u,chordType:Q[a][n],chordNotesForOctave:s,pitchClasses:u.notes,chordName:e,rotations:l,size:u.intervals.length*("Unknown"===u.quality?-1:1)}}function le(e,t,n){var a=v.a("".concat(e," ").concat(t)),r=a.notes,c=function(e,t){return e.intervals.map(function(n){return f.b("".concat(e.tonic).concat(t),n)})}(a,n),o={},i={};c.forEach(function(e,t){o[e]=t,i[Object(C.a)(f.a(e).pc)]=e});f.a(c[0]).oct;var u=new Map(te(e,t).map(function(e,n){return[n,e.map(function(e){return se(e,c[n],n,t,i)})]})),s=new Set;return u.forEach(function(e,t){e.forEach(function(e){s.add(e.size)})}),{scaleType:t,key:e,scalePitchClasses:r,scaleDegreeChords:u,scaleNotes:c,sizes:Array.from(s).sort(function(e,t){return e-t})}}var me={display:"flex"},de={flex:1},fe={textAlign:"left"},he={textAlign:"center"};var ve=function(e){var t=e.audioApi,n=r.a.useCallback(function(){return t.actx.resume()},[t]),a=r.a.useCallback(function(){return t.actx.suspend()},[t]),c=Object(u.b)("key","C",u.a.string),o=Object(i.a)(c,2),s=o[0],h=o[1],v=Object(u.b)("strumming",V[2],u.a.integer),b=Object(i.a)(v,2),y=b[0],g=b[1],E=Object(u.b)("strumMode","up",u.a.string),C=Object(i.a)(E,2),x=C[0],S=C[1],M=Object(u.b)("includeExtra",!1,u.a.boolean),P=Object(i.a)(M,2),N=P[0],K=P[1],D=Object(u.b)("oneShot",!0,u.a.boolean),A=Object(i.a)(D,2),F=A[0],U=A[1],J=r.a.useState(null),Q=Object(i.a)(J,2),_=Q[0],te=Q[1],se=Object(u.b)("octave",4,u.a.integer),ve=Object(i.a)(se,2),be=ve[0],pe=ve[1],ye=Object(u.b)("scaleType","major",u.a.string),ge=Object(i.a)(ye,2),Ee=ge[0],ke=ge[1],Oe=Object(u.b)("showScaleDegrees",!0,u.a.boolean),je=Object(i.a)(Oe,2),we=je[0],Ce=je[1],xe=Object(u.b)("scaleSteps",7,u.a.integer),Se=Object(i.a)(xe,2),Me=Se[0],Pe=Se[1],Ne=Object(u.b)("chordPaletteOctaves",1,u.a.integer),Ke=Object(i.a)(Ne,2),De=Ke[0],Ae=Ke[1],Re=r.a.useState([]),Fe=Object(i.a)(Re,2),Ie=Fe[0],Le=Fe[1],Te=r.a.useCallback(function(){return Le([])},[Le]),Be=r.a.useMemo(function(){return le(s,Ee,be)},[s,Ee,be]),ze=r.a.useState(null),Ue=Object(i.a)(ze,2),Je=Ue[0],Ge=Ue[1],He=r.a.useState(null),We=Object(i.a)(He,2),qe=We[0],Xe=We[1],Ve=r.a.useCallback(function(){return Xe(Be.scalePitchClasses)},[Be.scalePitchClasses]),Ye=r.a.useMemo(function(){return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Object(m.a)(Array(e).keys()).map(function(e){return e+t})}(De).map(function(e){return le(s,Ee,be+e)})},[s,Ee,be,De]),$e=r.a.useState([]),Qe=Object(i.a)($e,2),Ze=Qe[0],_e=Qe[1],et=r.a.useState(null),tt=Object(i.a)(et,2),nt=tt[0],at=tt[1],rt=r.a.useState(null),ct=Object(i.a)(rt,2),ot=ct[0],it=ct[1],ut=r.a.useCallback(function(e,t){it(function(n){return t?e:null})},[it]),st=r.a.useCallback(function(){_e(function(e){var n=e,a=Be.scaleNotes.slice();a.push(f.b(a[0],"8P"));var r=t.actx.currentTime,c=0;return a.forEach(function(e){n=ie(n,e,r+(c+=ae),r+c+ae)}),n})},[_e,t,Be]),lt=r.a.useCallback(function(e,n,a,r){var c=e.chordNotesForOctave;_e(function(e){var r=e,o=t.actx.currentTime,i=c.slice();return"down"===a?i.reverse():"random"===a&&Object(d.knuthShuffle)(i),i.forEach(function(e,t){var a=t*(n/1e3);r=F?ie(r,e,o+a,o+ae+t*(n/1e3)):function(e,t,n){var a=f.a(t).midi;return ue(e,[{message:[re,a,oe],time:n}])}(r,e,o+a)}),r}),"history"!==r&&"nearby"!==r&&(Le(function(t){return t.concat(e)}),te(e))},[_e,t,F]),mt=r.a.useCallback(function(e,n,a,r){if(!F){var c=e.chordNotesForOctave;_e(function(e){var n=e,a=t.actx.currentTime;return c.slice().forEach(function(e,t){var r=f.a(e).midi;n=function(e,t,n){var a=f.a(t).midi;return ue(e,[{message:[ce,a,oe],time:n}])}(n,e,a).filter(function(e){var t=Object(i.a)(e.message,2),n=t[0],a=t[1];return!(n===re&&a===r)})}),n})}},[_e,t,F]);Object(O.a)(Be,Ve),r.a.useEffect(function(){Ve()},[]);var dt=r.a.useMemo(function(){return nt?(nt.send,function(e){return nt.send(e)}):t.dx7?function(e){return t.dx7.onMidi(e)}:function(e){}},[t,nt]),ft=r.a.useMemo(function(){return{triggerAttack:function(e){dt([re,f.a(e).midi,oe])},triggerRelease:function(e){dt([ce,f.a(e).midi,oe])}}},[dt]);r.a.useEffect(function(){var e=setInterval(function(){_e(function(e){return function(e,t,n){for(var a=0;a<e.length;a++){var r=e[a];if(r.time>t.actx.currentTime)break;n(r.message)}return 0===a?e:e.slice(a)}(e,t,dt)})},1);return function(){clearInterval(e)}},[dt,t]);var ht=r.a.createElement("div",null,r.a.createElement("button",{onClick:a},"pause audio"),r.a.createElement("button",{onClick:n},"resume audio"),t.dx7&&r.a.createElement(k,{actx:t.actx,inputNode:t.dx7}),r.a.createElement(j,{type:"output",selectedPort:nt,onChange:at}),r.a.createElement("div",null,r.a.createElement(T,{label:"key",options:$,value:Be.key,onChange:h})," ",r.a.createElement(T,{label:"octave",type:"number",options:[1,2,3,4,5,6,7],value:be,onChange:pe})," ",r.a.createElement(T,{label:"scale type",options:Z,value:Ee,onChange:ke})," ",r.a.createElement("label",null,"scale notes: "),Be.scaleNotes.map(function(e){return p.c(e)}).join()," ",r.a.createElement("button",{onClick:st},"play scale")," ",r.a.createElement(z.a,{label:"show notes as scale degrees",onChange:Ce,checked:we}))),vt=r.a.createElement(H,{name:"scaleKeyboardSection",onSetSticky:ut,sticky:"scaleKeyboardSection"===ot,className:"background"},r.a.createElement(L.a,{summary:"scale keyboard",startOpen:!0},r.a.createElement(T,{label:"scale steps",options:[1,2,3,4,5,6,7],type:"number",value:Me,onChange:Pe}),r.a.createElement(R,{scalePitchClasses:Be.scalePitchClasses,highlightKeys:Je,setOctave:pe,startOctave:Math.max(0,be-1),octaves:5,notePlayer:ft,showScaleDegrees:we,scaleSteps:Me}))),bt=r.a.createElement(H,{name:"chromaticKeyboardSection",onSetSticky:ut,sticky:"chromaticKeyboardSection"===ot,className:"background"},r.a.createElement(L.a,{summary:"keyboard",startOpen:!0},r.a.createElement(w.a,{highlightKeys:Je,highlightScale:qe,startOctave:Math.max(0,be-1),octaves:5,notePlayer:ft}))),pt=r.a.createElement(H,{name:"nearbyChordsSection",onSetSticky:ut,sticky:"nearbyChordsSection"===ot,className:"background"},r.a.createElement(L.a,{summary:"nearby chords",startOpen:!0},r.a.createElement(W,{scaleData:Be,playChord:lt,endChord:mt,strumming:y,strumMode:x,showScaleDegrees:we,setHighlightedKeys:Ge,lastChord:_}))),yt=X&&r.a.createElement("div",{style:fe},r.a.createElement("details",null,r.a.createElement("summary",{style:fe},r.a.createElement("div",{style:{display:"initial"}},"history/export")),r.a.createElement("div",{style:{padding:"8px 0"}},r.a.createElement(I,{bpm:ne,history:Ie,strumming:y,beatDurationSeconds:ae}),r.a.createElement("button",{onClick:Te},"clear history")),r.a.createElement("div",{style:{width:"90vw",overflow:"auto",display:"flex"}},Ie.slice().reverse().map(function(e,t){return r.a.createElement("div",{key:t,style:{width:"".concat(1/7*100,"vw")}},r.a.createElement(G,{chordData:e,playChord:lt,endChord:mt,strumming:y,strumMode:x,showScaleDegrees:we,selected:!1,onMouseOver:Ge,source:"history"}))}),0===Ie.length&&r.a.createElement("div",null,"played chords will appear here")))),gt=r.a.createElement(L.a,{summary:"chord palette",startOpen:!0},r.a.createElement(B,{label:"strumming",min:0,max:V.length-1,value:Y[y],onChange:function(e){g(V[e])}}),r.a.createElement(T,{label:"strum mode",options:["up","down","random"],value:x,onChange:S})," ",r.a.createElement(T,{label:"octaves",type:"number",options:[1,2],value:De,onChange:Ae})," ",r.a.createElement(z.a,{label:"include extra chords",onChange:K,checked:N})," ",r.a.createElement(z.a,{label:"oneshot",onChange:U,checked:F}),r.a.createElement("div",{style:Object(l.a)({},me,he)},Ye.map(function(e,t){return r.a.createElement("div",{style:de,key:t},e.sizes.filter(function(e){return!!N||e>0}).sort(function(e,t){return q?e-t:t-e}).map(function(t,n){return r.a.createElement("div",{key:n},!1,r.a.createElement("br",null),r.a.createElement("div",{key:t,style:{display:"flex"}},Array.from(e.scaleDegreeChords).map(function(e){var a=Object(i.a)(e,2),c=a[0],o=a[1];return r.a.createElement("div",{key:c,style:{flex:1}},0===n&&r.a.createElement("div",null,ee[Ee][c]),o.filter(function(e){return e.size===t}).sort(function(e,t){return e.chordName.length-t.chordName.length}).map(function(e,t){return r.a.createElement(G,{key:t,chordData:e,playChord:lt,endChord:mt,source:"grid",strumming:y,strumMode:x,showScaleDegrees:we,selected:_&&e.chordName===_.chordName,onMouseOver:Ge})}))})))}))}))),Et=r.a.createElement(L.a,{summary:"midi events"},r.a.createElement("pre",{style:{height:300,overflow:"auto"}},Ze.map(function(e){return JSON.stringify(e)}).join("\n")));return r.a.createElement("div",{className:"App",style:fe},ht,vt,bt,pt,yt,gt,Et)},be=n(18),pe=n.n(be),ye=n(27),ge="/scaletoy",Ee=Boolean(new URL(document.location.href).searchParams.get("sampled")),ke=["rom1a.syx","rom1b.syx","rom2a.syx","rom2b.syx","rom3a.syx","rom3b.syx","rom4a.syx","rom4b.syx","eno.syx"];function Oe(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:118,n="",a=0;a<10;a++){var r=e[a+t];switch(r){case 92:r="Y";break;case 126:r=">";break;case 127:r="<";break;default:(r<32||r>127)&&(r=32)}n+=String.fromCharCode(r)}return n}function je(e,t){var n=function(e){console.error(e)},a=[ge+"/wam/wamsdk/wam-controller.js",ge+"/wam/dx7/dx7-awn.js"];AWPF.polyfill(e,a).then(function(){AWPF.isAudioWorkletPolyfilled?t(null,e):DX7.importScripts(ge,e).then(function(){var n=new DX7(e,{samplesPerBuffer:256}),a=e.createGain();n.connect(a),a.connect(e.destination),t(n,e)}).catch(n)}).catch(n)}function we(e){return Ce.apply(this,arguments)}function Ce(){return(Ce=Object(ye.a)(pe.a.mark(function e(t){var a,r;return pe.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([n.e(4),n.e(3)]).then(n.bind(null,68));case 2:return a=e.sent,r=a.sampledDX7,e.t0=l.a,e.t1={sampled:!0},e.next=8,r(t);case 8:return e.t2=e.sent,e.abrupt("return",(0,e.t0)(e.t1,e.t2));case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)}function xe(){return(xe=Object(ye.a)(pe.a.mark(function e(t){var n;return pe.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!Ee){e.next=6;break}return e.next=3,we(t);case 3:return e.abrupt("return",e.sent);case 6:return e.next=8,new Promise(function(e){return je(t,function(t,n){return e({dx7:t,actx:n})})});case 8:if((n=e.sent).dx7){e.next=15;break}return e.next=12,we(t);case 12:return e.abrupt("return",e.sent);case 15:return e.abrupt("return",n);case 16:case"end":return e.stop()}},e)}))).apply(this,arguments)}function Se(e){var t=e.audioApi,n=r.a.useState(null),c=Object(i.a)(n,2),o=c[0],u=c[1],s=Object(a.useState)(ke[0]),l=Object(i.a)(s,2),m=l[0],d=l[1],f=Object(a.useState)(null),h=Object(i.a)(f,2),v=h[0],b=h[1],p=Object(a.useState)("E.PIANO 1 "),y=Object(i.a)(p,2),g=y[0],E=y[1],k=Object(a.useRef)(!0);Object(a.useEffect)(function(){return function(){k.current=!1}},[]);var O=Object(a.useRef)();return O.current||(O.current=function(e){(function(e){var t=ge+"/wam/dx7/presets/"+e;return new Promise(function(e,n){fetch(t).then(function(t){t.arrayBuffer().then(function(t){4104!=t.byteLength&&n();var a=[];t=(t=new Uint8Array(t)).subarray(6,4102);for(var r=0;r<32;r++){var c=128*r,o=t.subarray(c,c+128),i=Oe(o);a.push({name:i,voice:o})}e(a)})})})})(e).then(function(e){k.current&&(b(e),e.find(function(e){return e.name===g})||E(e[0].name))})}),Object(a.useEffect)(function(){O.current(m)},[m]),Object(a.useEffect)(function(){if(null!=o)return o.onmidimessage=function(e){t&&t.dx7.onMidi(e.data)},function(){o.onmidimessage=null}},[o,t]),Object(a.useEffect)(function(){k.current&&O.current(ke[0])},[t]),Object(a.useEffect)(function(){if(g&&v){var e=v.find(function(e){return e.name===g})||v[0];e&&t&&t.dx7.setPatch&&t.dx7.setPatch(e.voice)}},[g,v,t]),t.sampled?null:r.a.createElement("div",{className:"dx7"},r.a.createElement("details",{open:!0},r.a.createElement("summary",null,"synthesizer"),r.a.createElement("div",{id:"content"},r.a.createElement("div",{id:"topbar"},r.a.createElement("div",null,"webDX7"),r.a.createElement("div",{className:"right"},r.a.createElement("div",{className:"control"},r.a.createElement(T,{label:"bank",options:ke,value:m,onChange:function(e){return d(e)}})),r.a.createElement("div",{className:"control"},r.a.createElement(T,{label:"patch",options:v?v.map(function(e){return e.name}):[],value:g,onChange:function(e){return E(e)}})),r.a.createElement("div",{className:"control"},r.a.createElement(j,{type:"input",selectedPort:o,onChange:u})))))))}function Me(e){if(null==e)throw new Error("unexpected null");return e}function Pe(){var e=Object(s.a)("darkMode",!1),t=Object(i.a)(e,2),n=t[0],a=t[1];return r.a.useEffect(function(){n?Me(document.documentElement).classList.add("dark-mode"):Me(document.documentElement).classList.remove("dark-mode")},[n]),r.a.createElement("div",{style:{position:"absolute",top:0,right:0}},r.a.createElement("label",null,"dark mode:"," ",r.a.createElement("input",{type:"checkbox",checked:n,onChange:function(){return a(function(e){return!e})}})))}var Ne=new AudioContext;var Ke=function(){var e=r.a.useState(!1),t=Object(i.a)(e,2),a=t[0],c=t[1],o=r.a.useState(null),s=Object(i.a)(o,2),l=s[0],m=s[1],d=r.a.useCallback(function(){Me(document.querySelector(".intro")).style.display="none",c(!0)},[c]);r.a.useEffect(function(){(function(e){return xe.apply(this,arguments)})(Ne).then(function(e){m(e),"running"===e.actx.state&&d()})},[d]);var f=r.a.createElement(Se,{audioApi:l}),h=function(){var e=Object(u.b)("route","chordpalette",u.a.string);switch(Object(i.a)(e,1)[0]){case"exploder":return r.a.lazy(function(){return n.e(5).then(n.bind(null,69))});case"chordpalette":default:return ve}}();return l&&a?r.a.createElement(r.a.Fragment,null,f,r.a.createElement(r.a.Suspense,{fallback:r.a.createElement("div",null,"loading...")},r.a.createElement("div",null,r.a.createElement(h,{audioApi:l}),r.a.createElement(Pe,null)))):r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"App"},l?r.a.createElement("button",{style:{fontSize:42,borderRadius:9,cursor:"pointer"},onClick:function(){l.actx.resume(),d()}},"start"):"loading..."))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Ke,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},6:function(e,t,n){"use strict";n.d(t,"a",function(){return c}),n.d(t,"b",function(){return o});var a=n(2),r=n(0),c={boolean:{parse:function(e){return!(null==e||"false"===e)},stringify:function(e){return JSON.stringify(e)}},integer:{parse:function(e){var t=parseInt(e,10);if(Number.isNaN(t))throw new Error("invalid int when parsing: "+e);return t},stringify:function(e){return e.toString()}},string:{parse:function(e){return e},stringify:function(e){return e}}};function o(e,t,n){var c=Object(r.useState)(function(){try{var a=new URL(window.location.href).searchParams.get(e);return null!=a?n.parse(a):t}catch(r){return console.log(r),t}}),o=Object(a.a)(c,2),i=o[0],u=o[1];return[i,function(t){try{var a="function"===typeof t?t(i):t;u(a);var r=new URL(window.location.href);r.searchParams.set(e,n.stringify(a)),window.history.replaceState(null,null,r.toString())}catch(c){console.log(c)}}]}},8:function(e,t,n){"use strict";t.a={container:{textAlign:"center"},keyboard:{display:"inline-block",position:"relative",height:70,marginTop:16,marginBottom:20,cursor:"pointer"},whiteKey:{position:"absolute",borderBottomLeftRadius:4,borderBottomRightRadius:4,width:20,height:70,background:"white",border:"solid 1px black",zIndex:0},noteLabel:{width:20,marginTop:70},highlighted:{background:"orange"},blackKey:{position:"absolute",borderBottomLeftRadius:3,borderBottomRightRadius:3,width:9,height:50,background:"#000",border:"solid 1px black",zIndex:1},pressed:{background:"#7f4af9"}}}},[[41,1,2]]]);
//# sourceMappingURL=main.0b115c23.chunk.js.map