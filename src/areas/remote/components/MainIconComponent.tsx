import * as app from '../../..';
import * as area from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class MainIconComponent extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={app.language.remoteIconRefresh} onClick={() => this.props.vm.refreshAsync()}>
          <app.icons.Refresh />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'inline-block'
  }
});
