import LazyLoad from 'react-lazyload';
import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesImage extends app.BaseComponent<typeof SeriesImageStyles, {className?: string, offset?: number, src: string, unreadCount?: number, url: string}> {
  render() {
    return (
      <mui.Grid className={`${this.classes.container} ${this.props.className}`}>
        <LazyLoad height={'100%'} offset={this.props.offset} resize>
          <img className={`${this.classes.image} ${this.props.src.startsWith('http') && this.classes.imageFade}`} src={this.props.src}
            onError={(ev) => ev.currentTarget.style.opacity = '1'}
            onLoad={(ev) => ev.currentTarget.style.opacity = '1'} />
        </LazyLoad>
        <mui.Typography className={this.classes.provider}>{getProvider(this.props.url)}</mui.Typography>
        {Boolean(this.props.unreadCount) && <mui.Typography className={this.classes.unreadCount}>{this.props.unreadCount}</mui.Typography>}
      </mui.Grid>
    );
  }
}

export const SeriesImageStyles = mui.createStyles({
  container: {
    backgroundColor: '#E1E2E1',
    position: 'relative',
  },
  image: {
    objectFit: 'cover',
    opacity: 0,
    height: '100%',
    width: '100%'
  },
  imageFade: {
    transition: 'opacity .25s ease-in'
  },
  provider: {
    backgroundColor: app.theme.palette.primary.dark,
    color: app.theme.palette.primary.contrastText,
    position: 'absolute',
    fontSize: '0.75rem',
    right: 0,
    textAlign: 'center',
    top: 0,
    width: 44
  },
  unreadCount: {
    backgroundColor: app.theme.palette.primary.light,
    color: app.theme.palette.primary.contrastText,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 18,
    width: 44
  }
});

function getProvider(url: string) {
  const match = url.match(/^(?:.+?):\/\/(.+?)\.(.+?)\//);
  if (match && match[1] && match[2]) {
    return ['com', 'net', 'org'].includes(match[2]) ? match[1] : `${match[1]}.${match[2]}`;
  } else {
    return url;
  }
}
