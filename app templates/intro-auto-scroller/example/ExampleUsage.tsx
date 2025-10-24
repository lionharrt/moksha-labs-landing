/**
 * Example: Basic Usage
 * 
 * Drop this into any React page to add the intro + auto-scroll
 */

import { useIntroAutoScroller } from '../src';

export function DemoPage() {
  const { 
    PlayButton, 
    IntroAnimation, 
    scrollContainerRef,
    isScrolling,
    isPaused,
    togglePause 
  } = useIntroAutoScroller({
    clientLogoUrl: "/client-logo.png", // Optional
    autoScroll: {
      scrollSpeed: 5819,    // Optional: ms per viewport height
      pauseAtBottom: 2000,  // Optional: pause at bottom (ms)
      returnDuration: 1500, // Optional: scroll back duration (ms)
    },
    onComplete: () => {
      console.log('Intro sequence complete!');
    },
  });

  return (
    <>
      {/* Play button overlay */}
      <PlayButton />

      {/* Title animation */}
      <IntroAnimation />

      {/* Your page content - auto-scrolled */}
      <main 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
      >
        <section className="min-h-screen bg-gray-900 flex items-center justify-center">
          <h1 className="text-6xl text-white">Section 1</h1>
        </section>
        
        <section className="min-h-screen bg-gray-800 flex items-center justify-center">
          <h1 className="text-6xl text-white">Section 2</h1>
        </section>
        
        <section className="min-h-screen bg-gray-700 flex items-center justify-center">
          <h1 className="text-6xl text-white">Section 3</h1>
        </section>
      </main>

      {/* Optional: Auto-scroll indicator with pause/play */}
      {isScrolling && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-black/70 text-white px-6 py-3 rounded-full text-sm backdrop-blur-sm">
          <span>{isPaused ? 'Demo paused' : 'Auto-scrolling demo...'}</span>
          <button
            onClick={togglePause}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Example: With React Router
 */
import { useLocation } from 'react-router-dom';

export function DemoPageWithRouter() {
  const location = useLocation();
  const isDemoRoute = location.pathname === '/demo';

  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
    clientLogoUrl: "/client-logo.png",
  });

  // Only show intro on /demo route
  if (!isDemoRoute) {
    return <YourNormalPage />;
  }

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        <YourContent />
      </main>
    </>
  );
}

/**
 * Example: Minimal Setup
 */
export function MinimalExample() {
  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({});

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        {/* Your content */}
      </main>
    </>
  );
}

function YourNormalPage() { return <div>Normal Page</div>; }
function YourContent() { return <div>Demo Content</div>; }

