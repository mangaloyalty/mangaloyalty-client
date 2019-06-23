import * as mobx from 'mobx';

export class CounterViewModel {
  @mobx.action
  decrement() {
    this.value--;
  }

  @mobx.action
  increment() {
    this.value++;
  }

  @mobx.observable
  value = 0;
}
