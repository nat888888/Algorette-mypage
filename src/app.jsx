import React, { useState, useEffect, useRef } from 'react';

// SASSの記法を<style>タグ内で使用
const SASS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Yusei+Magic&family=Noto+Sans+JP:wght@400;500;700&display=swap');

:root {
  --primary-color: #87CEEB; /* SkyBlue */
  --secondary-color: #FFC0CB; /* Pink */
  --accent-color: #f1c40f; /* Yellow */
  --text-color: #fff;
  --text-dark: #333;
  --lock-bg: #2c3e50;
  --content-bg: rgba(255, 255, 255, 0.95);
  --chain-color: #7f8c8d;
}

body, html, #root {
  margin: 0; padding: 0; width: 100%; height: 100%;
  overflow: hidden;
  font-family: 'Noto Sans JP', sans-serif;
  background: #000;
}
.app-container { width: 100%; height: 100%; position: relative; }

/* --- Lock Screen --- */
.lock-screen {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: var(--lock-bg);
  display: flex; justify-content: center; align-items: center;
  z-index: 100;
  transition: opacity 1s ease-out 0.8s, visibility 1s 0.8s; color: white;
  overflow: hidden;

  &.unlocking {
    .chain.left { transform: translateX(-100%) !important; }
    .chain.right { transform: translateX(100%) !important; }
    .lock { animation: glow 0.8s ease-in-out 0.5s forwards; }
    .lock-shackle { transform: translateY(-30px) rotate(45deg); transition-delay: 0.5s; }
    .key-input-container { animation: insert-key 0.5s forwards ease-in; }
  }
  
  .chain {
    position: absolute; top: 50%; transform: translateY(-50%); height: 20px;
    background: var(--chain-color);
    width: 55%;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
    transition: transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    &.left { left: 0; transform: translateX(-100%); border-radius: 0 10px 10px 0;}
    &.right { right: 0; transform: translateX(100%); border-radius: 10px 0 0 10px;}
    &.animate {
        transform: translateY(-50%) translateX(0);
    }
  }

  .lock-container { position: relative; z-index: 10; text-align: center; }
  .lock { width: 100px; height: 80px; background: #bdc3c7; border-radius: 10px; position: relative; margin: 0 auto; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    .lock-shackle { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; border: 10px solid #95a5a6; border-bottom-color: transparent; border-radius: 50px 50px 0 0; transition: transform 0.5s ease-out; }
    .keyhole { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 15px; height: 15px; background: var(--lock-bg); border-radius: 50%;
        &::after { content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 5px; height: 15px; background: var(--lock-bg); }
    }
  }
  @keyframes glow { from { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px var(--accent-color); } to { box-shadow: 0 0 50px #fff, 0 0 60px var(--accent-color), 0 0 70px var(--accent-color); } }
  .key-input-container { margin-top: 3rem; transition: opacity 0.3s;
    .key-top { width: 80px; height: 80px; border: 3px solid var(--accent-color); border-radius: 50%; margin: 0 auto; display: flex; justify-content: center; align-items: center; }
    .key-body { width: 12px; height: 40px; background: var(--accent-color); margin: -2px auto 0; }
    input { font-size: 1.2rem; padding: 0.8rem 1rem; border: 2px solid var(--accent-color); border-radius: 8px; background: transparent; color: white; outline: none; width: 280px; text-align: center; margin-top: 1.5rem; letter-spacing: 5px; }
    button { display: none; }
  }
  @keyframes insert-key { to { transform: translateY(-110px); opacity: 0; } }
  .error-message { color: var(--secondary-color); margin-top: 1rem; height: 20px; font-weight: bold; }
}

/* --- Main Site --- */
.main-site { 
    width: 100%; height: 100%; position: relative; 
    overflow-y: auto; overflow-x: hidden; 
}

.sky-section {
    width: 100%;
    min-height: 100vh;
    padding-bottom: 20vh; /* Ground section overlaps this space */
    position: relative;
    background: linear-gradient(to top, #a1c4fd 0%, #c2e9fb 100%);
}

.ground-section {
    background: #D1FFC3;
    position: relative;
    width: 100%;
    .city-skyline {
        width: 100%;
        line-height: 0;
        svg { 
            width: 100%; height: auto; 
            path { fill: #86C166; }
            .building { cursor: pointer; transition: fill 0.3s; }
            .building:hover { fill: var(--secondary-color); }
        }
    }
}

.bubble-nav-page { width: 100%; height: 100%; position: absolute; top:0; left:0; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s; &.zoomed-in { transform: scale(5); opacity: 0; pointer-events: none; } }
.bubble { position: absolute; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center; box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3); transition: transform 0.5s ease, box-shadow 0.5s ease; overflow: hidden; &::before { content: ''; position: absolute; top: 5%; left: 15%; width: 30%; height: 30%; border-radius: 50%; background: rgba(255,255,255,0.4); filter: blur(5px); } &:hover { transform: scale(1.1); } .bubble-icon-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 1; svg { width: 55%; height: 55%; color: rgba(255, 255, 255, 0.3); opacity: 0.9; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1)); } } .bubble-label { position: relative; z-index: 2; font-family: 'Yusei Magic', sans-serif; color: white; font-size: 1.5rem; text-shadow: 0 2px 5px rgba(0,0,0,0.5); } }
.title-bubble .bubble-label { font-size: 1.8rem; }
.social-bubble { background-color: rgba(255, 255, 255, 0.3); backdrop-filter: blur(5px); svg { width: 50%; height: 50%; color: white; } }
@keyframes float1 { 0% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-20px) translateX(10px); } 100% { transform: translateY(0px) translateX(0px); } }
@keyframes float2 { 0% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(15px) translateX(-15px); } 100% { transform: translateY(0px) translateX(0px); } }
@keyframes float3 { 0% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-10px) translateX(-20px); } 100% { transform: translateY(0px) translateX(0px); } }

