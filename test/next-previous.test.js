import { fixture, assert } from '@open-wc/testing';
import '../anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function test1Fixture() {
    return await fixture(`<anypoint-selector selected=0>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
    </anypoint-selector>`);
  }

  async function test2Fixture() {
    return await fixture(`<anypoint-selector selected="foo" attrforselected="name">
      <div name="foo">Item Foo</div>
      <div name="bar">Item Bar</div>
      <div name="zot">Item Zot</div>
    </anypoint-selector>`);
  }

  let s;
  function assertAndSelect(method, expectedIndex) {
    assert.equal(s.selected, expectedIndex);
    s[method]();
  }

  describe('next/previous', function() {
    beforeEach(async function() {
      s = await test1Fixture();
    });

    it('selectNext', function() {
      assert.equal(s.selected, 0);
      assertAndSelect('selectNext', 0);
      assertAndSelect('selectNext', 1);
      assertAndSelect('selectNext', 2);
      assert.equal(s.selected, 0);
    });

    it('selectPrevious', function() {
      assert.equal(s.selected, 0);
      assertAndSelect('selectPrevious', 0);
      assertAndSelect('selectPrevious', 2);
      assertAndSelect('selectPrevious', 1);
      assert.equal(s.selected, 0);
    });

    it('selectNext/Previous', function() {
      assert.equal(s.selected, 0);
      assertAndSelect('selectNext', 0);
      assertAndSelect('selectNext', 1);
      assertAndSelect('selectPrevious', 2);
      assertAndSelect('selectNext', 1);
      assertAndSelect('selectPrevious', 2);
      assert.equal(s.selected, 1);
    });

    it('selectNext from unselected', function() {
      s.selected = undefined;
      assertAndSelect('selectNext', undefined);
      assert.equal(s.selected, 0);
    });

    it('selectPrevious from unselected', function() {
      s.selected = undefined;
      assertAndSelect('selectPrevious', undefined);
      assert.equal(s.selected, 2);
    });
  });

  describe('next/previous attrForSelected', function() {
    beforeEach(async () => {
      s = await test2Fixture();
    });

    it('selectNext', function() {
      assert.equal(s.selected, 'foo');
      assertAndSelect('selectNext', 'foo');
      assertAndSelect('selectNext', 'bar');
      assertAndSelect('selectNext', 'zot');
      assert.equal(s.selected, 'foo');
    });

    it('selectPrevious', function() {
      assert.equal(s.selected, 'foo');
      assertAndSelect('selectPrevious', 'foo');
      assertAndSelect('selectPrevious', 'zot');
      assertAndSelect('selectPrevious', 'bar');
      assert.equal(s.selected, 'foo');
    });

    it('selectNext/Previous', function() {
      assert.equal(s.selected, 'foo');
      assertAndSelect('selectNext', 'foo');
      assertAndSelect('selectNext', 'bar');
      assertAndSelect('selectPrevious', 'zot');
      assertAndSelect('selectNext', 'bar');
      assertAndSelect('selectPrevious', 'zot');
      assert.equal(s.selected, 'bar');
    });
  });
});
