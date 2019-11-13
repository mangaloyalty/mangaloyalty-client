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
          <mui.Grid style={styles.pageButtonPrevious}>
            <app.ButtonComponent color="primary" title={language.remotePagePrevious}
              disabled={!this.props.vm.canPagePrevious}
              onClick={() => this.props.vm.pagePreviousAsync()}>
              <app.icons.ArrowBack />
            </app.ButtonComponent>
          </mui.Grid>
          <mui.Grid style={styles.pageButtonNext}>
            <app.ButtonComponent color="primary" title={language.remotePageNext}
              disabled={!this.props.vm.canPageNext}
              onClick={() => this.props.vm.pageNextAsync()}>
              <app.icons.ArrowForward />
            </app.ButtonComponent>
          </mui.Grid>
          <mui.Typography style={styles.pageText}>
            {language.remotePage} {(this.props.vm.currentPage < 10 ? '0' : '') + this.props.vm.currentPage}
          </mui.Typography>
        </mui.Paper>
        <mui.Grid style={styles.content}>
          <app.SeriesListComponent
            emptyBody={language.remoteEmptyBody}
            emptyTitle={language.remoteEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.openAsync(series)} />
        </mui.Grid>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    padding: 6,
    position: 'fixed',
    textAlign: 'center',
    top: 64,
    zIndex: 1
  },
  content: {
    paddingTop: 48
  },
  pageButtonNext: {
    position: 'absolute',
    right: 1,
    top: 0
  },
  pageButtonPrevious: {
    left: 1,
    position: 'absolute',
    top: 0
  },
  pageText: {
    fontSize: 13,
    lineHeight: '36px',
    opacity: 0.7,
    pointerEvents: 'none',
    textTransform: 'uppercase'
  }
});
