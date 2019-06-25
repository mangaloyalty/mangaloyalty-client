import * as React from 'react';

export abstract class FocusComponent extends React.Component<{onFocus: () => void}> {
  componentDidMount() {
    window.addEventListener('focus', this.props.onFocus);
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.props.onFocus);
  }

  render() {
    return this.props.children;
  }
}
