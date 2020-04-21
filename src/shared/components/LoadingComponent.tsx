import * as app from '..';
import * as mobx from 'mobx';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class LoadingComponent extends app.BaseComponent<typeof LoadingComponentStyles, {open: boolean}> {
  state = {
    open: false,
    timeoutHandle: undefined,
    showInitial: true
  };

  componentDidMount() {
    mobx.reaction(() => app.core.dialog.isChildVisible, (isChildVisible) => {
      if (isChildVisible) {
        this.componentWillUnmount();
        this.setState({open: false, timeoutHandle: undefined});
      } else {
        this.setState({open: this.props.open});
      }
    });
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props: {open: boolean}) {
    if (this.state.showInitial) {
      this.componentWillUnmount();
      this.setState({open: true, showInitial: false});
    } else if (!props.open) {
      this.componentWillUnmount();
      this.setState({open: false, timeoutHandle: undefined});
    } else if (!this.state.timeoutHandle) {
      this.componentWillUnmount();
      this.setState({timeoutHandle: setTimeout(() => this.setState({open: true}), app.settings.loadingMinimumTimeout)});
    }
  }

  componentWillUnmount() {
    if (!this.state.timeoutHandle) return;
    clearTimeout(this.state.timeoutHandle);
  }

  render() {
    return (
      this.props.open && <mui.Grid className={`${this.classes.disabler} ${this.state.open && this.classes.disablerVisible}`}>
        {this.state.open && <mui.Grid className={this.classes.container}>
          <mui.CircularProgress className={this.classes.icon} />
        </mui.Grid>}
      </mui.Grid>
    );
  }
}

export const LoadingComponentStyles = mui.createStyles({
  disabler: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    top: 0,
    touchAction: 'none',
    zIndex: 1250
  },
  disablerVisible: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    outline: 0
  },
  icon: {
    animation: 'none',
    left: '50%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
