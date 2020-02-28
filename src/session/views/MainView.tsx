import * as app from '..';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends app.BaseComponent<typeof MainViewStyles, {vm: app.MainViewModel}> {
  private readonly _containerRef: React.RefObject<HTMLImageElement>;
  private readonly _keyHandler: (ev: KeyboardEvent) => void;
  private readonly _touch: app.Touch;
  private _observableDisposer: () => void;

  constructor(props: {vm: app.MainViewModel}) {
    super(props);
    this._containerRef = React.createRef();
    this._keyHandler = (ev) => this._onKeyEvent(ev);
    this._observableDisposer = () => undefined;
    this._touch = new app.Touch((ev) => this._onTouchEvent(ev));
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
    return <mui.Grid className={this.classes.container} ref={this._containerRef} />;
  }

  private _onImageEvent(ev: mobx.IValueDidChange<HTMLImageElement>) {
    ev.newValue.className = this.classes.image;
    if (this._containerRef.current && this._containerRef.current.firstElementChild) {
      this._containerRef.current.replaceChild(ev.newValue, this._containerRef.current.firstElementChild);
      this._touch.reset();
    } else if (this._containerRef.current) {
      this._containerRef.current.appendChild(ev.newValue);
      this._touch.reset();
    }
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

  private _onTouchEvent(ev: app.ITouchEvent) {
    switch (ev.type) {
      case 'Swipe':
        if (app.core.screen.loadCount) break;
        this._onTouchEventSwipe(ev.direction);
        break;
      case 'Tap':
        if (app.core.screen.loadCount) break;
        this._onTouchEventTap(ev.x, ev.y);
        break;
    }
  }

  private _onTouchEventSwipe(direction: app.DirectionType) {
    switch (direction) {
      case app.DirectionType.Up:
        if (this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Down:
        if (!this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Left:
        this.props.vm.pressPreviousAsync();
        break;
      case app.DirectionType.Right:
      this.props.vm.pressNextAsync();
      break;
    }
  }

  private _onTouchEventTap(x: number, y: number) {
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
}

export const MainViewStyles = mui.createStyles({
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
