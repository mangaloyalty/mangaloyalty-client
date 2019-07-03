import * as app from '..';
import * as React from 'react';
const core = app.core;

export abstract class RefreshComponent extends React.Component<{onRefresh: () => void}> {
  private readonly _container: React.RefObject<HTMLDivElement>;
  private readonly _handler: () => void;
  
  constructor(props: {onRefresh: () => void}) {
    super(props);
    this._container = React.createRef();
    this._handler = this._onFocus.bind(this);
  }

  componentDidMount() {
    window.addEventListener('focus', this._handler);
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this._handler);
  }

  render() {
    return (
      <div ref={this._container}>
        {this.props.children}
      </div>
    );
  }

  private _onFocus() {
    if (core.dialog.items.length) return;
    if (!this._container.current || !this._container.current.offsetHeight) return;
    this.props.onRefresh();
  }
}
