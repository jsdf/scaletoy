(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{57:function(e,n,t){e.exports=t.p+"static/media/dexed-epiano-C2.27b8774e.m4a"},58:function(e,n,t){e.exports=t.p+"static/media/dexed-epiano-Ds2.afd18e11.m4a"},59:function(e,n,t){e.exports=t.p+"static/media/dexed-epiano-Fs2.bef162da.m4a"},60:function(e,n,t){e.exports=t.p+"static/media/dexed-epiano-A2.31b946a6.m4a"},62:function(e,n,t){"use strict";t.r(n),t.d(n,"sampledDX7",function(){return u});var a=t(20),c=t.n(a),i=t(24),r=t(1),o=t(53),s=(t(61),t(54));function u(){return p.apply(this,arguments)}function p(){return(p=Object(i.a)(c.a.mark(function e(){var n,a;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise(function(e){o.a.getContext(e)});case 2:return n=e.sent,e.next=5,new Promise(function(e){var n=new o.a.Sampler({C3:t(57),"D#3":t(58),"F#3":t(59),A3:t(60)},function(){console.log("samples loaded")}).toMaster();e({connect:function(e){n.connect(e)},disconnect:function(e){n.disconnect(e)},onMidi:function(e){var t=Object(r.a)(e,3),a=t[0],c=t[1],i=t[2];switch(a){case 144:n.triggerAttack(new s.a(c,"midi"),o.a.context.currentTime,i/127);break;case 128:n.triggerRelease(new s.a(c,"midi"),o.a.context.currentTime,i/127)}}})});case 5:return a=e.sent,e.abrupt("return",{actx:n,dx7:a});case 7:case"end":return e.stop()}},e)}))).apply(this,arguments)}}}]);
//# sourceMappingURL=3.cb11a6aa.chunk.js.map