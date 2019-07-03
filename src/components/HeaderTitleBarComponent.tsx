import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderTitleBarComponent extends React.Component<{menu?: React.ReactElement<any>, title: string, onBack?: () => void, onSearch?: () => void}> {
  render() {
    return (
      <mui.Toolbar>
        {this.props.onBack && <mui.IconButton color="inherit" style={styles.back} onClick={() => this.props.onBack!()}>
          <app.icons.ArrowBackIos />
        </mui.IconButton>}
        <mui.Typography color="inherit" variant="h6" style={styles.title}>
          {this.props.title}
        </mui.Typography>
        <mui.Grid style={styles.menu}>
          {this.props.onSearch && <mui.IconButton color="inherit" onClick={() => this.props.onSearch!()}>
            <app.icons.Search />
          </mui.IconButton>}
          {this.props.menu && <app.HeaderMenuComponent menu={this.props.menu} />}
        </mui.Grid>
      </mui.Toolbar>
    );
  }
}


const styles = app.styles({
  back: {
    marginLeft: -20,
    marginRight: 8,
    paddingLeft: 16,
    paddingRight: 6
  },
  title: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  menu: {
    marginRight: -20
  }
});
