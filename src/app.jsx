import React, { useState, useEffect, useRef } from 'react';

// SASSの記法を<style>タグ内で使用
const SASS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Yusei+Magic&family=Noto+Sans+JP:wght@400;500&display=swap');

:root {
  --primary-color: #87CEEB; /* SkyBlue */
  --secondary-color: #FFC0CB; /* Pink */
  --text-color: #fff;
  --lock-bg: #2c3e50;
  --key-color: #f1c40f;
}

body, html, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Noto Sans JP', sans-serif;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* --- Lock Screen --- */
.lock-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--lock-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  transition: opacity 1s ease-out, visibility 1s;
  color: white;

  &.unlocked {
    opacity: 0;
    visibility: hidden;
  }

  .lock-icon {
    font-size: 5rem;
    color: var(--key-color);
    margin-bottom: 2rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  h1 {
    font-family: 'Yusei Magic', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    letter-spacing: 2px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
  }
  
  .password-form {
    display: flex;
    gap: 1rem;
    align-items: center;

    input {
      font-size: 1.2rem;
      padding: 0.8rem 1rem;
      border: 2px solid var(--key-color);
      border-radius: 8px;
      background: transparent;
      color: white;
      outline: none;
      width: 250px;
      text-align: center;
      letter-spacing: 3px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    button {
      font-size: 1.2rem;
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: var(--key-color);
      color: var(--lock-bg);
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .error-message {
    color: var(--secondary-color);
    margin-top: 1rem;
    height: 20px;
  }
}

/* --- Main Site --- */
.main-site {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #a1c4fd 0%, #c2e9fb 100%);
  position: relative;
  overflow: hidden;
}

/* --- Bubble Navigation --- */
.bubble-nav-page {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s;
  
  &.zoomed-in {
    transform: scale(5);
    opacity: 0;
    pointer-events: none;
  }
}

.bubble {
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 5%;
    left: 15%;
    width: 30%;
    height: 30%;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    filter: blur(5px);
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: inset 0 0 30px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6);
  }

  .bubble-label {
    font-family: 'Yusei Magic', sans-serif;
    color: white;
    font-size: 1.5rem;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
  }
}

@keyframes float1 {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
}
@keyframes float2 {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(15px) translateX(-15px); }
  100% { transform: translateY(0px) translateX(0px); }
}

/* --- Content Page --- */
.content-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card-background, white);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.5);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s, visibility 0.8s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  padding: 2rem;
  box-sizing: border-box;

  &.visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }

  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    font-size: 1.2rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: #eee;
    color: #333;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
      background: #ddd;
    }
  }

  h1 {
    font-family: 'Yusei Magic', sans-serif;
    font-size: 4rem;
    color: var(--primary-color);
  }
  p {
    font-size: 1.2rem;
    max-width: 600px;
    text-align: center;
    line-height: 1.8;
  }
}
`;

// --- データ定義 ---
const SECRET_PASSWORD = "haha"; // 合言葉

const bubblesData = [
  { id: 'me', size: 250, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'float1 8s infinite ease-in-out', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop', isMain: true },
  { id: 'music', label: '音楽', size: 150, top: '20%', left: '25%', animation: 'float2 10s infinite ease-in-out' },
  { id: 'dance', label: 'ダンス', size: 180, top: '30%', left: '70%', animation: 'float1 9s infinite ease-in-out' },
  { id: 'travel', label: '旅行', size: 160, top: '65%', left: '15%', animation: 'float2 11s infinite ease-in-out' },
  { id: 'code', label: '開発', size: 170, top: '70%', left: '60%', animation: 'float1 7s infinite ease-in-out' },
];

const pagesData = {
  music: { title: '音楽', content: '様々なジャンルの音楽を聴くのが好きです。特に心が落ち着くクラシックや、気分が上がるポップスをよく聴きます。' },
  dance: { title: 'ダンス', content: '体を動かすことが好きで、時々友人と一緒にダンスを楽しんでいます。表現する楽しさは何にも代えがたいです。' },
  travel: { title: '旅行', content: '知らない場所へ行き、新しい文化や景色に触れるのが最高の趣味です。次の目的地を考えるだけでワクワクします。' },
  code: { title: '開発', content: 'アイデアを形にするプログラミングは、私にとって創造的な活動の一つです。このサイトもReactで楽しく作りました。' },
};

// --- アイコン ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// --- コンポーネント ---

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setError('');
      onUnlock();
    } else {
      setError('合言葉が違うようです');
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-icon"><LockIcon /></div>
      <h1>扉を開けて</h1>
      <p>合言葉を入力してください</p>
      <form onSubmit={handleSubmit} className="password-form">
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="・・・・"
        />
        <button type="submit">開く</button>
      </form>
      <div className="error-message">{error}</div>
    </div>
  );
};

const Bubble = ({ data, onClick }) => (
  <div 
    className="bubble"
    style={{
      width: `${data.size}px`,
      height: `${data.size}px`,
      top: data.top,
      left: data.left,
      transform: data.transform,
      animation: data.animation,
      backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none',
      border: data.imageUrl ? '5px solid rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.7)',
    }}
    onClick={() => !data.isMain && onClick(data.id)}
  >
    {data.label && <span className="bubble-label">{data.label}</span>}
  </div>
);

const ContentPage = ({ pageId, onBack }) => {
  const pageData = pagesData[pageId];
  if (!pageData) return null;

  return (
    <div className={`content-page ${pageId ? 'visible' : ''}`}>
      <button className="back-button" onClick={onBack}>戻る</button>
      <h1>{pageData.title}</h1>
      <p>{pageData.content}</p>
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activePage, setActivePage] = useState(null); // 'music', 'dance', etc.
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = SASS_STYLES;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleUnlock = () => {
    // CSSアニメーションのためにクラスを適用
    const lockScreen = document.querySelector('.lock-screen');
    if(lockScreen) {
        lockScreen.classList.add('unlocked');
    }
    // 少し遅れてstateを更新し、DOMから要素を消す
    setTimeout(() => {
      setIsUnlocked(true);
    }, 1000);
  };

  const handleBubbleClick = (pageId) => {
    setIsZoomed(true);
    setTimeout(() => {
      setActivePage(pageId);
    }, 800);
  };

  const handleBack = () => {
    setActivePage(null);
    setTimeout(() => {
      setIsZoomed(false);
    }, 100);
  };

  return (
    <div className="app-container">
      {!isUnlocked && <LockScreen onUnlock={handleUnlock} />}
      
      {isUnlocked && (
        <div className="main-site">
          <div className={`bubble-nav-page ${isZoomed ? 'zoomed-in' : ''}`}>
            {bubblesData.map(data => (
              <Bubble key={data.id} data={data} onClick={handleBubbleClick} />
            ))}
          </div>
          <ContentPage pageId={activePage} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}

