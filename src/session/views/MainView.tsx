import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid>
        {this.props.vm.sessions.length === 0 && <app.CenterComponent
          body={language.sessionEmptyBody}
          title={language.sessionEmptyTitle} />}
        {this.props.vm.sessions.length !== 0 && <mui.Paper style={styles.container}>
          <mui.List>
            {this.props.vm.sessions.map((session) => (
              <mui.ListItem button key={session.id} onClick={() => this.props.vm.openAsync(session)}>
                <mui.ListItemText primary={session.url} secondary={session.isLocal ? language.sessionLocalTrue : language.sessionLocalFalse} style={styles.text} />
              </mui.ListItem>
            ))}
          </mui.List>     
        </mui.Paper>}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    padding: 8
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
