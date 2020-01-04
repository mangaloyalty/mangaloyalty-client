import * as mui from '@material-ui/core';
import * as React from 'React';

export function connectStyles(source: Record<any, any>) {
  for (const key in source) {
    const match = key.match(/^((.*)Styles)$/);
    const value = source[key];
    const view = match && source[match[2]];
    if (match && value && view) {
      source[match[2]] = mui.withStyles(value)(view);
    } else if (value && typeof value === 'object') {
      connectStyles(value);
    }
  }
}

export function withLimiter(style: React.CSSProperties) {
  return {...style, ...{
    left: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '100%',
    right: 0,
    width: 1024
  }};
}
