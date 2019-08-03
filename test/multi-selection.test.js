import { fixture, assert, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function testFixture() {
    return await fixture(`<anypoint-selector multi>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function valueByIdFixture() {
    return await fixture(`<anypoint-selector multi attrforselected="id">
      <div id="item0">Item 0</div>
      <div id="item1">Item 1</div>
      <div id="item2">Item 2</div>
      <div id="item3">Item 3</div>
      <div id="item4">Item 4</div>
    </anypoint-selector>`);
  }

  describe('multi', function() {
    let s;
    beforeEach(async function() {
      s = await testFixture();
    });

    it('honors the multi attribute', function() {
      assert.isTrue(s.multi);
    });

    it('has sane defaults', function() {
      assert.deepEqual(s.selectedValues, []);
      assert.equal(s.selectedClass, 'selected');
      assert.equal(s.items.length, 5);
    });

    it('set multi-selection via selected property', function() {
      // set selectedValues
      s.selectedValues = [0, 2];
      // check selected class
      assert.isTrue(s.children[0].classList.contains('selected'));
      assert.isTrue(s.children[2].classList.contains('selected'));
      // check selectedItems
      assert.equal(s.selectedItems.length, 2);
      assert.equal(s.selectedItems[0], s.children[0]);
      assert.equal(s.selectedItems[1], s.children[2]);
    });

    it('set multi-selection via tap', function() {
      // set selectedValues
      MockInteractions.tap(s.children[0]);
      MockInteractions.tap(s.children[2]);
      // check selected class
      assert.isTrue(s.children[0].classList.contains('selected'));
      assert.isTrue(s.children[2].classList.contains('selected'));
      // check selectedItems
      assert.equal(s.selectedItems.length, 2);
      assert.equal(s.selectedItems[0], s.children[0]);
      assert.equal(s.selectedItems[1], s.children[2]);
    });

    it('fire select/deselect events when selectedValues changes', function() {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', function(e) {
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', function(e) {
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      // programatically select values 0 and 1 (both fire select)
      s.selectedValues = [0, 1];
      // programatically select values 1 and 2 (2 fires select, 0 fires
      // deselect)
      s.selectedValues = [1, 2];
      // programatically deselect all values (1 and 2 fire deselect)
      s.selectedValues = [];
      // check events
      assert.equal(selectEventCounters[0], 1);
      assert.equal(deselectEventCounters[0], 1);
      assert.equal(selectEventCounters[1], 1);
      assert.equal(deselectEventCounters[1], 1);
      assert.equal(selectEventCounters[2], 1);
      assert.equal(deselectEventCounters[2], 1);
    });

    it('fire select/deselect events when selectedValues is modified', function() {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', function(e) {
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', function(e) {
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.selectedValues = [];
      // programatically select value 0
      s.selectedValues.push(0, 1);
      s.selectedValues = [...s.selectedValues];
      // programatically deselect value 0
      s.selectedValues.shift();
      s.selectedValues = [...s.selectedValues];
      // programatically select value 2
      s.selectedValues.push(2);
      s.selectedValues = [...s.selectedValues];
      // programatically deselect value 1
      s.selectedValues.shift();
      s.selectedValues = [...s.selectedValues];
      assert.equal(selectEventCounters[0], 1);
      assert.equal(deselectEventCounters[0], 1);
      assert.equal(selectEventCounters[1], 1);
      assert.equal(deselectEventCounters[1], 1);
      assert.equal(selectEventCounters[2], 1);
      assert.equal(deselectEventCounters[2], 0);
    });

    it('fire select/deselect events when toggling items', function() {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', function(e) {
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', function(e) {
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      // tap to select items 0 and 1 (both fire select)
      MockInteractions.tap(items[0]);
      MockInteractions.tap(items[1]);
      // programatically select values 1 and 2 (2 fires select, 0 fires deselect)
      s.selectedValues = [1, 2];
      // tap to deselect items 1 and 2 (both fire deselect)
      MockInteractions.tap(items[1]);
      MockInteractions.tap(items[2]);
      // check events
      assert.equal(selectEventCounters[0], 1);
      assert.equal(deselectEventCounters[0], 1);
      assert.equal(selectEventCounters[1], 1);
      assert.equal(deselectEventCounters[1], 1);
      assert.equal(selectEventCounters[2], 1);
      assert.equal(deselectEventCounters[2], 1);
    });

    it('toggle selected class when toggling items selection', function() {
      // setup listener for item-select/deselect events
      const item0 = s.children[0];
      const item1 = s.children[1];
      assert.isFalse(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // tap to select item 0 (add selected class)
      MockInteractions.tap(item0);
      assert.isTrue(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // tap to select item 1 (add selected class)
      MockInteractions.tap(item1);
      assert.isTrue(item0.classList.contains('selected'));
      assert.isTrue(item1.classList.contains('selected'));
      // tap to deselect item 1 (remove selected class)
      MockInteractions.tap(item1);
      assert.isTrue(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // programatically select both values (1 add selected class)
      s.selectedValues = [0, 1];
      assert.isTrue(item0.classList.contains('selected'));
      assert.isTrue(item1.classList.contains('selected'));
      // programatically deselect all values (both removes selected class)
      s.selectedValues = [];
      assert.isFalse(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
    });

    it('fires selected-values-changed when selection changes', function() {
      let selectedValuesChangedEventCounter = 0;
      s.addEventListener('selectedvalues-changed', function() {
        selectedValuesChangedEventCounter++;
      });
      MockInteractions.tap(s.children[0]);
      MockInteractions.tap(s.children[0]);
      MockInteractions.tap(s.children[0]);
      assert.isAbove(selectedValuesChangedEventCounter, 0);
    });

    it('updates selection when dom changes', async () => {
      const firstChild = s.querySelector(':first-child');
      const lastChild = s.querySelector(':last-child');
      MockInteractions.tap(firstChild);
      MockInteractions.tap(lastChild);
      assert.lengthOf(s.selectedItems, 2);
      s.removeChild(lastChild);
      await nextFrame();
      assert.lengthOf(s.selectedItems, 1);
      assert.equal(s.selectedItems[0], firstChild);
    });

    describe('`select()` and `selectIndex()`', function() {
      let selector;
      beforeEach(async () => {
        selector = await valueByIdFixture();
      });

      it('`select()` selects an item with the given value', function() {
        selector.select('item1');
        assert.equal(selector.selectedValues.length, 1);
        assert.equal(selector.selectedValues.indexOf('item1'), 0);
        selector.select('item3');
        assert.equal(selector.selectedValues.length, 2);
        assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);
        selector.select('item2');
        assert.equal(selector.selectedValues.length, 3);
        assert.isTrue(selector.selectedValues.indexOf('item2') >= 0);
      });

      it('`selectIndex()` selects an item with the given index', function() {
        selector.selectIndex(1);
        assert.equal(selector.selectedValues.length, 1);
        assert.isTrue(selector.selectedValues.indexOf('item1') >= 0);
        assert.equal(selector.selectedItems.length, 1);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[1]) >= 0);
        selector.selectIndex(3);
        assert.equal(selector.selectedValues.length, 2);
        assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);
        assert.equal(selector.selectedItems.length, 2);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[3]) >= 0);
        selector.selectIndex(0);
        assert.equal(selector.selectedValues.length, 3);
        assert.isTrue(selector.selectedValues.indexOf('item0') >= 0);
        assert.equal(selector.selectedItems.length, 3);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[0]) >= 0);
      });
    });
    // it('toggle multi from true to false', function() {
    //   // set selected
    //   s.selected = [0, 2];
    //   let first = s.selected[0];
    //   // set mutli to false, so to make it single-selection
    //   s.multi = false;
    //   // selected should not be an array
    //   assert.isNotArray(s.selected);
    //   // selected should be the first value from the old array
    //   assert.equal(s.selected, first);
    // });
  });
});
