import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class SeriesView extends React.Component<{vm: app.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={language.remoteSeriesAbout} value={0} />
            <mui.Tab label={`${language.remoteSeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid style={styles.containerBody}>
          {!this.props.vm.showChapters && <mui.Paper style={styles.seriesContent}>
            <img src={`data:;base64, ${this.props.vm.image}`} style={styles.seriesImage} />
            <mui.Typography style={styles.seriesSummary}>{this.props.vm.summary || language.remoteSeriesSummary}</mui.Typography>
            <mui.Grid style={styles.seriesClear} />
            <mui.Tooltip title={language.remoteIconMenuAdd}>
              <mui.Fab color="primary" style={styles.seriesAction} onClick={() => this.props.vm.addAsync()}>
                <app.icons.Add />
              </mui.Fab>
            </mui.Tooltip>
          </mui.Paper>}
          {this.props.vm.showChapters && <mui.Paper style={styles.chapterContainer}>
            <mui.List>
              {this.props.vm.chapters.map((chapter) => (
                <mui.ListItem button key={chapter.url} onClick={() => this.props.vm.openAsync(chapter)}>
                  <mui.ListItemText primary={chapter.title} style={styles.chapterText} />
                </mui.ListItem>
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
  seriesAction: {
    bottom: 24,
    right: 24,
    position: 'fixed'
  },
  chapterContainer: {
    padding: 8
  },
  chapterText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
