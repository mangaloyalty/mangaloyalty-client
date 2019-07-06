import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class MainView extends React.Component<{vm: area.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.sessions && this.props.vm.sessions.length === 0 && <app.CenterComponent
          body={app.language.sessionEmptyBody}
          title={app.language.sessionEmptyTitle} />}
        {this.props.vm.sessions && this.props.vm.sessions.length !== 0 && <mui.Paper>
          <mui.List>
            {this.props.vm.sessions.map((session) => (
              <mui.ListItem key={session.id} button onClick={() => this.props.vm.open(session)}>
                <mui.ListItemAvatar>
                  <mui.Avatar>
                    <app.icons.Folder />
                  </mui.Avatar>
                </mui.ListItemAvatar>
                <mui.Typography variant="subtitle1" style={styles.title}>
                  {session.url}
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
  title: {
    fontStyle: 'italic',
    paddingLeft: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
