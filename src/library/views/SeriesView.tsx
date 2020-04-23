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
            <mui.Tab label={language.librarySeriesAbout} value={0} />
            <mui.Tab label={`${language.librarySeriesChapters} (${this.props.vm.chapters.items.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid className={this.classes.containerBody}>
          {this.props.vm.showChapters ? <app.SeriesListView vm={this.props.vm.chapters} /> : <mui.Grid>
            <mui.Paper className={this.classes.seriesContent} square={true}>
              <app.SeriesImage className={this.classes.seriesContentImage} src={this.props.vm.image} unreadCount={this.props.vm.chapters.unreadCount} url={this.props.vm.source.url} />
              <mui.Typography className={this.classes.seriesContentSummary}>{this.props.vm.source.summary || language.librarySeriesSummary}</mui.Typography>
              <mui.Grid className={this.classes.seriesContentClear} />
            </mui.Paper>
            <mui.Grid className={`inset-bottom ${this.classes.fabContainer}`}>
              <mui.Tooltip title={language.libraryIconRead}>
                <mui.Fab className={this.classes.fabButton} color="primary" onClick={() => this.props.vm.startAsync()}>
                  <app.icons.PlayArrow />
                </mui.Fab>
              </mui.Tooltip>
            </mui.Grid>
            <mui.Paper className={this.classes.seriesInfo} square={true}>
              <mui.Grid className={this.classes.seriesInfoGenre}>
                {this.props.vm.source.genres.map((genre, i) => <mui.Chip key={i} label={genre} />)}
              </mui.Grid>
            </mui.Paper>
            <mui.Paper className={this.classes.seriesInfo} square={true}>
              <mui.Table>
                <mui.TableBody>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoAuthor}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.source.authors.join(', ')}</mui.TableCell>
                  </mui.TableRow>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoStatus}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.source.isCompleted ? language.librarySeriesInfoStatusCompleted : language.librarySeriesInfoStatusOngoing}</mui.TableCell>
                  </mui.TableRow>  
                </mui.TableBody>
              </mui.Table>
            </mui.Paper>
            <mui.Paper className={this.classes.seriesInfo} square={true}>
              <mui.Table>
                <mui.TableBody>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoAddedAt}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.addedAt}</mui.TableCell>
                  </mui.TableRow>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoLastChapterAddedAt}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.lastChapterAddedAt}</mui.TableCell>
                  </mui.TableRow>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoLastPageReadAt}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.lastPageReadAt}</mui.TableCell>
                  </mui.TableRow>
                  <mui.TableRow>
                    <mui.TableCell className={this.classes.seriesInfoKey}>{language.librarySeriesInfoLastSyncAt}</mui.TableCell>
                    <mui.TableCell>{this.props.vm.lastSyncAt}</mui.TableCell>
                  </mui.TableRow>
                </mui.TableBody>
              </mui.Table>
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
    wordBreak: 'break-word'
  },
  seriesContentClear: {
    clear: 'both'
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
    position: 'sticky'
  },
  fabButton: {
    bottom: 16,
    position: 'absolute',
    right: 16
  }
});
