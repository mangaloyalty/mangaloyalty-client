import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class RefreshComponent extends React.Component<{onRefresh: () => void}> {
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
      <mui.Grid ref={this._container}>
        {this.props.children}
      </mui.Grid>
    );
  }

  private _onFocus() {  
    if (!this._container.current || !this._container.current.offsetHeight) return;
    if (!app.core.dialog.isChildVisible) this.props.onRefresh();
  }
}
