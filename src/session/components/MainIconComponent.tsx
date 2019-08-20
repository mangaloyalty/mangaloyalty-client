import * as app from '..';
import * as React from 'react';
import {language} from '../language';

export class MainIconComponent extends React.Component<{vm: app.MainViewModel}> {
  render() {
    return (
      <app.ButtonComponent title={language.sessionIconRefresh} onClick={() => this.props.vm.refreshAsync()}>
        <app.icons.Refresh />
      </app.ButtonComponent>
    );
  }
}
