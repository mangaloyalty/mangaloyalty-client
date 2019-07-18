import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class SeriesView extends React.Component<{vm: area.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.chapters && <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={app.language.remoteSeriesAbout} value={0} />
            <mui.Tab label={`${app.language.remoteSeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>}
        {this.props.vm.chapters && <mui.Grid style={styles.containerBody}>
          {!this.props.vm.showChapters && <mui.Grid>
            <mui.Paper style={styles.seriesContent}>
              <img src={`data:;base64, ${this.props.vm.image}`} style={styles.seriesImage} />
              <mui.Typography style={styles.seriesSummary}>{this.props.vm.summary || app.language.remoteSeriesSummary}</mui.Typography>
              <mui.Grid style={styles.seriesClear} />
            </mui.Paper>
          </mui.Grid>}
          {this.props.vm.showChapters && <mui.Paper style={styles.chapterContent}>
            <mui.Grid style={{height: 44 * this.props.vm.chapters.length}}>
              <app.LazyComponent query={new app.LazyQuery(this.props.vm.chapters)} y={1680}>
                {(chapter) => (
                  <mui.Typography variant="subtitle1" style={styles.chapterItem} onClick={() => this.props.vm.openAsync(chapter)}>
                    {chapter.title}
                    <mui.Icon style={styles.chapterIcon}>
                      <app.icons.ChevronRight />
                    </mui.Icon>
                  </mui.Typography>
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
    width: 164
  },
  seriesSummary: {
    wordBreak: 'break-word'
  },
  seriesClear: {
    clear: 'both'
  },
  chapterContent: {
    padding: 8
  },
  chapterItem: {
    cursor: 'pointer',
    overflow: 'hidden',
    padding: 8,
    paddingRight: 24,
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chapterIcon: {
    position: 'absolute',
    right: 0,
    top: 4
  }
});
