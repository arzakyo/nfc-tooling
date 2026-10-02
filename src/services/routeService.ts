import { useEffect } from 'react';
import { Platform } from 'react-native';

export type AppTabId = 'scan' | 'history' | 'more';
export type MoreSubView = 'menu' | 'pocketbook' | 'faq' | 'about';

export interface RouteState {
  tab: AppTabId;
  selectedCardId?: string; // in history
  moreSubView?: MoreSubView;
  pocketBookSection?: string;
}

export function parseHash(hash: string): RouteState {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);

  const tab = (['scan', 'history', 'more'].includes(parts[0]) ? parts[0] : 'scan') as AppTabId;

  if (tab === 'history') {
    return {
      tab,
      selectedCardId: parts[1] || undefined,
    };
  }

  if (tab === 'more') {
    const sub = parts[1] as MoreSubView | undefined;
    const moreSubView = ['pocketbook', 'faq', 'about'].includes(sub || '') ? sub : 'menu';
    return {
      tab,
      moreSubView,
      pocketBookSection: parts[2] || undefined,
    };
  }

  return { tab: 'scan' };
}

export function formatHash(state: RouteState): string {
  if (state.tab === 'history') {
    return state.selectedCardId ? `#history/${state.selectedCardId}` : '#history';
  }
  if (state.tab === 'more') {
    if (state.moreSubView && state.moreSubView !== 'menu') {
      return state.pocketBookSection
        ? `#more/${state.moreSubView}/${state.pocketBookSection}`
        : `#more/${state.moreSubView}`;
    }
    return '#more';
  }
  return '#scan';
}

/**
 * Pushes or replaces a route in browser history
 */
export function navigateRoute(state: RouteState, replace: boolean = false) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const targetHash = formatHash(state);
  if (window.location.hash === targetHash) return;

  if (replace) {
    window.history.replaceState(state, '', targetHash);
  } else {
    window.history.pushState(state, '', targetHash);
  }
}
