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
        <mui.Paper className={this.classes.container} square={true}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={language.remoteSeriesAbout} value={0} />
            <mui.Tab label={`${language.remoteSeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid className={this.classes.containerBody}>
          {!this.props.vm.showChapters && <mui.Grid>
            <mui.Paper className={this.classes.seriesContent} square={true}>
              <app.SeriesImage className={this.classes.seriesImage} src={this.props.vm.image} url={this.props.vm.url} />
              <mui.Typography className={this.classes.seriesSummary}>{this.props.vm.summary || language.remoteSeriesSummary}</mui.Typography>
              <mui.Grid className={this.classes.seriesClear} />
            </mui.Paper>
            <mui.Grid className={`inset-bottom ${this.classes.fabContainer}`}>
              <mui.Tooltip title={language.remoteIconAdd}>
                <mui.Fab className={this.classes.fabButton} color="primary" onClick={() => this.props.vm.addAsync()}>
                  <app.icons.Add />
                </mui.Fab>
              </mui.Tooltip>
              <mui.Tooltip title={language.remoteIconRead}>
                <mui.Fab className={this.classes.fabButton} color="primary" onClick={() => this.props.vm.startAsync()}>
                  <app.icons.PlayArrow />
                </mui.Fab>
              </mui.Tooltip>
            </mui.Grid>
          </mui.Grid>}
          {this.props.vm.showChapters && <mui.Grid>
            <mui.Paper className={this.classes.chapter} square={true}>
              <mui.List>
                <app.LazyListComponent items={this.props.vm.chapters} itemHeight={48} itemsPerBatch={10}>
                  {(chapter) => (
                    <mui.ListItem button key={chapter.url} onClick={() => this.props.vm.openAsync(chapter)}>
                      <mui.ListItemText className={this.classes.chapterText} primary={chapter.title} />
                    </mui.ListItem>
                  )}
                </app.LazyListComponent>
              </mui.List>
            </mui.Paper>
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
  chapter: {
    minHeight: 'calc(100vh - 112px)'
  },
  chapterText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  fabContainer: {
    bottom: 0,
    height: 44,
    paddingRight: 16,
    position: 'sticky',
    textAlign: 'right'
  },
  fabButton: {
    marginLeft: 16,
    marginTop: -28
  }
});
