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
        {this.props.vm.sessions && this.props.vm.sessions.length !== 0 && <mui.Paper style={styles.container}>
          <mui.Grid style={{height: 65 * this.props.vm.sessions.length}}>
            <app.LazyComponent query={new app.LazyQuery(this.props.vm.sessions)} y={1680}>
              {(session) => (
                <mui.Grid style={styles.content}>
                  <mui.Typography variant="subtitle1" style={styles.primaryText} onClick={() => this.props.vm.open(session)}>
                    {session.url}
                  </mui.Typography>
                  <mui.Typography variant="caption" style={styles.secondaryText}>
                    {session.isLocal ? app.language.sessionLocalTrue : app.language.sessionLocalFalse}
                  </mui.Typography>
                  <mui.Icon style={styles.icon}>
                    <app.icons.ChevronRight />
                  </mui.Icon>
                </mui.Grid>
              )}
            </app.LazyComponent>
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
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 20
  }
});
