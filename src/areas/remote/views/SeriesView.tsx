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
        {this.props.vm.image && <mui.Grid>
          <mui.Paper style={styles.info}>
            <img src={`data:;base64, ${this.props.vm.image}`} style={styles.image} />
            <mui.Typography>{this.props.vm.summary || app.language.remoteSeriesSummary}</mui.Typography>
            <mui.Grid style={styles.clear} />
          </mui.Paper>
          {this.props.vm.chapters && <mui.Paper>
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
        </mui.Grid>}
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
