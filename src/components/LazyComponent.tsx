import * as app from '..';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class LazyComponent<T> extends React.Component<{children: (item: T) => React.ReactElement<any>, query: app.LazyQuery<T>, x?: number, y?: number}> {
  private readonly _eventHandler: () => void;
  private _children?: HTMLElement[];
  private _container?: HTMLDivElement;
  private _scrollable?: HTMLElement;

  constructor(props: {children: (item: T) => React.ReactElement<any>, query: app.LazyQuery<T>, x?: number, y?: number}) {
    super(props);
    this._eventHandler = this._update.bind(this);
  }

  componentWillReceiveProps(props: {query: app.LazyQuery<T>}) {
    if (this.props.query === props.query) return;
    this._removeChildren();
  }

  componentDidUpdate() {
    this._update();
  }

  componentWillUnmount() {
    this._detachHandlers();
    this._removeChildren();
  }

  render() {
    return <div ref={this._switchReference.bind(this)}></div>;
  }

  private _attachHandlers() {
    addEventListener('resize', this._eventHandler);
    addEventListener('scroll', this._eventHandler);
    if (this._scrollable) this._scrollable.addEventListener('scroll', this._eventHandler);
  }

  private _detachHandlers() {
    removeEventListener('resize', this._eventHandler);
    removeEventListener('scroll', this._eventHandler);
    if (this._scrollable) this._scrollable.removeEventListener('scroll', this._eventHandler);
  }

  private _removeChildren() {
    if (!this._children || !this._container) return;
    this._children.forEach(this._container.removeChild.bind(this._container));
    drainComponents(this._children);
    this._children = [];
  }

  private _switchReference(container: HTMLDivElement | null) {
    this._removeChildren();
    this._detachHandlers();
    this._children = [];
    this._container = container && container || undefined;
    this._scrollable = container && fetchScrollable(container) || undefined;
    this._attachHandlers();
    this._update();
  }

  private _update() {
    if (!this._children || !this._container || !this.props.query.hasItem()) return;
    if (!isEndInViewPort(this._container, this._scrollable, this.props.x, this.props.y) && this._children.length) return;
    const child = document.createElement('div');
    this._children.push(child);
    this._container.appendChild(child);
    ReactDOM.render(this.props.children(this.props.query.getItem()), child, this._eventHandler);
  }
}

function drainComponents(children: HTMLElement[]) {
  if (!children.length) return;
  for (let i = 0; i < 10 && children.length; i++) ReactDOM.unmountComponentAtNode(children.shift()!);
  requestAnimationFrame(() => drainComponents(children));
}

function fetchScrollable(container: HTMLElement): HTMLElement | undefined {
  const canScroll = (value: string | null) => /^auto|scroll$/.test(value || '');
  const style = getComputedStyle(container);
  if (canScroll(style.overflow) || canScroll(style.overflowX) || canScroll(style.overflowY)) return container;
  return container.parentElement && fetchScrollable(container.parentElement) || undefined;
}

function isEndInViewPort(container: HTMLElement, scrollable?: HTMLElement, x?: number, y?: number) {
  const containerRectangle = container.getBoundingClientRect();
  const containerBottom = containerRectangle.bottom + pageYOffset - (y || 0);
  const containerRight = containerRectangle.right + pageXOffset - (x || 0);
  if (scrollable && scrollable !== document.body) {
    const scrollableRectangle = scrollable.getBoundingClientRect();
    const scrollableTop = scrollableRectangle.top + pageYOffset;
    const scrollableLeft = scrollableRectangle.left + pageXOffset;
    const scrollableBottom = scrollableTop + scrollable.offsetHeight;
    const scrollableRight = scrollableLeft + scrollable.offsetWidth;
    return containerBottom <= scrollableBottom && containerRight <= scrollableRight;
  } else {
    const windowTop = pageYOffset;
    const windowLeft = pageXOffset;
    const windowBottom = windowTop + innerHeight;
    const windowRight = windowLeft + innerWidth;
    return containerBottom <= windowBottom && containerRight <= windowRight;
  }
}
