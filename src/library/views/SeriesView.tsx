import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

// TODO: Automation configuration.
// TODO: Lazy load on series view (get next pages).

// TODO: Soft delete? Just clean out the files to save space, patch automation to stop sync, but keep progress and listing?
// TODO: Source? Which provider?
// TODO: Status? Completed/Ongoing. Not in listing to keep library+remote consistent?
// TODO: unreadcount shown on image?
// TODO: Quick overview to continue reading (e.g. show 5 chapters of upcoming stuff that is unread)
@mobxReact.observer
export class SeriesView extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={language.librarySeriesAbout} value={0} />
            <mui.Tab label={`${language.librarySeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid style={styles.containerBody}>
          {!this.props.vm.showChapters && <mui.Paper style={styles.seriesContent}>
            <img src={`data:;base64, ${this.props.vm.image}`} style={styles.seriesImage} />
            <mui.Typography style={styles.seriesSummary}>{this.props.vm.summary || language.librarySeriesSummary}</mui.Typography>
            <mui.Grid style={styles.seriesClear} />
          </mui.Paper>}
          {this.props.vm.showChapters && <mui.Paper style={styles.chapterContainer}>
            <mui.List>
              {this.props.vm.chapters.map((chapter) => (
                <app.ChapterView key={chapter.id} vm={chapter} />
              ))}
            </mui.List>
          </mui.Paper>}
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
  containerBody: {
    paddingTop: 48
  },
  seriesContent: {
    padding: 16
  },
  seriesImage: {
    float: 'left',
    marginRight: 8,
    width: 165
  },
  seriesSummary: {
    wordBreak: 'break-word'
  },
  seriesClear: {
    clear: 'both'
  },
  chapterContainer: {
    padding: 8
  }
});
