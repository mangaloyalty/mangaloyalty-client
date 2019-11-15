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
        <app.SeriesAutomationView vm={this.props.vm.automation} />
        <mui.Paper square={true} style={{...styles.container, ...app.limiter}}>
          <mui.Tabs indicatorColor="primary" variant="fullWidth"
            value={Number(this.props.vm.showChapters)}
            onChange={(_, value) => this.props.vm.changeShowChapters(Boolean(value))}>
            <mui.Tab label={language.librarySeriesAbout} value={0} />
            <mui.Tab label={`${language.librarySeriesChapters} (${this.props.vm.chapters.length})`} value={1} />
          </mui.Tabs>
        </mui.Paper>
        <mui.Grid style={styles.containerBody}>
          {!this.props.vm.showChapters && <mui.Paper square={true} style={styles.seriesContent}>
            <img src={this.props.vm.imageData} style={styles.seriesImage} />
            <mui.Typography style={styles.seriesSummary}>{this.props.vm.summary || language.librarySeriesSummary}</mui.Typography>
            <mui.Grid style={styles.seriesClear} />
          </mui.Paper>}
          {this.props.vm.showChapters && <mui.Paper square={true}>
            <mui.List>
              {this.props.vm.chapters.map((chapter) => <app.SeriesChapterView key={chapter.id} vm={chapter} />)}
            </mui.List>
          </mui.Paper>}
          <mui.Grid style={styles.fabContainer}>
            <mui.Tooltip title={language.libraryIconRead}>
              <mui.Fab color="primary" style={styles.fabButton} onClick={() => this.props.vm.startAsync()}>
                <app.icons.PlayArrow />
              </mui.Fab>
            </mui.Tooltip>
          </mui.Grid>
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
