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
        {this.props.vm.sessions && this.props.vm.sessions.length === 0 && <app.CenterComponent
          body={language.sessionEmptyBody}
          title={language.sessionEmptyTitle} />}
        {this.props.vm.sessions && this.props.vm.sessions.length !== 0 && <mui.Paper style={styles.container}>
          <mui.Grid style={{height: 65 * this.props.vm.sessions.length}}>
            {this.props.vm.sessions.map((session) => (
              <mui.Grid key={session.id} style={styles.content}>
                <mui.Typography variant="subtitle1" style={styles.primaryText} onClick={() => this.props.vm.open(session)}>
                  {session.url}
                </mui.Typography>
                <mui.Typography variant="caption" style={styles.secondaryText}>
                  {session.isLocal ? language.sessionLocalTrue : language.sessionLocalFalse}
                </mui.Typography>
              </mui.Grid>
            ))}
          </mui.Grid>     
        </mui.Paper>}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    padding: 8
  },
  content: {
    cursor: 'pointer',
    padding: 8,
    paddingRight: 24,
    position: 'relative',
  },
  primaryText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  secondaryText: {
    opacity: 0.7
  }
});
