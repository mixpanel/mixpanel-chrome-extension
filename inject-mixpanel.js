/* eslint-disable no-console */
const injectMixpanel = (function(projectToken) {
  const mixpanelInjector = {
    init: function() {
      if (window.location.hash.includes('access_token')) {
        this.parseHashCredentials();
      }
      window.addEventListener('load', () => {
        this.initMixpanel();
      });
    },

    parseHashCredentials: function() {
      try {
        const getHashParam = (hash, param) => {
          var matches = hash.match(new RegExp(param + '=([^&]*)'));
          return matches ? matches[1] : null;
        };
        // get credentials from hash
        let state = getHashParam(window.location.hash, 'state');
        state = JSON.parse(decodeURIComponent(state));
        const expiresInSeconds = getHashParam(window.location.hash, 'expires_in');
        const editorParams = {
          'accessToken': getHashParam(window.location.hash, 'access_token'),
          'accessTokenExpiresAt': (new Date()).getTime() + (Number(expiresInSeconds) * 1000),
          'appHost': 'https://mixpanel.com',
          'bookmarkletMode': !!state['bookmarkletMode'],
          'projectId': state['projectId'],
          'projectToken': state['token'],
          'userFlags': state['userFlags'],
          'userId': state['userId'],
        };
        window.sessionStorage.setItem('editorParams', JSON.stringify(editorParams));
        history.replaceState('', document.title, window.location.pathname + window.location.search); // completely remove hash
      } catch (e) {
        console.error('Unable to parse credentials from url', e);
      }
    },

    initMixpanel: function() {
      console.log('Injecting mixpanel from extension using project token "' + projectToken + '"');

      // slam existing mixpanel instance so the snippet works properly
      window.mixpanel = undefined;

      // ------ mixpanel snippet ----------
      /* eslint-disable */
      (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
      /* eslint-enable */
      // ------ end mixpanel snippet ----------

      window.mixpanel.init(projectToken);
      window.mixpanel.register({'chrome extension': true});
    },
  };

    mixpanelInjector.init();
});

if (!(window.location.hostname === 'mixpanel.com' || window.location.hostname.endsWith('mixpanel.org'))) {
  chrome.storage.sync.get(null, function(settings) {
    const projectToken = settings.projectToken || '225a6b8c2bc4f08e7cd97ac3fa4e1404';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = 'var __injectMixpanel = ' + injectMixpanel.toString() + '; __injectMixpanel("' + projectToken + '");';
    document.querySelector('html').appendChild(script);
  });
}
