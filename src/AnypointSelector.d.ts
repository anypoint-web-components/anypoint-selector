import {LitElement} from 'lit-element';
import {MultiSelectableMixin} from './MultiSelectableMixin';

export declare class AnypointSelector {
  createRenderRoot(): AnypointSelector;
}
export interface AnypointSelector extends MultiSelectableMixin, LitElement {
 /**
   * @returns Previously registered handler for `select` event
   */
  onselect: EventListener;
}
