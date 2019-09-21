import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderComponent extends React.Component<{defaultSearch?: string, icon?: React.ReactElement<any>, title: string, onBack?: () => void, onSearch?: (value: string) => void}> {
  state = {
    showSearch: Boolean(this.props.defaultSearch && this.props.onSearch)
  };
    
  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="disablePadding">
          {this.state.showSearch
            ? <app.HeaderSearchBarComponent icon={this.props.icon} defaultSearch={this.props.defaultSearch}
                onClose={() => Boolean(this.setState({showSearch: false})) || this.props.onSearch!('')}
                onSearch={(value) => this.props.onSearch!(value)} />
            : <app.HeaderTitleBarComponent icon={this.props.icon} title={this.props.title}
                onBack={this.props.onBack}
                onSearch={this.props.onSearch && (() => this.setState({showSearch: true}))} />}
        </mui.AppBar>
        <mui.Grid className="ios-inset-top ios-inset-bottom">
          <mui.Grid style={{...styles.children, ...app.limiter}}>
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
