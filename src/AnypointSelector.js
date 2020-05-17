import { LitElement } from 'lit-element';
import { MultiSelectableMixin } from './MultiSelectableMixin.js';

export class AnypointSelector extends MultiSelectableMixin(LitElement) {
  createRenderRoot() {
    return this;
  }
}
