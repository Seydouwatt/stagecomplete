import { useEffect } from 'react';

interface FacebookPixelProps {
  pixelId?: string;
  enabled?: boolean;
}

/**
 * Facebook Pixel tracking component
 * Usage: Add <FacebookPixel pixelId="YOUR_PIXEL_ID" /> to your landing pages
 */
export const FacebookPixel: React.FC<FacebookPixelProps> = ({
  pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID,
  enabled = import.meta.env.VITE_FACEBOOK_PIXEL_ENABLED === 'true',
}) => {
  useEffect(() => {
    if (!enabled || !pixelId) {
      console.log('[Facebook Pixel] Disabled or no pixel ID provided');
      return;
    }

    // Initialize Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript pixel
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
    document.body.appendChild(noscript);

    console.log('[Facebook Pixel] Initialized with ID:', pixelId);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [pixelId, enabled]);

  return null;
};

/**
 * Track custom Facebook Pixel events
 */
export const trackFacebookEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('track', eventName, params);
    console.log('[Facebook Pixel] Event tracked:', eventName, params);
  }
};

/**
 * Track Facebook Pixel conversion with value
 */
export const trackFacebookConversion = (
  eventName: string,
  value: number,
  currency: string = 'EUR'
) => {
  if (window.fbq) {
    window.fbq('track', eventName, { value, currency });
    console.log('[Facebook Pixel] Conversion tracked:', eventName, { value, currency });
  }
};

// Declare fbq on window for TypeScript
declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: any) => void;
  }
}
