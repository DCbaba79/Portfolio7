import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Minimal History-API router. The site only has two route shapes
 * ("/" and "/work/:id"), so a dependency would be overkill.
 */

interface RouterState {
  path: string;
  hash: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterState>({ path: '/', hash: '', navigate: () => {} });

const HOME_SCROLL_KEY = 'ds:home-scroll';

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(() => ({
    path: window.location.pathname,
    hash: window.location.hash,
  }));

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onPop = () => setLocation({ path: window.location.pathname, hash: window.location.hash });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash === window.location.hash) return;
    if (window.location.pathname === '/') {
      try { sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY)); } catch {}
    }
    history.pushState(null, '', url.pathname + url.hash);
    setLocation({ path: url.pathname, hash: url.hash });
  }, []);

  return (
    <RouterContext.Provider value={{ ...location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export const useRouter = () => useContext(RouterContext);

export function consumeHomeScroll(): number | null {
  try {
    const v = sessionStorage.getItem(HOME_SCROLL_KEY);
    sessionStorage.removeItem(HOME_SCROLL_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}
