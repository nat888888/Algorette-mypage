import './index.css';
import React, { useEffect, useState } from 'react';


function App() {
  // Lightbox（動画ポップアップ）の状態を管理
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');

  // 星の位置を生成する関数
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 3,
        delay: Math.random() * 3
      });
    }
    return stars;
  };

  const [stars] = useState(generateStars());

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

          // 背景色のアニメーション
          gsap.to("#scene-welcome", {
            scrollTrigger: {
              trigger: "#scene-welcome",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
            backgroundColor: "#E0FFFF", // 薄い水色
            ease: "none"
          });

          // テキストのフェードアウトアニメーション
          gsap.to(".welcome-text", {
            scrollTrigger: {
              trigger: "#scene-welcome",
              start: "top top",
              end: "center top",
              scrub: 1,
            },
            opacity: 0,
            y: -50,
            ease: "none"
          });

          // スクロールインジケーターのフェードアウトアニメーション
          gsap.to(".scroll-indicator", {
            scrollTrigger: {
              trigger: "#scene-welcome",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
            opacity: 0,
            y: 20,
            ease: "none"
          });

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
        <section id="scene-welcome" className="scene relative">
            <div className="stars-container absolute inset-0">
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="star absolute"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
                  }}
                />
              ))}
            </div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 welcome-text">
                <h1 id="welcome-name" className="text-5xl md:text-8xl font-display opacity-0 whitespace-nowrap">Natsuha Tabuchi</h1>
                <p id="welcome-title" className="text-xl md:text-3xl mt-4 opacity-0">Scientist & Hehe</p>
            </div>
            <div className="fixed bottom-[10%] left-1/2 transform -translate-x-1/2 text-white text-lg animate-bounce scroll-indicator">
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
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-music">Music</div>
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-travel">Travel</div>
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-dance">Dance</div>
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-programming">Programming</div>
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-research">Research</div>
                    <div className="hub-item bubble w-32 h-32 md:w-40 md:h-40" data-scroll-to="#scene-kdrama">K-Drama</div>
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
                        <img src="https://placehold.co/400x300/87CEEB/FFFFFF?text=Korea" alt="Korea 2025" className="gallery-image"/>
                        <div className="gallery-caption">Korea 2025</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/87CEEB/FFFFFF?text=Guam" alt="Guam 2025" className="gallery-image"/>
                        <div className="gallery-caption">Guam 2025</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/98FB98/FFFFFF?text=Turkey" alt="Turkey 2024" className="gallery-image"/>
                        <div className="gallery-caption">Turkey 2024</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="https://placehold.co/400x300/87CEEB/FFFFFF?text=Danang" alt="Danang 2025" className="gallery-image"/>
                        <div className="gallery-caption">Danang 2024</div>
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
                        <img src="public/IMG_9252.JPG" alt="引退公演 Euphoria 2024冬" className="gallery-image"/>
                        <div className="gallery-caption">引退公演 Euphoria 2024冬</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="public/IMG_7985.JPG" alt="早稲田祭 2024秋" className="gallery-image"/>
                        <div className="gallery-caption">早稲田祭 2024秋</div>
                    </div>
                    <div className="gallery-item w-[400px] h-[300px]">
                        <img src="public/IMG_summerlive.JPG" alt="夏公演 Vivid 2024夏" className="gallery-image"/>
                        <div className="gallery-caption">夏公演 Vivid 2024夏</div>
                    </div>

                </div>
            </div>
        </section>

        {/* SCENE 3-4: PROGRAMMING */}
        <section id="scene-programming" className="scene">
            <div class="w-full max-w-5xl p-8 content-wrapper">
                <h2 class="text-5xl md:text-7xl text-center mb-12 font-display text-gray-700">Programming</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-md programming-card">
                        <h3 class="text-xl font-bold mb-2">Tech Company A</h3>
                        <p class="text-gray-500 mb-2">2023 Summer</p>
                        <p class="text-gray-700">Frontend Developer Intern. Worked on a new user dashboard using React and TypeScript.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md programming-card">
                        <h3 class="text-xl font-bold mb-2">Startup B</h3>
                        <p class="text-gray-500 mb-2">2022 Spring</p>
                        <p class="text-gray-700">Backend Intern. Developed REST APIs for the mobile app with Python (Django).</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md programming-card">
                        <h3 class="text-xl font-bold mb-2">Venture C</h3>
                        <p class="text-gray-500 mb-2">2021 Summer</p>
                        <p class="text-gray-700">Software Engineer Intern. Implemented new features and maintained a large-scale web service.</p>
                    </div>
                </div>
            </div>
        </section>
         
        {/* SCENE 3-5: RESEARCH */}
        <section id="scene-research" className="scene">
            <div className="w-full max-w-3xl p-8 content-wrapper text-center">
                 <h2 className="text-5xl md:text-7xl mb-8 font-display text-gray-700">Research</h2>
                 <div className="bg-white p-8 rounded-lg shadow-lg text-left">
                    <h3 className="text-2xl font-bold mb-2">Takeoka Lab</h3>
                    <p className="text-gray-500 mb-4">Waseda University, School of Advanced Science and Engineering</p>
                    <p className="text-lg leading-relaxed">My research focuses on creating more intuitive and effective user interfaces using machine learning. I'm exploring how AI can adapt to user behavior in real-time to provide a more personalized and seamless experience across various devices.</p>
                 </div>
            </div>
        </section>

        {/* SCENE 3-6: K-DRAMA */}
        <section id="scene-kdrama" class="scene">
            <div class="w-full max-w-4xl p-8 content-wrapper">
                <h2 class="text-5xl md:text-7xl text-center mb-12 font-display text-pink-700">K-Drama</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div class="drama-item">
                        <p class="text-lg font-bold">愛の不時着</p>
                        <div class="flex justify-center gap-2 mt-1">
                            <a href="https://www.netflix.com/title/81159258" target="_blank" class="text-red-600 hover:text-red-800">Netflix</a>
                            <button class="open-lightbox text-blue-600 hover:text-blue-800" data-youtube-id="_2s_qV2a0e0">Trailer</button>
                        </div>
                    </div>
                    <div class="drama-item">
                        <p class="text-lg font-bold">梨泰院クラス</p>
                         <div class="flex justify-center gap-2 mt-1">
                            <a href="https://www.netflix.com/title/81193309" target="_blank" class="text-red-600 hover:text-red-800">Netflix</a>
                            <button class="open-lightbox text-blue-600 hover:text-blue-800" data-youtube-id="xgg_H-i4T9I">Trailer</button>
                        </div>
                    </div>
                    <div class="drama-item">
                        <p class="text-lg font-bold">ウ・ヨンウ弁護士は天才肌</p>
                         <div class="flex justify-center gap-2 mt-1">
                            <a href="https://www.netflix.com/title/81518991" target="_blank" class="text-red-600 hover:text-red-800">Netflix</a>
                            <button class="open-lightbox text-blue-600 hover:text-blue-800" data-youtube-id="28_DmVd2p1s">Trailer</button>
                        </div>
                    </div>
                     <div class="drama-item">
                        <p class="text-lg font-bold">スタートアップ</p>
                         <div class="flex justify-center gap-2 mt-1">
                            <a href="https://www.netflix.com/title/81290293" target="_blank" class="text-red-600 hover:text-red-800">Netflix</a>
                            <button class="open-lightbox text-blue-600 hover:text-blue-800" data-youtube-id="52v_ddJ_w6M">Trailer</button>
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
                <div class="flex justify-center gap-8">
                    <a href="https://github.com/nat888888" class="hover:scale-110 transition-transform" title="GitHub">
                        <svg class="w-12 h-12" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </a>
                    <a href="https://www.instagram.com/nat.su.ha" class="hover:scale-110 transition-transform" title="Instagram">
                        <svg class="w-12 h-12" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.297-1.459.717-2.126 1.384S.927 3.356.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.297.784.717 1.459 1.384 2.126.667.666 1.342 1.087 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.784-.297 1.459-.717 2.126-1.384.666-.667 1.087-1.342 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.297-.784-.717-1.459-1.384-2.126C21.314 1.62 20.64 1.2 19.856.904c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.06 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.82.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.06-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.07-4.85c.06-1.17.249-1.805.413-2.227.217-.562.477.96.896 1.382.42.419.819.679 1.381.896.422.164 1.057.36 2.227.413 1.266.057 1.646.07 4.85.07zm0 3.882c-1.657 0-3.023 1.366-3.023 3.023s1.366 3.023 3.023 3.023c1.657 0 3.023-1.366 3.023-3.023s-1.366-3.023-3.023-3.023zm0 5.122c-1.148 0-2.079-.93-2.079-2.079s.93-2.079 2.079-2.079 2.079.93 2.079 2.079-.931 2.079-2.079 2.079zM20.505 3.882c-.525 0-.95.425-.95.95s.425.95.95.95.95-.425.95-.95-.425-.95-.95-.95z"/></svg>
                    </a>
                     <a href="mailto:natsu_t@akane.waseda.jp" class="hover:scale-110 transition-transform" title="Email">
                        <svg class="w-12 h-12" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
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
