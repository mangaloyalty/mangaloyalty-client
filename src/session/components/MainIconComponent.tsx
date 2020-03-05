import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainIconComponent extends app.BaseComponent<typeof MainIconComponentStyles, {vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid className={this.classes.container}>
        <app.ButtonComponent color="inherit" title={this.props.vm.settings.optionRTL ? language.sessionIconNextChapter : language.sessionIconPreviousChapter} onClick={() => this._tryNavigateLeft()}>
          <app.icons.ArrowBack />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={this.props.vm.settings.optionRTL ? language.sessionIconPreviousChapter : language.sessionIconNextChapter} onClick={() => this._tryNavigateRight()}>
          <app.icons.ArrowForward />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={language.sessionIconSettings} onClick={() => this.props.vm.settings.toggleDialog()}>
          <app.icons.Settings />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
  
  private _tryNavigateLeft() {
    if (this.props.vm.settings.optionRTL) {
      this.props.vm.chapterNextAsync();
    } else {
      this.props.vm.chapterPreviousAsync();
    }
  }

  private _tryNavigateRight() {
    if (this.props.vm.settings.optionRTL) {
      this.props.vm.chapterPreviousAsync();
    } else {
      this.props.vm.chapterNextAsync();
    }
  }
}

export const MainIconComponentStyles = mui.createStyles({
  container: {
    display: 'inline-block'
  }
});
