import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class MainIconComponent extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={language.libraryIconRemote} onClick={() => this.props.vm.openRemoteAsync()}>
          <app.icons.Public />
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
