import { fixture, assert, expect, aTimeout } from '@open-wc/testing';
import '../anypoint-selector.js';
import * as sinon from 'sinon';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}

.my-selected {
  background: red;
}`;

describe('AnypointSelector', () => {
  async function defaultsFixture() {
    return fixture(`<anypoint-selector>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function basicFixture() {
    return fixture(`<anypoint-selector selected="item2" attrforselected="id">
      <div id="item0">Item 0</div>
      <div id="item1">Item 1</div>
      <div id="item2">Item 2</div>
      <div id="item3">Item 3</div>
      <div id="item4">Item 4</div>
    </anypoint-selector>`);
  }

  describe('defaults', () => {
    let s1;

    beforeEach(async () => {
      s1 = await defaultsFixture();
    });

    it('to nothing selected', () => {
      assert.equal(s1.selected, null);
    });

    it('to selected as selectedClass', () => {
      assert.equal(s1.selectedClass, 'selected');
    });

    it('to false as multi', () => {
      assert.isFalse(s1.multi);
    });

    it('to click as activateEvent', () => {
      assert.equal(s1.activateEvent, 'click');
    });

    it('to nothing as attrForSelected', () => {
      assert.equal(s1.attrForSelected, null);
    });

    it('as many items as children', () => {
      assert.equal(s1.items.length, s1.querySelectorAll('div').length);
    });
  });

  describe('basic', () => {
    let s2;

    beforeEach(async () => {
      s2 = await basicFixture();
    });

    it('honors the attrForSelected attribute', async () => {
      await aTimeout();
      assert.equal(s2.attrForSelected, 'id');
      assert.equal(s2.selected, 'item2');
      assert.equal(s2.selectedItem, document.querySelector('#item2'));
    });

    it('allows assignment to selected', () => {
      // set selected
      s2.selected = 'item4';
      // check selected class
      assert.isTrue(s2.children[4].classList.contains('selected'));
      // check item
      assert.equal(s2.selectedItem, s2.children[4]);
    });

    it('fire select when selected is set', () => {
      // setup listener for select event
      let selectedEventCounter = 0;
      s2.addEventListener('select', () => {
        // eslint-disable-next-line no-plusplus
        selectedEventCounter++;
      });
      // set selected
      s2.selected = 'item4';
      // check select event
      assert.equal(selectedEventCounter, 1);
    });

    it('set selected to old value', () => {
      // setup listener for select event
      let selectedEventCounter = 0;
      s2.addEventListener('select', () => {
        // eslint-disable-next-line no-plusplus
        selectedEventCounter++;
      });
      // selecting the same value shouldn't fire select
      s2.selected = 'item2';
      assert.equal(selectedEventCounter, 0);
    });

    describe('`select()` and `selectIndex()`', () => {
      it('`select()` selects an item with the given value', () => {
        s2.select('item1');
        assert.equal(s2.selected, 'item1');
        s2.select('item3');
        assert.equal(s2.selected, 'item3');
        s2.select('item2');
        assert.equal(s2.selected, 'item2');
      });

      it('`selectIndex()` selects an item with the given index', () => {
        // This selector has attributes `selected` and `attr-for-selected`
        // matching this item.
        assert.equal(s2.selectedItem, s2.items[2]);
        s2.selectIndex(1);
        assert.equal(s2.selected, 'item1');
        assert.equal(s2.selectedItem, s2.items[1]);
        s2.selectIndex(3);
        assert.equal(s2.selected, 'item3');
        assert.equal(s2.selectedItem, s2.items[3]);
        s2.selectIndex(4);
        assert.equal(s2.selected, 'item4');
        assert.equal(s2.selectedItem, s2.items[4]);
      });
    });

    describe('items changing', () => {
      let s1;
      beforeEach(async () => {
        s1 = await defaultsFixture();
      });

      it('cause children-changed to fire', async () => {
        const newItem = document.createElement('div');
        let changeCount = 0;
        newItem.id = 'item999';

        s2.addEventListener('children-changed', (event) => {
          // eslint-disable-next-line no-plusplus
          changeCount++;
          const mutations = event.detail;
          assert.typeOf(mutations, 'array');
          assert.notEqual(mutations[0].addedNodes, undefined);
          assert.notEqual(mutations[0].removedNodes, undefined);
        });

        s2.appendChild(newItem);
        await aTimeout();
        s2.removeChild(newItem);
        await aTimeout();
        expect(changeCount).to.be.equal(2);
      });

      it('updates selected item', (done) => {
        s1.selected = 0;
        let {firstElementChild} = s1;
        expect(firstElementChild).to.be.equal(s1.selectedItem);
        expect(firstElementChild.classList.contains('selected')).to.be.eql(true);

        s1.addEventListener('children-changed', () => {
          firstElementChild = s1.firstElementChild;
          expect(firstElementChild).to.be.equal(s1.selectedItem);
          expect(firstElementChild.classList.contains('selected')).to.be.eql(true);
          done();
        });
        s1.removeChild(s1.selectedItem);
      });

      it('navigation-close dispatched when selecting same item', () => {
        const spy = sinon.spy();
        s1.addEventListener('closed', spy);

        s1.selected = 0;
        let { firstElementChild } = s1;
        expect(firstElementChild).to.be.equal(s1.selectedItem);
        expect(firstElementChild.classList.contains('selected')).to.be.eql(true);
        assert.isFalse(spy.called);

        s1.selected = 0;
        firstElementChild = s1.firstElementChild;
        expect(firstElementChild).to.be.equal(s1.selectedItem);
        expect(firstElementChild.classList.contains('selected')).to.be.eql(true);
        assert.isTrue(spy.called);
      });
    });

    describe('dynamic selector', () => {
      // NOTE(bicknellr): Polymer 2 only upgrades elements once they have been
      // connected to the document. This test now connects the selector
      // *first* and appends the child afterwards.
      it('selects dynamically added child automatically', (done) => {
        // Create the selector, set selected, connect to force upgrade.
        const selector = document.createElement('anypoint-selector');
        selector.selected = '0';
        document.body.appendChild(selector);
        // Create and append a new item which should become selected.
        const child = document.createElement('div');
        child.textContent = 'Item 0';
        selector.appendChild(child);
        selector.addEventListener('children-changed', function onIronItemsChanged() {
          selector.removeEventListener('children-changed', onIronItemsChanged);
          assert.equal(child.className, 'selected');
          document.body.removeChild(selector);
          done();
        });
      });
    });
  });
});
