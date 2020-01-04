import * as mui from '@material-ui/core';
import * as React from 'react';

export class BaseComponent<TStyles extends Record<any, any>, TProps = {}> extends React.Component<TProps> {
  get classes() {
    const props = this.props as any;
    const styles = props as mui.WithStyles<TStyles>;
    return styles.classes;
  }
}
