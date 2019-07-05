import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: When the chapter list is enormous, rendering takes a while (Tomo-chan wa Onnanoko!)
// UX: Author(s) and Genre(s) are not visualized right now. Should we?
@mobxReact.observer
export class SeriesView extends React.Component<{vm: area.SeriesViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.image && <mui.Paper style={styles.info}>
          <img src={`data:;base64, ${this.props.vm.image}`} style={styles.image} />
          <mui.Typography style={styles.summary}>{this.props.vm.summary || app.language.remoteSeriesSummary}</mui.Typography>
          <mui.Grid style={styles.clear} />
        </mui.Paper>}
        {this.props.vm.chapters && this.props.vm.chapters.length !== 0 && <mui.Paper>
          <mui.List>
            {this.props.vm.chapters.map((chapter) => (
              <mui.ListItem key={chapter.url} button onClick={() => this.props.vm.openAsync(chapter)}>
                <mui.ListItemAvatar>
                  <mui.Avatar>
                    <app.icons.Folder />
                  </mui.Avatar>
                </mui.ListItemAvatar>
                <mui.Typography variant="subheading" style={styles.title}>
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
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  info: {
    marginBottom: 16,
    padding: 24
  },
  image: {
    float: 'left',
    marginRight: 8,
    width: 166
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
