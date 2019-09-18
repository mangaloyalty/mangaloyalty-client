import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={this.props.vm.provider.name}
            onChange={(_, providerName) => this.props.vm.changeProviderAsync(providerName)}>
            {app.settings.providerNames.map((providerName) => (
              <mui.Tab key={providerName} label={providerName} value={providerName} />
            ))}
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid style={styles.content}>
          <app.ProviderView vm={this.props.vm.provider} />
        </mui.Grid>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    position: 'fixed',
    top: 64,
    zIndex: 1
  },
  content: {
    paddingTop: 48
  }
});
