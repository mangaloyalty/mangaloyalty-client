import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class SeriesIconComponent extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent color="inherit" title={language.remoteIconRead} onClick={() => this.props.vm.startAsync()}>
          <app.icons.PlayArrow />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={language.remoteIconAdd} onClick={() => this.props.vm.addAsync()}>
          <app.icons.AddBox />
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
