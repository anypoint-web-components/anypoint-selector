import { fixture, assert } from '@open-wc/testing';
import '../anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function testFixture() {
    return await fixture(`<anypoint-selector selected=0>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function attrChangeFixture() {
    return await fixture(`<anypoint-selector attrforselected="data-x" selected="x-1">
      <div data-x="x-1" data-y="y-1">1</div>
      <div data-x="x-2" data-y="y-2">2</div>
      <div data-x="x-3" data-y="y-3">3</div>
    </anypoint-selector>`);
  }

  async function attrChangeMultiFixture() {
    return await fixture(`<anypoint-selector attrforselected="data-x" selectedvalues='["x-1","x-2"]' multi>
      <div data-x="x-1" data-y="y-1">1</div>
      <div data-x="x-2" data-y="y-2">2</div>
      <div data-x="x-3" data-y="y-3">3</div>
    </anypoint-selector>`);
  }

  describe('selected attributes', function() {
    let s;
    beforeEach(async function() {
      s = await testFixture();
    });

    it('custom selectedAttribute', function() {
      // set selectedAttribute
      s.selectedAttribute = 'myattr';
      // check selected attribute (should not be there)
      assert.isFalse(s.children[4].hasAttribute('myattr'));
      // set selected
      s.selected = 4;
      // now selected attribute should be there
      assert.isTrue(s.children[4].hasAttribute('myattr'));
    });
  });

  describe('changing attrForSelected', function() {
    let s;
    beforeEach(async function() {
      s = await attrChangeFixture();
    });

    it('changing selectedAttribute', function() {
      s.attrForSelected = 'data-y';
      assert.equal(s.selected, 'y-1');
    });
  });

  describe('changing attrForSelected in multi', function() {
    let s;
    beforeEach(async function() {
      s = await attrChangeMultiFixture();
    });

    it('changing selectedAttribute', function() {
      s.attrForSelected = 'data-y';
      assert.equal(s.selectedValues.length, 2);
      assert.equal(s.selectedValues[0], 'y-1');
      assert.equal(s.selectedValues[1], 'y-2');
    });
  });
});
