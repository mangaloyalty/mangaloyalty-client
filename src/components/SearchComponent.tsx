import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SearchComponent extends React.Component<{additionalMenu?: React.ReactElement<any>, showDisconnect?: boolean, onClose: () => void, onSearch: (value: string) => void}> {
  render() {
    return (
      <mui.AppBar className="ios-inset-top">
        <mui.Toolbar>
          <mui.InputBase autoFocus fullWidth style={styles.container}
            onBlur={this._onBlur.bind(this)}
            onKeyDown={this._onKeyDown.bind(this)} />
          <mui.Grid style={styles.menu}>
            <mui.IconButton color="inherit" onClick={this.props.onClose}>
              <app.icons.Close />
            </mui.IconButton>
            <app.MenuComponent additionalMenu={this.props.additionalMenu} showDisconnect={this.props.showDisconnect} />
          </mui.Grid>
        </mui.Toolbar>
      </mui.AppBar>
    );
  }

  private _onBlur(ev: React.FocusEvent<HTMLInputElement>) {
    if (!this.props.onSearch) return;
    this.props.onSearch(ev.currentTarget.value);
  }

  private _onKeyDown(ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (ev.keyCode !== 13) return;
    ev.currentTarget.blur();
  }
}

const styles = app.styles({ 
  container: {
    color: app.theme.palette.primary.contrastText,
    flex: 1,
    fontSize: '1.25rem',
    fontWeight: 500
  },
  menu: {
    marginRight: -20
  }
});
