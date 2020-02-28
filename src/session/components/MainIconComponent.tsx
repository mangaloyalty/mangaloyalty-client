import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class MainIconComponent extends app.BaseComponent<typeof MainIconComponentStyles, {vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid className={this.classes.container}>
        <app.ButtonComponent color="inherit" title={language.sessionIconNextChapter} onClick={() => this.props.vm.chapterNextAsync()}>
          <app.icons.ArrowBack />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={language.sessionIconPreviousChapter} onClick={() => this.props.vm.chapterPreviousAsync()}>
          <app.icons.ArrowForward />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={language.sessionIconSettings} onClick={() => this.props.vm.settings.toggleDialog()}>
          <app.icons.Settings />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
}

export const MainIconComponentStyles = mui.createStyles({
  container: {
    display: 'inline-block'
  }
});
