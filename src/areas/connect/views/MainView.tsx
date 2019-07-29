import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        {this.props.vm.isVisible && <mui.Paper style={styles.paper}>
          <mui.Avatar style={styles.avatar}>
            <app.icons.Person style={styles.avatarIcon} />
          </mui.Avatar>
          <mui.FormGroup>
            <mui.TextField label={app.language.connectServer} required variant="outlined" style={styles.input}
              error={this.props.vm.hasServerError} value={this.props.vm.server}
              onChange={(ev) => this.props.vm.changeServer(ev.currentTarget.value)}
              onKeyDown={(ev) => ev.keyCode === 13 && this.props.vm.tryConnectAsync()} />
            <mui.TextField label={app.language.connectPassword} variant="outlined" style={styles.inputDisabled}
              disabled />
          </mui.FormGroup>
          <mui.Grid style={styles.control}>
            <mui.Button color="primary" variant="contained" onClick={() => this.props.vm.tryConnectAsync()}>
              {app.language.connect}
            </mui.Button>
          </mui.Grid>
        </mui.Paper>}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    top: 0
  },
  paper: {
    left: '50%',
    padding: 16,
    paddingTop: 48,
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320
  },
  avatar: {
    left: '50%',
    height: 64,
    position: 'fixed',
    transform: 'translate(-50%, -50%)',
    top: 0,
    width: 64
  },
  avatarIcon: {
    fontSize: 58,
  },
  input: {
    marginBottom: 8
  },
  inputDisabled: {
    backgroundColor: '#bdbdbd',
    marginBottom: 8
  },
  control: {
    textAlign: 'right'
  }
});
