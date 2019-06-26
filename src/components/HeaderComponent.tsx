import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderComponent extends React.Component<{additionalMenu?: React.ReactElement<any>, showDisconnect?: boolean, title: string, onSearch?: (value: string) => void}> {
  state = {
    showSearch: false
  };

  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="ios-inset-top">
          {this.state.showSearch
            ? <app.SearchComponent additionalMenu={this.props.additionalMenu} showDisconnect={this.props.showDisconnect} 
                onClose={() => this._onClose()}    
                onSearch={(value) => this.props.onSearch && this.props.onSearch(value)} />
            : <mui.Toolbar>
            <mui.Typography color="inherit" variant="h6" style={styles.container}>
              {this.props.title}
            </mui.Typography>
            <mui.Grid style={styles.menu}>
              {this.props.onSearch && <mui.IconButton color="inherit" onClick={() => this.setState({showSearch: !this.state.showSearch})}>
                <app.icons.Search />
              </mui.IconButton>}
              <app.MenuComponent additionalMenu={this.props.additionalMenu} showDisconnect={this.props.showDisconnect} />
            </mui.Grid>
          </mui.Toolbar>}
        </mui.AppBar>
        <mui.Grid className="ios-inset-top ios-inset-bottom">
          <mui.Grid style={styles.children}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }

  private _onClose() {
    if (!this.props.onSearch) return;
    this.props.onSearch!('');
    this.setState({showSearch: false});
  }
}

const styles = app.styles({
  container: {
    flex: 1
  },
  menu: {
    marginRight: -20
  },
  children: {
    paddingTop: 64
  }
});
