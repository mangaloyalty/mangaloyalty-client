import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class HeaderSearchBarComponent extends React.Component<{defaultSearch?: string, icon?: React.ReactElement<any>, showBack: boolean, onClose: () => void, onSearch: (value: string) => void}> {
  render() {
    return (
      <mui.Toolbar className="ios-inset-top" style={app.limiter}>
        {this.props.showBack && <app.ButtonComponent title={language.iconBack} style={styles.back} onClick={() => this.props.onClose()}>
          <app.icons.ArrowBackIos />
        </app.ButtonComponent>}
        <mui.InputBase autoFocus={!Boolean(this.props.defaultSearch)} defaultValue={this.props.defaultSearch} fullWidth style={styles.title}
          onBlur={(ev) => ((value) => value ? this.props.onSearch(value) : this.props.onClose())((ev.currentTarget as HTMLInputElement).value)}
          onKeyDown={(ev) => ev.keyCode === 13 && ev.currentTarget.blur()} />
        <mui.Grid style={styles.menu}>
          <app.ButtonComponent title={language.iconClose} onClick={() => this.props.onClose()}>
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
    marginLeft: -16,
    marginRight: 4,
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
