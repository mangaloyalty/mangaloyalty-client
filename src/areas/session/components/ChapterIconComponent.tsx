import * as app from '../../..';
import * as area from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class ChapterIconComponent extends React.Component<{vm: area.ChapterViewModel}> {
  render() {
    return (
      <mui.Grid>
        <app.ButtonComponent title={app.language.sessionIconNextChapter} onClick={() => this.props.vm.chapterNextAsync()}>
          <app.icons.ArrowBack />
        </app.ButtonComponent>
        <app.ButtonComponent title={app.language.sessionIconPreviousChapter} onClick={() => this.props.vm.chapterPreviousAsync()}>
          <app.icons.ArrowForward />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
}
