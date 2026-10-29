// 町の配置チェック（手元で実行: node scripts/check-town-layout.mjs [RX RZ RCZ]）
// diorama.js の建物・小さな木・人形・ランニングコース（楕円）・ボールの通り道が重ならないかを数値で確かめる。
// 建物や木を動かしたら、ここの B / T も同じ値に直してから実行する。何も出なければ衝突なし。
const B = [[-17,-20,14,7,9,'研究棟'],[18,-19,11,5,8,'講義棟'],[20,15,8,4,7,'食堂'],[-21,8,6,3,6,'売店'],[-21,17,6,4,6,'小建物'],[-6,-21,6,9,6,'ピンク高'],[6,-21,6,6,5,'ミント中'],[25,-3,5,5,5,'黄'],[-24,-4,4,6,5,'水色細'],[-6,14,6,5,5,'白手前'],[-28,-26,8,5,7,'外ピンク'],[27,-22,7,8,6,'外水色高'],[29,8,6,4,6,'外黄'],[-30,-14,7,6,6,'外ミント'],[-10,-28,10,4,7,'外白長'],[29.5,29.5,5,5,5,'外ピンク手前右'],[20,-27,5,14,5,'高水色奥'],[-27,6,5,12,5,'高ピンク左'],[27,17,4,16,4,'塔'],[-26.5,29,10,5,0.6,'看板(Welcome)']];
const T = [[-14,-9],[11,-25],[-19,-1],[24,4],[13,17],[2,23],[-12,23],[-20,-28],[0,-27],[31,-13],[-29,12],[31,-30],[14,-29],[6,-28]];
const inRect=(px,pz,[x,z,w,h,d],m)=>px>x-w/2-m&&px<x+w/2+m&&pz>z-d/2-m&&pz<z+d/2+m;
const [RX,RZ,RCZ]=[process.argv[2]??40,process.argv[3]??24,process.argv[4]??6].map(Number); console.log("course",RX,RZ,RCZ);
const hits=new Set(), thits=new Set();
for(let a=0;a<Math.PI*2;a+=0.01){const px=Math.cos(a)*RX,pz=RCZ+Math.sin(a)*RZ;
 B.forEach(b=>{if(inRect(px,pz,b,1.5))hits.add(b[5]+` (${b[0]},${b[1]})`)});
 T.forEach(t=>{if(Math.hypot(px-t[0],pz-t[1])<3.5)thits.add(`tree(${t})`)});
 // devices
 if(inRect(px,pz,[12,-7,3,6,7],1.5))hits.add('顕微鏡');
 if(inRect(px,pz,[-12,10,5,6,1],1.5))hits.add('看板'); if(inRect(px,pz,[14,11.5,3,4,2],1.5))hits.add('郵便受け');
 if(Math.hypot(px,pz)<5)hits.add('大木の幹');
}
console.log('runner hits buildings:',[...hits]); console.log('runner hits trees:',[...thits]);
const F={catchA:[8,22],catchB:[41,22],batter:[9,2],backpain:[-17,35.5]};
for(const[k,[fx,fz]]of Object.entries(F)){const bh=B.filter(b=>inRect(fx,fz,b,1.2)).map(b=>b[5]);const th=T.filter(t=>Math.hypot(fx-t[0],fz-t[1])<3).map(t=>`tree(${t})`);console.log(k,bh,th);}
// ball path z=22, x 8..41, y = 3.8..10.8
const ballHits=B.filter(b=>b[1]-b[4]/2-0.5<22&&b[1]+b[4]/2+0.5>22&&b[0]+b[2]/2>8&&b[0]-b[2]/2<41).map(b=>{const u=(b[0]-8)/33;const y=0.3+3.5+Math.sin(Math.max(0,Math.min(1,u))*Math.PI)*7;return `${b[5]} h=${b[3]} ballY≈${y.toFixed(1)}`});
console.log('ball path:',ballHits, T.filter(t=>Math.abs(t[1]-22)<2.5&&t[0]>6&&t[0]<42));

for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],b=B[j];if(Math.abs(a[0]-b[0])<(a[2]+b[2])/2&&Math.abs(a[1]-b[1])<(a[4]+b[4])/2)console.log('BLDG OVERLAP',a[5],b[5]);}
T.forEach(t=>B.forEach(b=>{if(inRect(t[0],t[1],b,0.5))console.log('TREE IN BLDG',t,b[5]);}));
T.forEach(t=>{if(Math.abs(t[0])>32||Math.abs(t[1])>32)console.log('TREE OFF PLATE',t);});
