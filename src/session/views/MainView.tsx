import * as app from '..';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  private readonly _containerRef: React.RefObject<HTMLImageElement>;
  private readonly _keyHandler: (ev: KeyboardEvent) => void;
  private readonly _touch: app.Touch;
  private _observableDisposer: () => void;

  constructor(props: {vm: app.MainViewModel}) {
    super(props);
    this._containerRef = React.createRef();
    this._keyHandler = (ev) => this._onKeyEvent(ev);
    this._observableDisposer = () => undefined;
    this._touch = new app.Touch((x, y) => this._onTapEvent(x, y));
  }

  componentDidMount() {
    this.componentDidUpdate();
    this.componentWillReceiveProps(this.props);
    addEventListener('keydown', this._keyHandler);
  }

  componentWillReceiveProps(props: {vm: app.MainViewModel}) {
    this._observableDisposer();
    this._observableDisposer = mobx.observe(props.vm, 'imageNode', (ev) => this._onImageEvent(ev), true);
  }

  componentDidUpdate() {
    if (!this._containerRef.current) return;
    this._touch.attach(this._containerRef.current);
    this._touch.reset();
  }

  componentWillUnmount() {
    removeEventListener('keydown', this._keyHandler);
    this._observableDisposer();
    this._touch.destroy();
  }

  render() {
    return <mui.Grid ref={this._containerRef} style={styles.container} />;
  }

  private _onImageEvent(ev: mobx.IValueDidChange<HTMLImageElement>) {
    if (!this._containerRef.current) return;
    Object.assign(ev.newValue.style, styles.image);
    this._removeFirstChild(this._containerRef.current);
    this._containerRef.current.appendChild(ev.newValue);
    this._touch.reset();
  }

  private _onKeyEvent(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'ArrowLeft':
      case 'Left':
        if (app.core.screen.loadCount) return;
        this.props.vm.pressNextAsync();
        break;
      case 'ArrowRight':
      case 'Right':
        if (app.core.screen.loadCount) return;
        this.props.vm.pressPreviousAsync();
        break;
    }
  }

  private _onTapEvent(x: number, y: number) {
    const tresholdX = innerWidth / 2;
    const tresholdY = innerHeight / 3;
    if (y < tresholdY) {
      this.props.vm.toggleControls();
    } else if (x < tresholdX) {
      this.props.vm.pressNextAsync();
    } else {
      this.props.vm.pressPreviousAsync();
    }
  }

  private _removeFirstChild(container: HTMLElement) {
    const firstElementChild = container.firstElementChild;
    if (firstElementChild) container.removeChild(firstElementChild);
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    top: 0
  },
  image: {
    left: '50%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
