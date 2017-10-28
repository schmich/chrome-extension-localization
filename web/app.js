// TODO
// Use localStorage to store changes.

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
    status: null,
    localeId: null,
    locale: null,
    messages: null,
    en: null,
    messageFilter: null,
    showMissingLocales: false,
    tippy: tippy(),
    history: History.createBrowserHistory()
  },
  mounted: function () {
    const toLocale = location => {
      let locale = location.hash.slice(1).trim();
      let allLocales = Object.keys(this.status);
      return (locale !== '' && allLocales.includes(locale)) ? locale : allLocales[0];
    }

    qwest.get('../../status.json').then((_, resp) => {
      this.en = resp['en'];
      delete resp['en'];
      this.status = resp;
      this.localeId = toLocale(window.location);
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
    localeId(newLocaleId) {
      this.tippy.destroyAll();

      this.history.push('#' + newLocaleId);
      if (!this.status[newLocaleId].exists) {
        this.showMissingLocales = true;
      }

      this.locale = this.status[this.localeId];
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
