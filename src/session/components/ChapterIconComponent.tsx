import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class ChapterIconComponent extends React.Component<{vm: app.ChapterViewModel}> {
  render() {
    return (
      <mui.Grid>
        <app.ButtonComponent title={language.sessionIconNextChapter} onClick={() => this.props.vm.chapterNextAsync()}>
          <app.icons.ArrowBack />
        </app.ButtonComponent>
        <app.ButtonComponent title={language.sessionIconPreviousChapter} onClick={() => this.props.vm.chapterPreviousAsync()}>
          <app.icons.ArrowForward />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
}
