import { clientsClaim, type WorkboxPlugin } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

const publicUrl = new URL(process.env.PUBLIC_URL, globalThis.location.href);

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(({ request, url }: { request: Request; url: URL }) => {
  return (
    request.mode === 'navigate' &&
    !url.pathname.startsWith('/_') &&
    !/\/[^/?]+\.[^/]+$/.test(url.pathname)
  );
}, createHandlerBoundToURL(new URL('index.html', publicUrl).pathname));

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 }) as WorkboxPlugin],
  }),
);

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
