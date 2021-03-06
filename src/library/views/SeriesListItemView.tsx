import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class SeriesListItemView extends app.BaseComponent<typeof SeriesListItemViewStyles, {vm: app.SeriesListItemViewModel}> {
  render() {
    return (
      <mui.ListItem button dense onClick={() => this.props.vm.openAsync()}>
        <mui.ListItemIcon className={this.classes.checkboxContainer}>
          <mui.Checkbox edge="start"
            checked={this.props.vm.isChecked}
            onChange={() => this.props.vm.setChecked(!this.props.vm.isChecked)}
            onClick={(ev) => ev.stopPropagation()} />
        </mui.ListItemIcon>
        <mui.ListItemText className={this.classes.text} primary={this.props.vm.title} />
        <mui.ListItemSecondaryAction className={this.classes.secondaryAction}>
          <app.ButtonComponent color="inherit"
            title={this.props.vm.isReadCompleted ? language.libraryChapterMarkUnread : language.libraryChapterMarkRead}
            onClick={() => this.props.vm.toggleReadCompletedAsync()}>
            {this.props.vm.isReadCompleted ? <app.icons.CheckCircle /> : <app.icons.CheckCircleOutlined />}
          </app.ButtonComponent>
          <app.ButtonComponent color="inherit"
            title={this.props.vm.isSynchronizing ? language.libraryChapterActionBusy : this.props.vm.syncAt ? language.libraryChapterActionDelete : language.libraryChapterActionSynchronize}
            onClick={() => this.props.vm.actionAsync()}>
            {this.props.vm.isSynchronizing ? <app.icons.CloudDownload /> : this.props.vm.syncAt ? <app.icons.Cloud /> : <app.icons.CloudQueue />}
          </app.ButtonComponent>
        </mui.ListItemSecondaryAction>
      </mui.ListItem>
    );
  }
}

export const SeriesListItemViewStyles = mui.createStyles({
  checkboxContainer: {
    minWidth: 0
  },
  text: {
    overflow: 'hidden',
    paddingRight: 40,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  secondaryAction: {
    right: 0
  }
});
