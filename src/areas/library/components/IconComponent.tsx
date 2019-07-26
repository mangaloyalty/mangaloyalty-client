import * as app from '../../..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class IconComponent extends React.Component<{onRefresh: () => void}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent title={app.language.remoteIconRefresh} onClick={() => this.props.onRefresh()}>
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
