import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderComponent extends React.Component<{menu?: React.ReactElement<any>, title: string, onBack?: () => void, onSearch?: (value: string) => void}> {
  state = {
    showSearch: false
  };

  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="disablePadding ios-inset-top">
          {this.state.showSearch
            ? <app.HeaderSearchBarComponent menu={this.props.menu}
                onClose={() => Boolean(this.props.onSearch!('')) || this.setState({showSearch: false})}
                onSearch={(value) => this.props.onSearch!(value)} />
            : <app.HeaderTitleBarComponent menu={this.props.menu} title={this.props.title}
                onBack={this.props.onBack}
                onSearch={this.props.onSearch && (() => this.setState({showSearch: true}))} />}
        </mui.AppBar>
        <mui.Grid className="ios-inset-top ios-inset-bottom">
          <mui.Grid style={styles.children}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  children: {
    paddingTop: 64
  }
});
