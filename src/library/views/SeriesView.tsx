import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class SeriesView extends app.BaseComponent<typeof SeriesViewStyles, {vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        <app.SeriesAutomationView vm={this.props.vm.automation} />
        <mui.Paper className={this.classes.container} square={true}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={language.librarySeriesAbout} value={0} />
            <mui.Tab label={`${language.librarySeriesChapters} (${this.props.vm.chapters.items.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid className={this.classes.containerBody}>
          {this.props.vm.showChapters ? <app.SeriesListView vm={this.props.vm.chapters} /> : <mui.Grid>
            <mui.Paper className={this.classes.seriesContent} square={true}>
              <img className={this.classes.seriesImage} src={this.props.vm.imageData} />
              <mui.Typography className={this.classes.seriesSummary}>{this.props.vm.summary || language.librarySeriesSummary}</mui.Typography>
              <mui.Grid className={this.classes.seriesClear} />
            </mui.Paper>
            <mui.Grid className={`inset-bottom ${this.classes.fabContainer}`}>
              <mui.Tooltip title={language.libraryIconRead}>
                <mui.Fab className={this.classes.fabButton} color="primary" onClick={() => this.props.vm.startAsync()}>
                  <app.icons.PlayArrow />
                </mui.Fab>
              </mui.Tooltip>
            </mui.Grid>
          </mui.Grid>}
        </mui.Grid>
      </mui.Grid>
    );
  }
}

export const SeriesViewStyles = mui.createStyles({
  container: app.withLimiter({
    position: 'fixed',
    zIndex: 1
  }),
  containerBody: {
    paddingTop: 48
  },
  seriesContent: {
    padding: 16
  },
  seriesImage: {
    float: 'left',
    height: 238,
    marginRight: 8,
    width: 165
  },
  seriesSummary: {
    wordBreak: 'break-word'
  },
  seriesClear: {
    clear: 'both'
  },
  fabContainer: {
    bottom: 0,
    height: 44,
    position: 'sticky'
  },
  fabButton: {
    bottom: 16,
    position: 'absolute',
    right: 16
  }
});
