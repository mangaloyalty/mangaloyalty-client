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
            <mui.Tab label={`${app.language.remoteSeriesChapters} (${this.props.vm.chapters.length || 0})`} value={1} />
          </mui.Tabs>
        </mui.Paper>}
        {this.props.vm.chapters && <mui.Grid style={styles.content}>
          {!this.props.vm.showChapters && <mui.Grid>
            <mui.Paper style={styles.info}>
              <img src={`data:;base64, ${this.props.vm.image}`} style={styles.image} />
              <mui.Typography style={styles.summary}>{this.props.vm.summary || app.language.remoteSeriesSummary}</mui.Typography>
              <mui.Grid style={styles.clear} />
            </mui.Paper>
          </mui.Grid>}
          {this.props.vm.showChapters && <mui.Paper>
            <mui.List>
              {this.props.vm.chapters.map((chapter) => (
                <mui.ListItem key={chapter.url} button onClick={() => this.props.vm.openAsync(chapter)}>
                  <mui.ListItemAvatar>
                    <mui.Avatar>
                      <app.icons.Folder />
                    </mui.Avatar>
                  </mui.ListItemAvatar>
                  <mui.Typography variant="subtitle1" style={styles.title}>
                    {chapter.title}
                  </mui.Typography>
                  <mui.ListItemSecondaryAction>
                    <mui.Icon>
                      <app.icons.ChevronRight />
                    </mui.Icon>
                  </mui.ListItemSecondaryAction>
                </mui.ListItem>
              ))}
            </mui.List>
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
  content: {
    paddingTop: 48
  },
  info: {
    marginBottom: 16,
    padding: 24
  },
  image: {
    float: 'left',
    marginRight: 8,
    width: 164
  },
  summary: {
    wordBreak: 'break-word'
  },
  clear: {
    clear: 'both'
  },
  title: {
    paddingLeft: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
