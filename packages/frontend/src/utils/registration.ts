type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

const isLocalhost =
  globalThis.location.hostname === 'localhost' ||
  globalThis.location.hostname === '[::1]' ||
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
    globalThis.location.hostname,
  );

const registerValidSW = (swUrl: string, config?: Config) => {
  globalThis.navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) return;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (globalThis.navigator.serviceWorker.controller) {
              globalThis.console.log(
                'New content is available and will be used' +
                  ' when all tabs for this page are closed.',
              );
              if (config?.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              globalThis.console.log('Content is cached for offline use.');
              if (config?.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      globalThis.console.error(
        'Error during service worker registration:',
        error,
      );
    });
};

const checkValidServiceWorker = (swUrl: string, config?: Config) => {
  globalThis
    .fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        globalThis.navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            globalThis.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      globalThis.console.log(
        'No internet connection found. App is running in offline mode.',
      );
    });
};

const register = (config?: Config) => {
  if (
    process.env.NODE_ENV === 'production' &&
    'serviceWorker' in globalThis.navigator
  ) {
    const publicUrl = new URL(process.env.PUBLIC_URL, globalThis.location.href);
    if (publicUrl.origin !== globalThis.location.origin) return;
    globalThis.addEventListener('load', () => {
      const swUrl = new URL('service-worker.js', publicUrl).pathname;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        globalThis.navigator.serviceWorker.ready.then(() => {
          globalThis.console.log(
            'This web app is being served cache-first by a service worker.',
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
};

const unregister = () => {
  if ('serviceWorker' in globalThis.navigator) {
    globalThis.navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        globalThis.console.error(error.message);
      });
  }
};

export { register, unregister };
