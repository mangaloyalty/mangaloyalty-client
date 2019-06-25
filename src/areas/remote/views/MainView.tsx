import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper>
          <mui.Tabs fullWidth indicatorColor="primary" value={this.props.vm.provider.name} onChange={(_, providerName) => this.props.vm.changeProvider(providerName)}>
            {this.props.vm.providerNames.map((providerName) => <mui.Tab key={providerName} label={providerName} value={providerName} />)}
          </mui.Tabs>
        </mui.Paper>
        <area.ProviderView vm={this.props.vm.provider} />
      </mui.Grid>
    );
  }
}
