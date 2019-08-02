import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: Merge displays as much as possible...
// TODO: Source? Which provider?
// TODO: Status? Completed/Ongoing. Not in listing to keep library+remote consistent?
// TODO: unreadcount shown on image?
// TODO: Per chapter, read/unread?
// TODO: instead of chevrons, use italic to show text is clickable?
// TODO: Quick overview to continue reading (e.g. show 5 chapters of upcoming stuff that is unread)
@mobxReact.observer
export class SeriesView extends React.Component<{vm: area.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.chapters && <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={app.language.librarySeriesAbout} value={0} />
            <mui.Tab label={`${app.language.librarySeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>}
        {this.props.vm.chapters && <mui.Grid style={styles.containerBody}>
          {!this.props.vm.showChapters && <mui.Grid>
            <mui.Paper style={styles.seriesContent}>
              <img src={`data:;base64, ${this.props.vm.image}`} style={styles.seriesImage} />
              <mui.Typography style={styles.seriesSummary}>{this.props.vm.summary || app.language.librarySeriesSummary}</mui.Typography>
              <mui.Grid style={styles.seriesClear} />
            </mui.Paper>
          </mui.Grid>}
          {this.props.vm.showChapters && <mui.Paper style={styles.chapterContainer}>
            <mui.Grid style={{height: 44 * this.props.vm.chapters.length}}>
              <app.LazyComponent query={new app.LazyQuery(this.props.vm.chapters)} y={1680}>
                {(chapter) => (
                  <mui.Grid style={styles.chapterContent} onClick={() => chapter.openAsync()}>
                    <mui.Typography variant="subtitle1" style={chapter.isUnread ? styles.chapterUnread : styles.chapterRead}>
                      {chapter.title}
                    </mui.Typography>
                    <mui.Icon style={styles.chapterIcon}>
                      <app.icons.ChevronRight />
                    </mui.Icon>
                  </mui.Grid>
                )}
              </app.LazyComponent>
            </mui.Grid>
          </mui.Paper>}
        </mui.Grid>}
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
  },
  chapterContent: {
    cursor: 'pointer',
    padding: 8,
    paddingRight: 24,
    position: 'relative',
  },
  chapterRead: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chapterUnread: {
    color: app.theme.palette.secondary.main,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chapterIcon: {
    position: 'absolute',
    right: 0,
    top: 8
  }
});
