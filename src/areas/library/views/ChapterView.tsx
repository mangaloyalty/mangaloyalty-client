import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: WIP synchronize button.
// TODO: Use ListItems everywhere instead of custom components.
@mobxReact.observer
export class ChapterView extends React.Component<{vm: area.ChapterViewModel}> {
  render() {
    return (
      <mui.ListItem button onClick={() => this.props.vm.openAsync()}>
        <mui.ListItemText
          primary={this.props.vm.title}
          style={styles.text} />
        <mui.ListItemSecondaryAction style={styles.secondaryAction}>
          <app.ButtonComponent onClick={() => this.props.vm.toggleReadCompleted()}
            title={this.props.vm.isReadCompleted ? app.language.librarySeriesMarkUnread : app.language.librarySeriesMarkRead}>
            {this.props.vm.isReadCompleted ? <app.icons.CheckCircle /> : <app.icons.CheckCircleOutlined />}
          </app.ButtonComponent>
          <app.ButtonComponent title="sync" onClick={() => alert('synch')}>
            {this.props.vm.isSynchronized
              ? <app.icons.Cloud />
              : <app.icons.CloudQueue />}
          </app.ButtonComponent>
        </mui.ListItemSecondaryAction>
      </mui.ListItem>
    );
  }
}

const styles = app.styles({
  text: {
    overflow: 'hidden',
    paddingRight: 40,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  secondaryAction: {
    right: -8
  }
});
