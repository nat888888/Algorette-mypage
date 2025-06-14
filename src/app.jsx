import './index.css';
import React, { useEffect, useState } from 'react';


function App() {
  // Lightbox（動画ポップアップ）の状態を管理
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');

  // YouTube動画のポップアップを開く関数
  const openLightbox = (youtubeId) => {
    setYoutubeVideoId(youtubeId);
    setLightboxOpen(true);
  };

  // YouTube動画のポップアップを閉じる関数
  const closeLightbox = () => {
    setYoutubeVideoId('');
    setLightboxOpen(false);
  };

  // コンポーネントが画面に表示された後にアニメーションを実行
  useEffect(() => {
    const initAnimations = () => {
      // windowオブジェクトからgsapが利用可能かチェック
      if (window.gsap) {
        const { gsap, ScrollTrigger, ScrollToPlugin } = window;
        // GSAPプラグインの登録
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        const ctx = gsap.context(() => {
          // --- Welcome Scene Animation ---
          gsap.to("#welcome-name", { duration: 1, opacity: 1, delay: 0.5, y: -20 });
          gsap.to("#welcome-title", { duration: 1, opacity: 1, delay: 0.8, y: -20 });

          // --- Navigation Hub Logic ---
          const hubItems = document.querySelectorAll(".hub-item");
          hubItems.forEach(item => {
            item.addEventListener("click", () => {
              const target = item.getAttribute("data-scroll-to");
              gsap.to(window, {
                duration: 1.5,
                scrollTo: target,
                ease: "power2.inOut"
              });
            });
          });
          hubItems.forEach((item, i) => {
            gsap.to(item, {
              y: -10,
              repeat: -1,
              yoyo: true,
              duration: 2 + Math.random() * 2,
              delay: i * 0.2,
              ease: "sine.inOut"
            });
          });
          
          // --- Scroll-triggered Animations for each scene ---
          const scenes = document.querySelectorAll(".scene");
          scenes.forEach((scene, i) => {
            if (i === 0) return;
            const content = scene.querySelector(".content-wrapper");
            if (content) {
              gsap.to(content, {
                scrollTrigger: {
                  trigger: scene,
                  start: "top center",
                  toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
              });
            }
          });

          // "Programming" シーンのカードに特化したアニメーション
          gsap.from("#scene-programming .programming-card", {
            scrollTrigger: {
              trigger: "#scene-programming",
              start: "top 70%",
              toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
          });
        });
        
        // コンポーネントがアンマウントされる際にアニメーションをクリーンアップ
        return () => ctx.revert();
      } else {
        // gsapがまだ読み込まれていない場合は、少し待ってから再試行
        setTimeout(initAnimations, 100);
      }
    };
    
    initAnimations();
    
  }, []); // 空の配列を渡すことで、このuseEffectは一度だけ実行される

  return (
    <>
      <main>
        {/* SCENE 1: WELCOME */}
        <section id="scene-welcome" className="scene">
            <div className="text-center text-white">
                <h1 id="welcome-name" className="text-5xl md:text-8xl font-display opacity-0">Natsuha Tabuchi</h1>
                <p id="welcome-title" className="text-xl md:text-3xl mt-4 opacity-0">Scientist & Lover</p>
            </div>
            <div className="absolute bottom-10 text-white text-lg animate-bounce">
                <p>SCROLL</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </section>

        {/* SCENE 2: NAVIGATION HUB */}
        <section id="scene-hub" className="scene">
            <div className="text-center content-wrapper">
                <h2 className="text-5xl md:text-7xl mb-12 font-display text-gray-700">What I Love</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 text-2xl md:text-3xl">
                    <div className="hub-item" data-scroll-to="#scene-music">Music</div>
                    <div className="hub-item" data-scroll-to="#scene-travel">Travel</div>
                    <div className="hub-item" data-scroll-to="#scene-dance">Dance</div>
                    <div className="hub-item" data-scroll-to="#scene-programming">Programming</div>
                    <div className="hub-item" data-scroll-to="#scene-research">Research</div>
                    <div className="hub-item" data-scroll-to="#scene-kdrama">K-Drama</div>
                </div>
            </div>
        </section>

        {/* SCENE 3-1: MUSIC */}
        <section id="scene-music" className="scene">
            <div className="w-full max-w-4xl p-8 content-wrapper">
                <h2 className="text-5xl md:text-7xl text-center mb-8 font-display text-amber-800">Music</h2>
                <iframe title="Spotify Playlist" style={{borderRadius: '12px'}} src="https://open.spotify.com/embed/playlist/6ftUDLED1Weex8bV1a3wlX?utm_source=generator" width="100%" height="380" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
        </section>

        {/* SCENE 3-2: TRAVEL */}
        <section id="scene-travel" className="scene">
            <div className="w-full content-wrapper">
                <h2 className="text-5xl md:text-7xl text-center mb-8 font-display text-teal-800">Travel</h2>
                <div className="horizontal-gallery">
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/87CEEB/FFFFFF?text=Okinawa" alt="沖縄 2024" className="gallery-image"/>
                        <div className="gallery-caption">沖縄 2024</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/98FB98/FFFFFF?text=Kyoto" alt="京都 2023" className="gallery-image"/>
                        <div className="gallery-caption">京都 2023</div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* SCENE 3-3: DANCE */}
        <section id="scene-dance" className="scene">
            <div className="w-full content-wrapper">
                <h2 className="text-5xl md:text-7xl text-center mb-8 font-display text-teal-800">Dance</h2>
                <div className="horizontal-gallery">
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/FF69B4/FFFFFF?text=Showcase" alt="ショーケース 2024" className="gallery-image"/>
                        <div className="gallery-caption">ショーケース 2024</div>
                    </div>
                </div>
            </div>
        </section>

        {/* SCENE 3-4: PROGRAMMING */}
        <section id="scene-programming" className="scene">
            <div className="w-full max-w-5xl p-8 content-wrapper">
                <h2 className="text-5xl md:text-7xl text-center mb-12 font-display text-gray-700">Programming</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md programming-card">
                        <h3 className="text-xl font-bold mb-2">Tech Company A</h3>
                        <p className="text-gray-500 mb-2">2023 Summer</p>
                        <p className="text-gray-700">Frontend Developer Intern.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md programming-card">
                        <h3 className="text-xl font-bold mb-2">Startup B</h3>
                        <p className="text-gray-500 mb-2">2022 Spring</p>
                        <p className="text-gray-700">Backend Intern.</p>
                    </div>
                </div>
            </div>
        </section>
         
        {/* SCENE 3-5: RESEARCH */}
        <section id="scene-research" className="scene">
            <div className="w-full max-w-3xl p-8 content-wrapper text-center">
                 <h2 className="text-5xl md:text-7xl mb-8 font-display text-gray-700">Research</h2>
                 <div className="bg-white p-8 rounded-lg shadow-lg text-left">
                    <h3 className="text-2xl font-bold mb-2">Human-Computer Interaction Lab</h3>
                    <p className="text-gray-500 mb-4">ABC University, Department of Computer Science</p>
                    <p className="text-lg leading-relaxed">My research focuses on creating more intuitive and effective user interfaces using machine learning. I'm exploring how AI can adapt to user behavior in real-time to provide a more personalized and seamless experience across various devices.</p>
                 </div>
            </div>
        </section>

        {/* SCENE 3-6: K-DRAMA */}
        <section id="scene-kdrama" className="scene">
          <div className="w-full max-w-4xl p-8 content-wrapper">
            <h2 className="text-5xl md:text-7xl text-center mb-12 font-display text-pink-700">K-Drama</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="drama-item">
                <p className="text-lg font-bold">愛の不時着</p>
                <div className="flex justify-center gap-2 mt-1">
                  <a href="https://www.netflix.com/title/81159258" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">Netflix</a>
                  <button onClick={() => openLightbox('_2s_qV2a0e0')} className="text-blue-600 hover:text-blue-800">Trailer</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 4: CONTACT */}
        <section id="scene-contact" className="scene">
            <div className="text-center text-white content-wrapper">
                <h2 className="text-4xl md:text-6xl mb-4 font-display">Let's create something great.</h2>
                <p className="text-xl mb-8">お気軽にご連絡ください。</p>
                <div className="flex justify-center gap-8">
                    <a href="#" className="hover:scale-110 transition-transform" title="GitHub">
                        <svg className="w-12 h-12" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </a>
                </div>
            </div>
        </section>
      </main>

      {/* Lightbox for YouTube videos */}
      {isLightboxOpen && (
        <div id="lightbox" onClick={closeLightbox} style={{ display: 'flex' }}>
          <div id="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <span id="close-lightbox" onClick={closeLightbox}>×</span>
            <iframe 
              id="youtube-player" 
              title="YouTube video player"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
