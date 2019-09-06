import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: app.ChapterViewModel}> {
  render() {
    return (
      <mui.ListItem button onClick={() => this.props.vm.openAsync()}>
        <app.LoadingComponent open={this.props.vm.isLoading} />
        <mui.ListItemText primary={this.props.vm.title} style={styles.text} />
        <mui.ListItemSecondaryAction style={styles.secondaryAction}>
          <app.ButtonComponent title={this.props.vm.isReadCompleted ? language.librarySeriesMarkUnread : language.librarySeriesMarkRead}
            onClick={() => this.props.vm.toggleReadCompleted()}>
            {this.props.vm.isReadCompleted ? <app.icons.CheckCircle /> : <app.icons.CheckCircleOutlined />}
          </app.ButtonComponent>
          <app.ButtonComponent title={this.props.vm.isSynchronizing ? language.librarySeriesActionBusy : this.props.vm.syncAt ? language.librarySeriesActionDelete : language.librarySeriesActionSynchronize}
            onClick={() => this.props.vm.actionAsync()}>
            {this.props.vm.isSynchronizing ? <app.icons.CloudDownload /> : this.props.vm.syncAt ? <app.icons.Cloud /> : <app.icons.CloudQueue />}
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
