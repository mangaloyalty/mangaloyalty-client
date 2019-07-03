import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as React from 'react';

@mobxReact.observer
export class ChapterController extends React.Component<{id: number, pageCount: number}> {
  state = {
    vm: new area.ChapterViewModel(this.props.id, this.props.pageCount)
  };

  render() {
    return (
      <app.RefreshComponent onRefresh={() => this.state.vm.refreshAsync()}>
        <app.LoadingComponent open={this.state.vm.isLoading} />
        <div>TODO</div>
      </app.RefreshComponent>
    );
  }
}
