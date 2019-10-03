import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper square={true} style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={this.props.vm.providerName}
            onChange={(_, providerName) => this.props.vm.changeProviderAsync(providerName)}>
            {app.settings.providerNames.map((providerName) => (
              <mui.Tab key={providerName} label={providerName} value={providerName} />
            ))}
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid style={styles.content}>
          <app.SeriesListComponent
            emptyBody={language.remoteEmptyBody}
            emptyTitle={language.remoteEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.openAsync(series.url)} />
          <app.SeriesPagerComponent
            canPageNext={this.props.vm.canPageNext}
            canPagePrevious={this.props.vm.canPagePrevious}
            currentPage={this.props.vm.currentPage}
            pageNext={() => this.props.vm.pageNextAsync()}
            pagePrevious={() => this.props.vm.pagePreviousAsync()} />
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
