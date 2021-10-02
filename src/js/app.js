/* sweetScroll load */
document.addEventListener(
  "DOMContentLoaded",
  function () {
    new SweetScroll({
      /* some options */
    });

    Particles.init({
      selector: '.particles-js',
      color: ['#DA0463', '#404B69', '#DBEDF3'],
      connectParticles: true
    });
  },
  false
);

// Only trigger if service workers are supported in browser.
if ('serviceWorker' in navigator) {
  // Wait until window is loaded before registering.
  window.addEventListener('load', () => {
    // Register the service worker with "/" as it's scope.
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      // Output success/failure of registration.
      .then(() => console.log('SW registered'))
      .catch(() => console.error('SW registration failed'));

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  });
}
