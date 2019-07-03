import * as React from 'react';

// TODO: Fix receiving focus on subscreens. Only the top screen should fire the focus handler (or we get jumps around because serieslist is setting scroll)
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
