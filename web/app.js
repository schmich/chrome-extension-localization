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

store.safeGet = (name, defaultValue) => {
  let value = store.get(name);
  return value === undefined ? defaultValue : value;
};

let app = new Vue({
  el: '#app',
  data: {
    state: null,
    showUpdate: false,
    showUpdated: false,
    localeId: null,
    locale: null,
    navigated: false,
    showMissingLocales: store.safeGet('show-missing-locales', true),
    showMessages: store.safeGet('show-messages', { normal: true, missing: true, outdated: true, identical: true }),
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

    this.history.listen(() => {
      this.navigated = true;
      this.setLocaleId();
    });

    const saveState = () => {
      if (this.state) {
        store.set('state', this.state);
      }
    };

    window.addEventListener('beforeunload', saveState);
    setInterval(saveState, 5 * 60 * 1000);
  },
  methods: {
    navigateIndex() {
      this.localeId = null;
      setTimeout(() => window.scrollTo(0, 0), 0);
    },
    navigateLocale(localeId) {
      this.localeId = localeId;
      setTimeout(() => window.scrollTo(0, 0), 0);
    },
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

      if (this.state && this.localeId) {
        this.locale = this.state.locales[this.localeId];
      } else {
        this.locale = null;
      }

      // Update tooltips.
      Vue.nextTick(() => {
        this.tippy = tippy('[data-tip]', {
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
      this.localeId = id || (this.navigated ? null : store.get('locale-id'));
    },
    substitute(message, placeholders) {
      let result = message;
      for (let name in placeholders) {
        let example = placeholders[name].example;
        result = result.replace('$' + name + '$', example);
      }
      return result;
    },
    toggleMessages() {
      const show = this.toggleShow;
      this.showMessages = {
        normal: show,
        missing: show,
        outdated: show,
        identical: show
      };
    }
  },
  computed: {
    toggleShow() {
      const { normal, missing, outdated, identical } = this.showMessages;
      let show = true;
      if (normal == missing && normal == outdated && normal == identical) {
        show = !normal;
      }
      return show;
    },
    visibleTemplate() {
      let visible = {};
      for (let index in this.state.template) {
        const missing = this.locale.missing.includes(+index);
        const outdated = this.locale.outdated.includes(+index);
        const identical = this.locale.identical.includes(+index);
        const normal = !missing && !outdated && !identical;
        const show = (this.showMessages.normal || !normal)
                  && (this.showMessages.missing || !missing)
                  && (this.showMessages.outdated || !outdated)
                  && (this.showMessages.identical || !identical);

        if (!show) {
          continue;
        }

        visible[index] = this.state.template[index];
      }

      return visible;
    }
  },
  watch: {
    state(newState) {
      this.setLocaleId();
      this.loadLocale();
    },
    showMissingLocales(newMissing) {
      store.set('show-missing-locales', newMissing);
    },
    showMessages: {
      handler(newShow) {
        store.set('show-messages', newShow);
      },
      deep: true
    },
    localeId(newId, oldId) {
      this.loadLocale();

      // Persist locale setting.
      store.set('locale-id', newId);

      if (newId) {
        // Update window location.
        this.history.push('#' + newId);
        if (!this.state.locales[newId].exists) {
          this.showMissingLocales = true;
        }
      } else {
        this.history.push('');
      }
    }
  }
});
