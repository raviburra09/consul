import Component from 'ember-collection/components/ember-collection';
import needsRevalidate from 'ember-collection/utils/needs-revalidate';
import Grid from 'ember-collection/layouts/grid';
import SlotsMixin from 'ember-block-slots';
import style from 'ember-computed-style';

import { computed, get, set } from '@ember/object';

const $$ = document.querySelectorAll.bind(document);
const createSizeEvent = function(detail) {
  return {
    detail: { width: window.innerWidth, height: window.innerHeight },
  };
};
class ZIndexedGrid extends Grid {
  formatItemStyle(index, w, h) {
    let style = super.formatItemStyle(...arguments);
    style += 'z-index: ' + (10000 - index);
    return style;
  }
}
const change = function(e) {
  // TODO: Why am I getting a jQuery event here?!
  if (e instanceof MouseEvent) {
    // set(this, 'checked', null);
    return;
  }
  if (e instanceof Event) {
    const value = e.currentTarget.value;
    if (value != get(this, 'checked')) {
      set(this, 'checked', value);
    } else {
      set(this, 'checked', null);
    }
  } else if (e.detail && e.detail.index) {
    // set(this, 'checked', null)
    if (e.detail.confirming) {
      this.confirming.push(e.detail.index);
    } else {
      const pos = this.confirming.indexOf(e.detail.index);
      if (pos !== -1) {
        this.confirming.splice(pos, 1);
      }
    }
  }
};
export default Component.extend(SlotsMixin, {
  tagName: 'table',
  attributeBindings: ['style'],
  width: 1150,
  height: 500,
  style: style('getStyle'),
  checked: null,
  init: function() {
    this._super(...arguments);
    this.change = change.bind(this);
    this.confirming = [];
    this['cell-layout'] = new ZIndexedGrid(get(this, 'width'), 46);
    this.handler = () => {
      this.resize(createSizeEvent());
    };
  },
  getStyle: computed('height', function() {
    return {
      height: get(this, 'height'),
    };
  }),
  willRender: function() {
    this._super(...arguments);
    this.set('hasActions', this._isRegistered('actions'));
  },
  didInsertElement: function() {
    this._super(...arguments);
    window.addEventListener('resize', this.handler);
    this.handler();
  },
  willDestroyElement: function() {
    window.removeEventListener('resize', this.handler);
  },
  resize: function(e) {
    // const $header = [...$('#wrapper > header')][0];
    const $footer = [...$$('#wrapper > footer')][0];
    // const $thead = this.$('thead')[0];
    // TODO: cheat for the moment
    const $thead = [...$$('main > div')][0];
    if ($thead) {
      this.set('height', Math.max(0, new Number(e.detail.height - ($footer.clientHeight + 188))));
      this['cell-layout'] = new ZIndexedGrid($thead.clientWidth, 46);
      this.updateItems();
      this.updateScrollPosition();
    }
  },
  _needsRevalidate: function() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    if (this._isGlimmer2()) {
      this.rerender();
    } else {
      needsRevalidate(this);
    }
  },
});
