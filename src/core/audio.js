export function uiTone(kind='tap') {
  const Context=window.AudioContext||window.webkitAudioContext;
  if(!Context) return;
  const ctx=uiTone.context??=new Context();
  if(ctx.state==='suspended') ctx.resume();
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  const now=ctx.currentTime;
  osc.type='sine';osc.frequency.setValueAtTime(kind==='danger'?180:520,now);
  osc.frequency.exponentialRampToValueAtTime(kind==='danger'?90:780,now+0.09);
  gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(0.045,now+0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+0.14);
  osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+0.15);
}
