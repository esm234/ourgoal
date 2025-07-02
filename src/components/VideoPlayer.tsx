import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import './VideoPlayer.css';
import { Card } from '@/components/ui/card';

interface Chapter {
  label: string;
  time: number;
}

interface VideoPlayerProps {
  mp4Url: string;
  youtubeUrl?: string;
  title: string;
  duration: string;
  lessonId: string;
  seekTime?: number | null;
  onPlayerReady?: (player: any) => void;
  chapters?: Chapter[];
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  mp4Url,
  youtubeUrl,
  lessonId,
  seekTime,
  onPlayerReady,
  chapters = [],
  title
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);

  // التحقق مما إذا كان الجهاز محمولًا أو iOS
  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const platform = navigator.platform;
      // iOS detection (iPhone/iPad/iPod or iPadOS desktop mode)
      const isIOSDevice =
        /iphone|ipad|ipod/.test(ua) ||
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
      setIsMobile(/iphone|ipad|ipod|android|mobile/.test(ua));
    };

    checkDevice();
  }, []);

  // إنشاء مشغل Plyr
  useEffect(() => {
    let videoElement: HTMLVideoElement | HTMLDivElement | null = null;

    // تنظيف أي مثيل سابق
    if (player) {
      player.destroy();
    }

    // تحديد ما إذا كان الفيديو من يوتيوب أو MP4 عادي
    const isYT = !!youtubeUrl && (
      youtubeUrl.includes('youtube.com') ||
      youtubeUrl.includes('youtu.be')
    );

    setIsYouTube(isYT);

    // إنشاء عنصر الفيديو المناسب
    if (isYT) {
      // استخراج معرف الفيديو من رابط يوتيوب
      let videoId = '';

      if (youtubeUrl.includes('youtu.be/')) {
        videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
      } else if (youtubeUrl.includes('youtube.com/watch')) {
        const url = new URL(youtubeUrl);
        videoId = url.searchParams.get('v') || '';
      } else if (youtubeUrl.includes('youtube.com/embed/')) {
        videoId = youtubeUrl.split('youtube.com/embed/')[1].split('?')[0];
      }

      if (!videoId) {
        console.error('لم يتم العثور على معرف فيديو يوتيوب صالح');
        return;
      }

      // إنشاء عنصر div للاعب يوتيوب
      const youtubeDiv = document.createElement('div');
      youtubeDiv.setAttribute('data-plyr-provider', 'youtube');
      youtubeDiv.setAttribute('data-plyr-embed-id', videoId);

      // إضافة العنصر إلى DOM
      const container = document.getElementById(`video-container-${lessonId}`);
      if (container) {
        container.innerHTML = '';
        container.appendChild(youtubeDiv);
        videoElement = youtubeDiv;
      }
    } else {
      // استخدام عنصر الفيديو العادي للفيديوهات MP4
      videoElement = videoRef.current;

      // تطبيق السمات المطلوبة للتوافق مع iOS
      if (videoRef.current) {
        videoRef.current.setAttribute('playsinline', '');
        videoRef.current.setAttribute('webkit-playsinline', '');
        videoRef.current.setAttribute('x-webkit-airplay', 'allow');
        videoRef.current.setAttribute('controls', '');
      }
    }

    if (!videoElement) return;

    // إعدادات مشغل Plyr
    const options = {
      controls: isIOS ? [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume',
        'settings', 'fullscreen'
      ] : [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume',
        'settings', 'fullscreen'
      ],
      // إعدادات السرعة فقط
      settings: ['speed'],
      // إعدادات السرعة - تأكد من العمل على جميع الأجهزة
      speed: {
        selected: 1,
        options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
      },
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: isIOS, // تفعيل iOS native للآيفون
        container: undefined
      },
      // إزالة Picture-in-Picture
      pip: false,
      disableContextMenu: false,
      hideControls: false,
      clickToPlay: true,
      // منع النقر المزدوج للدخول لوضع ملء الشاشة
      dblClickToFullscreen: false,
      keyboard: { focused: true, global: false },
      tooltips: { controls: true, seek: true },
      youtube: {
        noCookie: false, // استخدام YouTube العادي لتجنب مشاكل CSP
        rel: 0, // عدم إظهار فيديوهات ذات صلة
        showinfo: 0, // إخفاء معلومات الفيديو
        iv_load_policy: 3, // إخفاء التعليقات التوضيحية
        modestbranding: 1, // تقليل علامة YouTube التجارية
        playsinline: isIOS ? 0 : 1, // للآيفون: السماح بالشاشة الكاملة الأصلية
        disablekb: 0, // تفعيل اختصارات لوحة المفاتيح
        enablejsapi: 1, // تفعيل JavaScript API
        origin: window.location.origin, // تحديد المصدر
        cc_load_policy: 0, // عدم تحميل الترجمة تلقائياً
        fs: isIOS ? 1 : 0, // للآيفون: السماح بملء الشاشة من YouTube
        hl: 'ar', // اللغة العربية
        controls: 0 // إخفاء عناصر التحكم الافتراضية لـ YouTube
      }
    };

    // إنشاء مشغل جديد بعد تأخير قصير لضمان تحميل العناصر بشكل صحيح
    setTimeout(() => {
      try {
        setIsLoading(true);

        // للآيفون مع ملفات MP4، استخدم المشغل الافتراضي مع تشغيل تلقائي للشاشة الكاملة
        if (isIOS && !isYT && mp4Url) {
          setIsLoading(false);
          console.log('Using native iOS video player for MP4');

          // إضافة مستمع للتشغيل التلقائي للشاشة الكاملة
          if (videoRef.current) {
            const video = videoRef.current;

            // مستمع لبدء التشغيل - يدخل الشاشة الكاملة تلقائياً
            const handlePlay = () => {
              console.log('Video started playing, entering fullscreen...');

              // تأخير قصير للتأكد من بدء التشغيل
              setTimeout(() => {
                try {
                  if ((video as any).webkitEnterFullscreen) {
                    // للآيفون - استخدام الطريقة الخاصة بـ iOS (الأولوية الأولى)
                    console.log('Using webkitEnterFullscreen for iOS');
                    (video as any).webkitEnterFullscreen();
                  } else if ((video as any).webkitRequestFullscreen) {
                    console.log('Using webkitRequestFullscreen');
                    (video as any).webkitRequestFullscreen();
                  } else if (video.requestFullscreen) {
                    console.log('Using standard requestFullscreen');
                    video.requestFullscreen().catch(err => {
                      console.log('Standard fullscreen request failed:', err);
                    });
                  } else {
                    console.log('No fullscreen method available');
                  }
                } catch (error) {
                  console.log('Error entering fullscreen:', error);
                }
              }, 100);
            };

            video.addEventListener('play', handlePlay);

            // تنظيف المستمع عند إزالة المكون
            return () => {
              video.removeEventListener('play', handlePlay);
            };
          }

          return;
        }

        const newPlayer = new Plyr(videoElement as HTMLVideoElement, options);

        // تحديث الوقت الحالي
        const updateTime = () => {
          setCurrentTime(newPlayer.currentTime || 0);

          // تحديث الفصل الحالي
          if (chapters && chapters.length > 0) {
            const currentTime = newPlayer.currentTime;
            let foundIndex = -1;

            // البحث عن الفصل الحالي
            for (let i = chapters.length - 1; i >= 0; i--) {
              if (currentTime >= chapters[i].time) {
                foundIndex = i;
                break;
              }
            }

            if (foundIndex !== -1 && foundIndex !== currentChapterIndex) {
              setCurrentChapterIndex(foundIndex);
            }
          }
        };

        // إضافة مستمعات الأحداث
        newPlayer.on('timeupdate', updateTime);



        newPlayer.on('ready', () => {
          setIsLoading(false);

          // تأكد من أن إعدادات السرعة متاحة
          console.log('Player ready, speed options:', newPlayer.speed);

          // فرض إظهار زر ملء الشاشة في الآيفون
          const forceShowFullscreenButton = () => {
            const fullscreenButton = document.querySelector('.plyr__control[data-plyr="fullscreen"]') as HTMLElement;
            if (fullscreenButton) {
              fullscreenButton.style.display = 'inline-flex';
              fullscreenButton.style.opacity = '1';
              fullscreenButton.style.visibility = 'visible';
              fullscreenButton.removeAttribute('hidden');
              console.log('Fullscreen button forced to show');
            }
          };

          // تشغيل فوري
          setTimeout(forceShowFullscreenButton, 100);
          // تشغيل متأخر للتأكد
          setTimeout(forceShowFullscreenButton, 500);
          setTimeout(forceShowFullscreenButton, 1000);
          setTimeout(forceShowFullscreenButton, 2000);

          // إذا كان هناك وقت محدد للانتقال إليه
          if (seekTime !== null && seekTime !== undefined && seekTime > 0) {
            try {
              newPlayer.currentTime = seekTime;
            } catch (e) {
              console.error('Error setting initial time:', e);
            }
          }

          // استدعاء onPlayerReady إذا تم توفيره
          if (onPlayerReady) {
            onPlayerReady(newPlayer);
          }
        });

        // إضافة مستمع للتشغيل التلقائي لمشغل Safari الأصلي للآيفون
        if (isIOS) {
          newPlayer.on('play', () => {
            console.log('Video started playing on iOS, attempting native fullscreen...');

            setTimeout(() => {
              try {
                // البحث عن عنصر الفيديو الفعلي
                let videoElement = null;

                // للفيديوهات العادية (MP4)
                if (!isYT && videoRef.current) {
                  videoElement = videoRef.current;
                }
                // لفيديوهات اليوتيوب، البحث عن iframe
                else if (isYT) {
                  const iframe = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
                  if (iframe) {
                    // محاولة الوصول لعنصر الفيديو داخل iframe
                    try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                      if (iframeDoc) {
                        videoElement = iframeDoc.querySelector('video');
                      }
                    } catch (e) {
                      console.log('Cannot access iframe content due to CORS');
                    }
                  }

                  // إذا لم نتمكن من الوصول لعنصر الفيديو في iframe، استخدم الـ media من Plyr
                  if (!videoElement) {
                    videoElement = (newPlayer as any).media;
                  }
                }

                // محاولة استخدام مشغل Safari الأصلي
                if (videoElement && (videoElement as any).webkitEnterFullscreen) {
                  console.log('Using webkitEnterFullscreen for native iOS player');
                  (videoElement as any).webkitEnterFullscreen();
                } else {
                  console.log('webkitEnterFullscreen not available, trying alternatives...');

                  // كحل بديل، محاولة استخدام Plyr fullscreen
                  if (newPlayer.fullscreen && newPlayer.fullscreen.enter) {
                    console.log('Using Plyr fullscreen API as fallback');
                    newPlayer.fullscreen.enter();
                  } else {
                    // كحل أخير، النقر على زر الشاشة الكاملة
                    const fullscreenButton = document.querySelector('.plyr__control[data-plyr="fullscreen"]') as HTMLElement;
                    if (fullscreenButton) {
                      console.log('Clicking fullscreen button as last resort');
                      fullscreenButton.click();
                    }
                  }
                }
              } catch (error) {
                console.log('Error entering native fullscreen:', error);
              }
            }, 300); // زيادة التأخير للتأكد من تحميل الفيديو
          });
        }

        // إضافة مستمع لتغيير السرعة
        newPlayer.on('ratechange', () => {
          console.log('Speed changed to:', newPlayer.speed);
        });

        // معالج أحداث ملء الشاشة لضمان عمل Plyr بشكل صحيح
        newPlayer.on('enterfullscreen', () => {
          console.log('Entered fullscreen via Plyr');
          isFullscreen = true;

          // بدء مؤقت إخفاء العناصر إذا كان الفيديو يعمل
          if (!newPlayer.paused) {
            hideControlsTimeout = setTimeout(hideControls, 3000);
          }

          // ضمان ظهور عناصر التحكم للأجهزة الأخرى
          setTimeout(() => {
            const controls = document.querySelector('.plyr__controls') as HTMLElement;
            if (controls) {
              controls.style.display = 'flex';
              controls.style.opacity = '1';
            }
          }, 100);
        });

        // متغيرات للتحكم في إخفاء/إظهار عناصر التحكم في الشاشة الكاملة
        let hideControlsTimeout: NodeJS.Timeout | null = null;
        let isFullscreen = false;

        // وظيفة إخفاء عناصر التحكم
        const hideControls = () => {
          if (isFullscreen) {
            const controls = document.querySelector('.plyr__controls') as HTMLElement;
            if (controls) {
              controls.style.opacity = '0';
              controls.style.transition = 'opacity 0.3s ease';
            }
          }
        };

        // وظيفة إظهار عناصر التحكم
        const showControls = () => {
          const controls = document.querySelector('.plyr__controls') as HTMLElement;
          if (controls) {
            controls.style.opacity = '1';
            controls.style.transition = 'opacity 0.3s ease';
          }

          // إعادة تعيين المؤقت لإخفاء العناصر بعد 3 ثواني
          if (hideControlsTimeout) {
            clearTimeout(hideControlsTimeout);
          }

          if (isFullscreen && !newPlayer.paused) {
            hideControlsTimeout = setTimeout(hideControls, 3000);
          }
        };

        newPlayer.on('enterfullscreen', () => {
          console.log('Entered fullscreen via Plyr');
          isFullscreen = true;

          // بدء مؤقت إخفاء العناصر إذا كان الفيديو يعمل
          if (!newPlayer.paused) {
            hideControlsTimeout = setTimeout(hideControls, 3000);
          }

          // إضافة مستمعات الأحداث للشاشة الكاملة
          const playerContainer = document.querySelector('.plyr') as HTMLElement;
          if (playerContainer) {
            // إظهار العناصر عند حركة الماوس
            playerContainer.addEventListener('mousemove', showControls);

            // إظهار العناصر عند النقر
            playerContainer.addEventListener('click', showControls);

            // إظهار العناصر عند لمس الشاشة (للأجهزة اللوحية)
            playerContainer.addEventListener('touchstart', showControls);
          }
        });

        newPlayer.on('exitfullscreen', () => {
          console.log('Exited fullscreen via Plyr');
          isFullscreen = false;

          // إلغاء المؤقت
          if (hideControlsTimeout) {
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = null;
          }

          // إظهار العناصر نهائياً
          const controls = document.querySelector('.plyr__controls') as HTMLElement;
          if (controls) {
            controls.style.opacity = '1';
          }

          // إزالة مستمعات الأحداث
          const playerContainer = document.querySelector('.plyr') as HTMLElement;
          if (playerContainer) {
            playerContainer.removeEventListener('mousemove', showControls);
            playerContainer.removeEventListener('click', showControls);
            playerContainer.removeEventListener('touchstart', showControls);
          }
        });

        // إظهار العناصر عند إيقاف/تشغيل الفيديو
        newPlayer.on('pause', () => {
          if (isFullscreen) {
            showControls();
            // إلغاء المؤقت عند الإيقاف
            if (hideControlsTimeout) {
              clearTimeout(hideControlsTimeout);
              hideControlsTimeout = null;
            }
          }
        });

        newPlayer.on('play', () => {
          if (isFullscreen) {
            showControls(); // سيبدأ المؤقت تلقائياً
          }
        });

        // إضافة مستمع للأخطاء لتجنب رسائل الخطأ المزعجة
        newPlayer.on('error', (error: any) => {
          // تجاهل أخطاء YouTube Analytics المعروفة
          if (error && error.message &&
              (error.message.includes('youtube.com/api/stats') ||
               error.message.includes('play.google.com/log') ||
               error.message.includes('youtubei/v1/log_event'))) {
            return; // تجاهل هذه الأخطاء
          }
          console.warn('Player error (non-critical):', error);
        });

        // تعيين المشغل
        setPlayer(newPlayer);
      } catch (error) {
        console.error('Error initializing Plyr:', error);
        setIsLoading(false);
      }
    }, 100);

    // تنظيف عند إزالة المكون
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      }
    };
  }, [lessonId, mp4Url, youtubeUrl, seekTime, onPlayerReady]);

  // التعامل مع النقر على فصل
  const handleChapterClick = (time: number) => {
    if (player) {
      // تأكد من أن المشغل جاهز قبل محاولة تعيين الوقت
      if (player.ready) {
        console.log('Setting time to:', time);
        player.currentTime = time;

        // تأكد من أن الوقت تم تعيينه بالفعل
        setTimeout(() => {
          if (Math.abs(player.currentTime - time) > 1) {
            console.log('Time not set correctly, retrying...');
            player.currentTime = time;
          }
          player.play().catch((err: any) => console.error('Error playing video:', err));
        }, 100);
      } else {
        console.log('Player not ready yet');
        // إذا لم يكن المشغل جاهزًا، انتظر حتى يصبح جاهزًا
        player.once('ready', () => {
          player.currentTime = time;
          player.play().catch((err: any) => console.error('Error playing video:', err));
        });
      }
    }
  };

  // إذا كان الفيديو YouTube وعلى جهاز iOS، اعرض iframe يوتيوب الأصلي فقط
  if (isYouTube && isIOS && youtubeUrl) {
    // استخراج معرف الفيديو من الرابط
    let videoId = '';
    if (youtubeUrl.includes('youtu.be/')) {
      videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
    } else if (youtubeUrl.includes('youtube.com/watch')) {
      const url = new URL(youtubeUrl);
      videoId = url.searchParams.get('v') || '';
    } else if (youtubeUrl.includes('youtube.com/embed/')) {
      videoId = youtubeUrl.split('youtube.com/embed/')[1].split('?')[0];
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&fs=1&hl=ar`;
    return (
      <Card style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
        <div
          className="youtube-iframe-enhanced group"
          style={{
            position: 'relative',
            paddingTop: '56.25%',
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            border: '2px solid #e5e7eb',
            overflow: 'hidden',
            margin: '24px auto',
            maxWidth: 900,
            transition: 'box-shadow 0.3s',
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: 24,
              background: '#000',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              transition: 'box-shadow 0.3s',
            }}
            className="group-hover:shadow-2xl"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="aspect-video relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* رسالة توضيحية للآيفون */}
        {isIOS && (
          <div className="absolute top-2 left-2 right-2 z-20">
            <div className="bg-black/70 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
              � لأجهزة الآيفون: الرجاء استخدام متصفح Safari ليعمل المشغل بشكل صحيح وسيتم تشغيل الفيديو تلقائياً بالمشغل الأصلي
            </div>
          </div>
        )}

        <div id={`video-container-${lessonId}`} className="w-full h-full">
          {!isYouTube && mp4Url && (
            <video
              ref={videoRef}
              className={isIOS ? "w-full h-auto" : "plyr-react plyr w-full h-auto"}
              controls={isIOS} // للآيفون، نستخدم عناصر التحكم الأصلية
              crossOrigin="anonymous"
              playsInline={false} // السماح بالشاشة الكاملة الأصلية للآيفون
              preload="metadata"
              webkit-playsinline="false" // تأكيد عدم التشغيل المضمن للآيفون
              style={isIOS ? { width: '100%', height: 'auto' } : {}}
            >
              <source src={mp4Url} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          )}
        </div>
      </div>

      {chapters && chapters.length > 0 && (
        <div className="p-4 bg-card/50">
          <h3 className="text-lg font-semibold mb-3">فصول الدرس</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => handleChapterClick(chapter.time)}
                className={`text-sm p-2 rounded-lg transition-colors text-start ${
                  index === currentChapterIndex
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-background/50 hover:bg-background text-foreground'
                }`}
              >
                <div className="font-medium">{chapter.label}</div>
                <div className={`text-xs ${index === currentChapterIndex ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {Math.floor(chapter.time / 60)}:{(chapter.time % 60).toString().padStart(2, '0')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoPlayer;
