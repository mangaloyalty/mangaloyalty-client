import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class HeaderSearchBarComponent extends React.Component<{icon?: React.ReactElement<any>, onClose: () => void, onSearch: (value: string) => void}> {
  render() {
    return (
      <mui.Toolbar className="ios-inset-top" style={app.limiter}>
        <app.ButtonComponent title={app.language.basicIconBack} style={styles.back} onClick={() => this.props.onClose()}>
          <app.icons.ArrowBackIos />
        </app.ButtonComponent>
        <mui.InputBase autoFocus fullWidth style={styles.title}
          onBlur={(ev) => ((value) => value ? this.props.onSearch(value) : this.props.onClose())((ev.currentTarget as HTMLInputElement).value)}
          onKeyDown={(ev) => ev.keyCode === 13 && ev.currentTarget.blur()} />
        <mui.Grid style={styles.menu}>
          <app.ButtonComponent title={app.language.basicIconClose} onClick={() => this.props.onClose()}>
            <app.icons.Close />
          </app.ButtonComponent>
          {this.props.icon}
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
    color: app.theme.palette.primary.contrastText,
    flex: 1,
    fontSize: '1.25rem',
    fontWeight: 500
  },
  menu: {
    marginRight: -20
  }
});
