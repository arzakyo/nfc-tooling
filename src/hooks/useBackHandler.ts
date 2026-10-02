import { useEffect } from 'react';
import { Platform, BackHandler } from 'react-native';

interface UseBackHandlerOptions {
  enabled: boolean;
  onBack: () => void;
  historyKey?: string; // unique hash or identifier for browser history state
}

/**
 * Universal back handler that intercepts both:
 * 1. Native Android hardware back button (via BackHandler)
 * 2. Browser back button & swipe back (via window.history.pushState & popstate)
 */
export function useBackHandler({ enabled, onBack, historyKey }: UseBackHandlerOptions) {
  // 1. Native Android Hardware Back Button
  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    const backAction = () => {
      onBack();
      return true; // prevent app from minimizing / exiting
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => subscription.remove();
  }, [enabled, onBack]);

  // 2. Web Browser Back Button (popstate)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    if (!enabled) return;

    // Only attach generic listener if screen doesn't manage its own hash popstate
    if (!historyKey?.startsWith('history-') && !historyKey?.startsWith('more-')) {
      const stateKey = historyKey || 'subview';
      const currentState = window.history.state || {};

      if (currentState.subState !== stateKey) {
        window.history.pushState({ subState: stateKey }, '');
      }

      const handlePopState = () => {
        onBack();
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [enabled, onBack, historyKey]);
}
