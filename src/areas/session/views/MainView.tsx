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
        {this.props.vm.sessions && this.props.vm.sessions.length !== 0 && <mui.Paper style={styles.content}>
          <mui.Grid style={{height: 44 * this.props.vm.sessions.length}}>
            <app.LazyComponent query={new app.LazyQuery(this.props.vm.sessions)} y={1680}>
              {(session) => (
                <mui.Typography variant="subtitle1" style={styles.item} onClick={() => this.props.vm.open(session)}>
                  {session.url}
                  <mui.Icon style={styles.icon}>
                    <app.icons.ChevronRight />
                  </mui.Icon>
                </mui.Typography>
              )}
            </app.LazyComponent>
          </mui.Grid>         
        </mui.Paper>}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  content: {
    padding: 8
  },
  item: {
    cursor: 'pointer',
    fontStyle: 'italic',
    overflow: 'hidden',
    padding: 8,
    paddingRight: 24,
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 4
  }
});
