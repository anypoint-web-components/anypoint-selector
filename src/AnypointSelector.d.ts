import {LitElement} from 'lit-element';
import {MultiSelectableMixin} from './MultiSelectableMixin';

export declare class AnypointSelector extends MultiSelectableMixin(LitElement) {
  createRenderRoot(): AnypointSelector;
  /**
   * @returns Previously registered handler for `select` event
   */
  onselect: EventListener;
}
