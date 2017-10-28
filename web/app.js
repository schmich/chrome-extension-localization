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
    locales: null,
    localeId: null,
    locale: null,
    messages: null,
    en: null,
    messageFilter: null,
    showMissingLocales: store.get('show-missing-locales'),
    tippy: tippy(),
    history: History.createBrowserHistory()
  },
  mounted: function () {
    const toLocale = location => {
      let locale = location.hash.slice(1).trim();
      let allIds = Object.keys(this.locales);
      return (locale !== '' && allIds.includes(locale)) ? locale : allIds[0];
    }

    qwest.get('../../status.json').then((_, resp) => {
      let locales = resp.locales;
      this.en = locales['en'];
      delete locales['en'];
      this.locales = locales;

      this.localeId = store.get('locale-id');
      if (!this.localeId || window.location.hash !== '') {
        this.localeId = toLocale(window.location);
      }
    });

    this.history.listen(location => this.localeId = toLocale(location));
  },
  methods: {
    exportJson() {
      let messages = clone(this.locale.messages);
      for (let id in messages) {
        let clean = messages[id].message.trim();
        if (clean === "" && this.locale.missing.includes(id)) {
          delete messages[id];
        } else {
          messages[id].message = clean;
        }
      }

      let json = JSON.stringify(messages, null, '    ');
      let link = document.createElement('a');
      link.href = 'data:application/json,' + encodeURIComponent(json);
      link.download = 'messages.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    filter(messages, filter) {
      if (filter === null) {
        return messages;
      }

      let pattern = null;
      try {
        pattern = new RegExp(filter);
      } catch (e) {
        return messages;
      }

      let out = {};
      for (let id in messages) {
        if (id.match(pattern)) {
          out[id] = messages[id];
        }
      }
      return out;
    }
  },
  computed: {
  },
  watch: {
    showMissingLocales(newMissing) {
      store.set('show-missing-locales', newMissing);
    },
    localeId(newId) {
      // Destroy existing tooltips.
      this.tippy.destroyAll();

      // Update window location.
      this.history.replace('#' + newId);
      if (!this.locales[newId].exists) {
        this.showMissingLocales = true;
      }

      // Persist locale setting.
      store.set('locale-id', newId);

      // Copy missing messages from en.
      this.locale = this.locales[this.localeId];
      let messages = this.locale.messages;
      for (let id in this.en.messages) {
        if (!messages[id]) {
          messages[id] = clone(this.en.messages[id]);
          messages[id].message = '';
        }
      }

      // Update tooltips.
      Vue.nextTick(() => {
        this.tippy = tippy('td.state, .stat', {
          arrow: true,
          duration: 0,
          distance: 15,
          animation: null
        });
      });
    }
  }
});
