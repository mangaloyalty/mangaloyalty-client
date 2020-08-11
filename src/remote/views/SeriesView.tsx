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
            <mui.Tab label={`${language.remoteSeriesChapters} (${this.props.vm.chapters.length})`} disabled={!this.props.vm.chapters.length} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid className={this.classes.containerBody}>
          {!this.props.vm.showChapters && <mui.Grid>
            <mui.Paper className={this.classes.seriesContent} square={true}>
              <app.SeriesImage className={this.classes.seriesContentImage} imageAsync={() => app.core.context.remote.imageAsync(this.props.vm.imageId)} url={this.props.vm.url} />
              <mui.Typography className={this.classes.seriesContentSummary}>{this.props.vm.summary || language.remoteSeriesSummary}</mui.Typography>
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
            <mui.Paper className={this.classes.seriesInfo} square={true}>
              <mui.Grid className={this.classes.seriesInfoGenre}>
                {this.props.vm.genres.map((genre, i) => <mui.Chip key={i} label={genre} />)}
              </mui.Grid>
            </mui.Paper>
            <mui.Paper className={this.classes.seriesInfo} square={true}>
              <mui.Table>
                <mui.TableBody>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.remoteSeriesInfoAuthor}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.authors.join(', ')}</mui.TableCell>
                  </mui.TableRow>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.remoteSeriesInfoStatus}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.isCompleted ? language.remoteSeriesInfoStatusCompleted : language.remoteSeriesInfoStatusOngoing}</mui.TableCell>
                  </mui.TableRow>  
                </mui.TableBody>
              </mui.Table>
            </mui.Paper>
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
  seriesContentImage: {
    float: 'left',
    height: 238,
    marginRight: 8,
    width: 165
  },
  seriesContentSummary: {
    height: 238,
    overflowY: 'auto',
    wordBreak: 'break-word'
  },
  chapter: {
    minHeight: 'calc(100vh - 112px)'
  },
  chapterText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  seriesInfo: {
    marginTop: 16
  },
  seriesInfoGenre: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    '& > *': {margin: 4}
  },
  seriesInfoKey: {
    paddingRight: 0,
    width: 144
  },
  fabContainer: {
    bottom: 0,
    height: 44,
    marginBottom: -44,
    paddingRight: 16,
    position: 'sticky',
    textAlign: 'right'
  },
  fabButton: {
    marginLeft: 16,
    marginTop: -28
  }
});