/* --- Content Page --- */
.content-page-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; visibility: hidden; transform: scale(0.5); z-index: 50; transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s, visibility 0.8s; &.visible { opacity: 1; visibility: visible; transform: scale(1); } }
.page-wrapper { width: 100%; height: 100%; background: var(--content-bg); backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: center; align-items: center; color: var(--text-dark); padding: 2rem; box-sizing: border-box; overflow-y: auto; }
.back-button { position: fixed; top: 2rem; left: 2rem; z-index: 60; font-size: 1.2rem; font-weight: bold; padding: 1rem 2rem; border: none; border-radius: 50px; background: rgba(255,255,255,0.7); color: #333; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; &:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.15); } }
.page-title { font-family: 'Yusei Magic', sans-serif; font-size: 3rem; color: var(--primary-color); text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }

/* --- Music Page --- */
.playlist { list-style: none; padding: 0; width: 100%; max-width: 500px; .track { display: flex; align-items: center; gap: 1rem; padding: 0.8rem; border-radius: 8px; transition: background 0.3s; &:hover { background: rgba(0,0,0,0.05); } img { width: 50px; height: 50px; border-radius: 4px; } .track-info { flex-grow: 1; } .track-title { font-weight: bold; } .track-artist { font-size: 0.9rem; color: #666; } } }

/* --- Scheduling Page --- */
.scheduler { display: flex; gap: 2rem; width: 100%; max-width: 800px; flex-wrap: wrap; justify-content: center; .calendar { flex-basis: 50%; min-width: 300px; } .time-slots { flex-basis: 40%; min-width: 300px; } .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; .day { padding: 0.8rem 0; text-align: center; border-radius: 50%; cursor: pointer; transition: background 0.3s, color 0.3s; &.unavailable { color: #ccc; cursor: not-allowed; } &.available { background: #e0f7fa; } &.selected { background: var(--primary-color); color: white; font-weight: bold; } } .day-name { font-weight: bold; font-size: 0.8rem; color: #999; text-align: center; } } .slot-list { display: flex; flex-direction: column; gap: 0.5rem; .slot { padding: 0.8rem; border-radius: 8px; text-align: center; cursor: pointer; font-weight: 500; &.available { background: #e8f5e9; } &.requested { background: #fff9c4; color: #f57f17; } &.confirmed { background: var(--secondary-color); color: white; } } } }

/* --- Modal --- */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 200; .modal-content { background: white; padding: 2rem; border-radius: 12px; max-width: 400px; text-align: center; h2 { margin-top: 0; } .modal-buttons { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; } } }
`;

// --- アイコン ---
const GitHubIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> );
const InstagramIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> );
const MusicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> );
const DanceIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 12v8"></path><path d="m14.5 9.5-3 3-3-3"></path></svg> );
const TravelIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h17l-4-4"></path><path d="m22 12-4 4"></path><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10-10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z"></path></svg> );
const CodeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> );
const ScheduleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> );

// --- データ定義 ---
const SECRET_PASSWORD = "yume";
const bubblesData = [
  { id: 'title', label: "Natsuha's Web page", size: 280, top: '18vh', left: '50%', transform: 'translateX(-50%)', isMain: true, animation: 'float1 12s infinite ease-in-out', customClass: 'title-bubble' },
  { id: 'github', type: 'social', size: 80, top: '15vh', left: 'calc(50% - 200px)', animation: 'float3 8s infinite ease-in-out', href: 'https://github.com' },
  { id: 'instagram', type: 'social', size: 80, top: '15vh', left: 'calc(50% + 200px)', animation: 'float3 9s infinite ease-in-out', href: 'https://instagram.com' },
  { id: 'music', label: '音楽', size: 170, top: '45vh', left: '15%', animation: 'float2 10s infinite ease-in-out', icon: <MusicIcon /> },
  { id: 'dance', label: 'ダンス', size: 190, top: '55vh', left: '80%', animation: 'float1 9s infinite ease-in-out', icon: <DanceIcon /> },
  { id: 'travel', label: '旅行', size: 180, top: '70vh', left: '25%', animation: 'float2 11s infinite ease-in-out', icon: <TravelIcon /> },
  { id: 'code', label: '開発', size: 160, top: '35vh', left: '70%', animation: 'float1 7s infinite ease-in-out', icon: <CodeIcon /> },
  { id: 'schedule', label: '日程調整', size: 170, top: '75vh', left: '60%', animation: 'float2 12s infinite ease-in-out', icon: <ScheduleIcon /> },
];
const pagesData = { music: { title: 'My Playlist', content: [ { title: '夜に駆ける', artist: 'YOASOBI', img: 'https://placehold.co/100x100/345/fff?text=YO' }, { title: 'Lemon', artist: '米津玄師', img: 'https://placehold.co/100x100/534/fff?text=LE' }, { title: 'Shape of You', artist: 'Ed Sheeran', img: 'https://placehold.co/100x100/453/fff?text=ED' }, ] }, dance: { title: 'ダンス', content: '体を動かすことが好きで、時々友人と一緒にダンスを楽しんでいます。表現する楽しさは何にも代えがたいです。' }, travel: { title: '旅行', content: '知らない場所へ行き、新しい文化や景色に触れるのが最高の趣味です。次の目的地を考えるだけでワクワクします。' }, code: { title: '開発', content: 'アイデアを形にするプログラミングは、私にとって創造的な活動の一つです。このサイトもReactで楽しく作りました。' }, schedule: { title: '日程調整', content: '以下のカレンダーからご希望の日時を選択し、予約リクエストを送信してください。' }, };

// --- コンポーネント ---
const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setIsAnimating(true), 100); return () => clearTimeout(timer); }, []);
  const handleSubmit = (e) => { e.preventDefault(); if (password === SECRET_PASSWORD) { setError(''); setIsClosing(true); setTimeout(onUnlock, 2000); } else { setError('合言葉が違うようです'); } };
  return ( <div className={`lock-screen ${isClosing ? 'unlocking' : ''}`}> <div className={`chain left ${isAnimating ? 'animate' : ''}`}></div> <div className={`chain right ${isAnimating ? 'animate' : ''}`}></div> <div className="lock-container"> <div className="lock"> <div className="lock-shackle"></div> <div className="lock-body"> <div className="keyhole"></div> </div> </div> <div className="key-input-container"> <div className="key-top"> <div style={{width: '20px', height: '20px', background: 'var(--lock-bg)', borderRadius: '50%'}}></div> </div> <div className="key-body"></div> <form onSubmit={handleSubmit}> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="合言葉" autoFocus /> <button type="submit">Unlock</button> </form> <div className="error-message">{error}</div> </div> </div> </div> );
};

const Bubble = ({ data, onClick }) => {
    const classNames = `bubble ${data.type === 'social' ? 'social-bubble' : ''} ${data.customClass || ''}`;
    const content = ( <div className={classNames} style={{ width: `${data.size}px`, height: `${data.size}px`, top: data.top, left: data.left, transform: data.transform, animation: data.animation }} onClick={() => !data.isMain && !data.href && onClick(data.id)}> {data.icon && <div className="bubble-icon-bg">{data.icon}</div>} {data.label && <span className="bubble-label">{data.label}</span>} {data.id === 'github' && <GitHubIcon />} {data.id === 'instagram' && <InstagramIcon />} </div> );
    return data.href ? <a href={data.href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
};

const PageRenderer = ({ pageId, onBack }) => {
  if (!pageId) return null;
  const pageData = pagesData[pageId];
  let PageComponent;
  switch (pageId) {
    case 'music': PageComponent = MusicPage; break;
    case 'schedule': PageComponent = SchedulingPage; break;
    default: PageComponent = GenericPage;
  }
  return ( <div className={`content-page-container ${pageId ? 'visible' : ''}`}> <button className="back-button" onClick={onBack}>戻る</button> <PageComponent data={pageData} /> </div> );
}

const MusicPage = ({ data }) => ( <div className="page-wrapper"> <h1 className="page-title">{data.title}</h1> <ul className="playlist"> {data.content.map(track => ( <li key={track.title} className="track"> <img src={track.img} alt={track.title} /> <div className="track-info"> <div className="track-title">{track.title}</div> <div className="track-artist">{track.artist}</div> </div> </li> ))} </ul> </div> );
const SchedulingPage = ({ data }) => { const [appointments, setAppointments] = useState({ '25': { '10:00': 'available', '11:00': 'available', '14:00': 'confirmed' }, '27': { '13:00': 'available', '15:00': 'requested' }, }); const [selectedDate, setSelectedDate] = useState(null); const [modalInfo, setModalInfo] = useState(null); const handleSlotClick = (date, time, status) => { if (status === 'available') { setModalInfo({ type: 'request', date, time, msg: `【${date}日 ${time}】で予約をリクエストしますか？` }); } else if (status === 'requested') { setModalInfo({ type: 'approve', date, time, msg: `【${date}日 ${time}】の予約を承認しますか？` }); } }; const handleRequest = (date, time) => { setAppointments(prev => ({ ...prev, [date]: { ...prev[date], [time]: 'requested' } })); setModalInfo({ type: 'info', msg: '予約リクエストを送信しました。' }); }; const handleApproval = (date, time) => { setAppointments(prev => ({ ...prev, [date]: { ...prev[date], [time]: 'confirmed' } })); setModalInfo({ type: 'info', msg: '予約を承認しました。' }); }; const calendarDays = Array.from({ length: 7 }, (_, i) => 24 + i); return ( <div className="page-wrapper"> <h1 className="page-title">{data.title}</h1> <p style={{maxWidth: '600px', textAlign: 'center'}}>{data.content}</p> <div className="scheduler"> <div className="calendar"> <h3>日付を選択</h3> <div className="calendar-grid"> {['日', '月', '火', '水', '木', '金', '土'].map(d=><div key={d} className="day-name">{d}</div>)} {calendarDays.map(day => { const hasSlots = !!appointments[day]; return <div key={day} onClick={() => hasSlots && setSelectedDate(day)} className={`day ${!hasSlots ? 'unavailable' : ''} ${hasSlots ? 'available' : ''} ${selectedDate === day ? 'selected' : ''}`}>{day}</div>; })} </div> </div> <div className="time-slots"> <h3>時間を選択</h3> {selectedDate && appointments[selectedDate] ? ( <div className="slot-list"> {Object.entries(appointments[selectedDate]).map(([time, status]) => ( <div key={time} onClick={() => handleSlotClick(selectedDate, time, status)} className={`slot ${status}`}>{time} - {status}</div> ))} </div> ) : <p>日付を選択してください。</p>} </div> </div> {modalInfo && ( <div className="modal-overlay"> <div className="modal-content"> <h2>確認</h2> <p>{modalInfo.msg}</p> <div className="modal-buttons"> {modalInfo.type === 'request' && <button onClick={() => handleRequest(modalInfo.date, modalInfo.time)}>リクエスト</button>} {modalInfo.type === 'approve' && <button onClick={() => handleApproval(modalInfo.date, modalInfo.time)}>承認</button>} <button onClick={() => setModalInfo(null)}>閉じる</button> </div> </div> </div> )} </div> ); };
const GenericPage = ({ data }) => ( <div className="page-wrapper"> <h1 className="page-title">{data.title}</h1> <p>{data.content}</p> </div> );

const CityScape = ({ onBuildingClick }) => (
    <div className="city-skyline">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,245.3C840,267,960,277,1080,261.3C1200,245,1320,203,1380,181.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            {/* Buildings */}
            <rect className="building" onClick={() => onBuildingClick('music')} x="150" y="150" width="80" height="170" fill="#34495e" />
            <rect className="building" onClick={() => onBuildingClick('code')} x="300" y="120" width="120" height="200" fill="#2c3e50" />
            <rect className="building" onClick={() => onBuildingClick('travel')} x="550" y="180" width="90" height="140" fill="#34495e" />
            <rect className="building" onClick={() => onBuildingClick('dance')} x="700" y="80" width="150" height="240" fill="#2c3e50" />
            <rect className="building" onClick={() => onBuildingClick('schedule')} x="950" y="160" width="100" height="160" fill="#34495e" />
        </svg>
    </div>
);


// --- App ---
export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = SASS_STYLES;
    document.head.appendChild(styleElement);
    return () => { document.head.removeChild(styleElement); };
  }, []);

  const handleUnlock = () => { setIsUnlocked(true); };
  const handleShowPage = (pageId) => { setIsZoomed(true); setTimeout(() => { setActivePage(pageId); }, 800); };
  const handleBack = () => { setActivePage(null); setIsZoomed(false); };
  
  return (
    <div className="app-container">
      {!isUnlocked && <LockScreen onUnlock={handleUnlock} />}
      
      <div className="main-site" style={{opacity: isUnlocked ? 1 : 0, transition: 'opacity 0.5s'}}>
          <div className="sky-section">
            <div className={`bubble-nav-page ${isZoomed ? 'zoomed-in' : ''}`}>
                {bubblesData.map(data => <Bubble key={data.id} data={data} onClick={handleShowPage} />)}
            </div>
          </div>

          <div className="ground-section">
              <CityScape onBuildingClick={handleShowPage} />
          </div>

          <PageRenderer pageId={activePage} onBack={handleBack} />
      </div>
    </div>
  );
}
