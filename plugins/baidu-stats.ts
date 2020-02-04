export default ({ app }) => {
  app.router.afterEach(to => {
    (window as any)._hmt = (window as any)._hmt || [];
    (window as any)._hmt.push(['_trackPageview', to.fullPath]);
  });
};
