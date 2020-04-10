import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends app.BaseComponent<typeof MainViewStyles, {vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper className={this.classes.container} square={true}>
          <mui.Grid className={this.classes.pageButtonPrevious}>
            <app.ButtonComponent color="primary" title={language.remotePagePrevious}
              disabled={!this.props.vm.canPagePrevious}
              onClick={() => this.props.vm.pagePreviousAsync()}>
              <app.icons.ArrowBack />
            </app.ButtonComponent>
          </mui.Grid>
          <mui.Grid className={this.classes.pageButtonNext}>
            <app.ButtonComponent color="primary" title={language.remotePageNext}
              disabled={!this.props.vm.canPageNext}
              onClick={() => this.props.vm.pageNextAsync()}>
              <app.icons.ArrowForward />
            </app.ButtonComponent>
          </mui.Grid>
          <mui.Typography className={this.classes.pageText}>
            {language.remotePage} {(this.props.vm.currentPage < 10 ? '0' : '') + this.props.vm.currentPage}
          </mui.Typography>
        </mui.Paper>
        <mui.Paper className={this.classes.content} square={true}>
          <app.SeriesListComponent
            emptyBody={language.remoteEmptyBody}
            emptyTitle={language.remoteEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.openAsync(series)} />
        </mui.Paper>
      </mui.Grid>
    );
  }
}

export const MainViewStyles = mui.createStyles({
  container: app.withLimiter({
    padding: 6,
    position: 'fixed',
    textAlign: 'center',
    zIndex: 1
  }),
  content: {
    minHeight: 'calc(100vh - 64px)',
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
