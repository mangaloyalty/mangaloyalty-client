import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class MainIconComponent extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        <app.ButtonComponent color="inherit" title={language.sessionIconNextChapter} onClick={() => this.props.vm.chapterNextAsync()}>
          <app.icons.ArrowBack />
        </app.ButtonComponent>
        <app.ButtonComponent color="inherit" title={language.sessionIconPreviousChapter} onClick={() => this.props.vm.chapterPreviousAsync()}>
          <app.icons.ArrowForward />
        </app.ButtonComponent>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'inline-block'
  }
});
