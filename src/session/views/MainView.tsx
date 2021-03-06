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
  private _reactionDisposer: () => void;

  constructor(props: {vm: app.MainViewModel}) {
    super(props);
    this._containerRef = React.createRef();
    this._keyHandler = (ev) => this._reassignKeyEvent(ev);
    this._reactionDisposer = () => undefined;
    this._touch = new app.Touch((ev) => this._reassignTouchEvent(ev));
  }

  componentDidMount() {
    this.componentDidUpdate();
    this.componentWillReceiveProps(this.props);
    addEventListener('keydown', this._keyHandler);
  }

  componentWillReceiveProps(props: {vm: app.MainViewModel}) {
    this._reactionDisposer();
    this._reactionDisposer = mobx.reaction(() => props.vm.imageNode, (imageNode) => this._onImageNode(imageNode), {fireImmediately: true});
  }

  componentDidUpdate() {
    if (!this._containerRef.current) return;
    this._touch.attach(this._containerRef.current);
    this._touch.reset();
  }

  componentWillUnmount() {
    removeEventListener('keydown', this._keyHandler);
    this._reactionDisposer();
    this._touch.destroy();
  }

  render() {
    return <mui.Grid className={this.classes.container} ref={this._containerRef} />;
  }

  private _isBusy() {
    if (app.core.dialog.isChildVisible) return true;
    if (app.core.screen.loadCount) return true;
    if (this.props.vm.settings.showDialog) return true;
    return false;
  }

  private _onImageNode(imageNode: HTMLCanvasElement | HTMLImageElement) {
    imageNode.className = this.classes.image;
    if (this._containerRef.current && this._containerRef.current.firstElementChild) {
      this._containerRef.current.replaceChild(imageNode, this._containerRef.current.firstElementChild);
      this._touch.reset();
    } else if (this._containerRef.current) {
      this._containerRef.current.appendChild(imageNode);
      this._touch.reset();
    }
  }

  private _onKeyboardEvent(direction: app.DirectionType) {   
    switch (direction) {
      case app.DirectionType.Up:
        if (this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Right:
        this._tryNavigateRight();
        break;
      case app.DirectionType.Down:
        if (!this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Left:
        this._tryNavigateLeft();
        break;
    }
  }

  private _onSwipeEvent(direction: app.DirectionType) {
    switch (direction) {
      case app.DirectionType.Up:
        if (this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Right:
        this._tryNavigateLeft(true);
        break;
      case app.DirectionType.Down:
        if (!this.props.vm.showControls) break;
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Left:
        this._tryNavigateRight(true);
        break;
    }
  }

  private _onTapEvent(direction: app.DirectionType) {
    switch (direction) {
      case app.DirectionType.Up:
        this.props.vm.toggleControls();
        break;
      case app.DirectionType.Right:
        this._tryNavigateRight();
        break;
      case app.DirectionType.Left:
        this._tryNavigateLeft();
        break;
    }
  }

  private _reassignKeyEvent(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'ArrowUp':
      case 'Up':
        if (this._isBusy()) return;
        this._onKeyboardEvent(app.DirectionType.Up);
        break;
      case 'ArrowRight':
      case 'Right':
      case 'PageDown':
        if (this._isBusy()) return;
        this._onKeyboardEvent(app.DirectionType.Right);
        break;
      case 'ArrowDown':
      case 'Down':
        if (this._isBusy()) return;
        this._onKeyboardEvent(app.DirectionType.Down);
        break;
      case 'ArrowLeft':
      case 'Left':
      case 'PageUp':
        if (this._isBusy()) return;
        this._onKeyboardEvent(app.DirectionType.Left);
        break;
    }
  }

  private _reassignTouchEvent(ev: app.INavigationEvent) {
    switch (ev.type) {
      case 'Swipe':
        if (this._isBusy()) return;
        this._onSwipeEvent(ev.direction);
        break;
      case 'Tap':
        if (this._isBusy()) return;
        this._onTapEvent(ev.direction);
        break;
    }
  }

  private _tryNavigateLeft(skipOneHanded?: boolean) {
    if (!skipOneHanded && this.props.vm.settings.optionOneHanded) {
      this.props.vm.pageNextAsync();
    } else if (this.props.vm.settings.optionRightToLeft) {
      this.props.vm.pageNextAsync();
    } else {
      this.props.vm.pagePreviousAsync();
    }
  }

  private _tryNavigateRight(skipOneHanded?: boolean) {
    if (!skipOneHanded && this.props.vm.settings.optionOneHanded) {
      this.props.vm.pageNextAsync();
    } else if (this.props.vm.settings.optionRightToLeft) {
      this.props.vm.pagePreviousAsync();
    } else {
      this.props.vm.pageNextAsync();
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
