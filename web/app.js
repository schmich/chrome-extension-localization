qwest.setDefaultDataType('json');

// Deep clone an object. Assumes only simple types and object aggregates of simple types.
function clone(obj) {
  if (obj instanceof Object) {
    let copy = {};
    for (let prop in obj) {
      copy[prop] = clone(obj[prop]);
    }
    return copy;
  } else {
    return obj;
  }
}

let app = new Vue({
  el: '#app',
  data: {
    state: null,
    showUpdate: false,
    showUpdated: false,
    localeId: null,
    locale: null,
    showMissingLocales: store.get('show-missing-locales'),
    tippy: tippy(),
    history: History.createBrowserHistory()
  },
  mounted: function () {
    this.state = store.get('state');

    qwest.get('../../locales.json').then((_, resp) => {
      if (!this.state) {
        this.state = this.expandState(resp);
        store.set('state', resp);
      } else {
        this.showUpdate = resp.hash !== this.state.hash;
        this.loadUpdate = () => {
          this.state = this.expandState(resp);
          store.set('state', resp);
          this.hideUpdate();

          this.showUpdated = true;
          setTimeout(() => this.showUpdated = false, 2 * 1000);
        };
        this.hideUpdate = () => {
          this.showUpdate = false;
          this.loadUpdate = this.hideUpdate = null;
        };
      }
    });

    this.history.listen(this.setLocaleId);

    const saveState = () => {
      if (this.state) {
        store.set('state', this.state);
      }
    };

    window.addEventListener('beforeunload', saveState);
    setInterval(saveState, 5 * 60 * 1000);
  },
  methods: {
    expandState(state) {
      for (let id in state.locales) {
        let locale = state.locales[id];
        if (!locale.exists) {
          locale.missing = [];
          locale.messages = [];
          for (let i = 0; i < state.template.length; ++i) {
            locale.missing.push(i);
            locale.messages.push(null);
          }
          locale.outdated = [];
          locale.identical = [];
        }
      }
      return state;
    },
    exportJson() {
      let messages = {};

      for (let i in this.state.template) {
        let info = clone(this.state.template[i]);
        let id = info.id;
        delete info.id;

        let message = this.locale.messages[i];
        if (!message) {
          continue;
        }

        if (!message.match(/\s+/)) {
          message = message.trim();
        }

        if (message === '' && this.locale.missing.includes(i)) {
          continue;
        }

        messages[id] = {
          message,
          ...info
        };
      }

      let json = JSON.stringify(messages, null, '    ');
      let link = document.createElement('a');
      link.href = 'data:application/json,' + encodeURIComponent(json);
      link.download = 'messages.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    loadLocale() {
      // Destroy existing tooltips.
      this.tippy.destroyAll();

      this.locale = this.state.locales[this.localeId];

      // Update tooltips.
      Vue.nextTick(() => {
        this.tippy = tippy('.state, .stat', {
          arrow: true,
          duration: 0,
          distance: 15,
          animation: null
        });
      });
    },
    setLocaleId() {
      if (!this.state) {
        return;
      }

      let id = window.location.hash.slice(1).trim();
      let allIds = Object.keys(this.state.locales);
      if (id !== '' && !allIds.includes(id)) {
        id = allIds[0];
      }

      this.localeId = id || store.get('locale-id') || allIds[0];
    },
    substitute(message, placeholders) {
      let result = message;
      for (let name in placeholders) {
        let example = placeholders[name].example;
        result = result.replace('$' + name + '$', example);
      }
      return result;
    }
  },
  computed: {
  },
  watch: {
    state(newState) {
      this.setLocaleId();
      this.loadLocale();
    },
    showMissingLocales(newMissing) {
      store.set('show-missing-locales', newMissing);
    },
    localeId(newId) {
      this.loadLocale();

      // Persist locale setting.
      store.set('locale-id', newId);

      // Update window location.
      this.history.replace('#' + newId);
      if (!this.state.locales[newId].exists) {
        this.showMissingLocales = true;
      }
    }
  }
});
