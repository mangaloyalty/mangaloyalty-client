import LazyLoad from 'react-lazyload';
import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesImage extends app.BaseComponent<typeof SeriesImageStyles, {className: string, imageAsync: () => Promise<app.IHttpResult<Blob>>, unreadCount?: number, url: string}> {
  private _imageRef?: HTMLElement;
  
  render() {
    return (
      <mui.Grid className={`${this.classes.container} ${this.props.className}`}>
        <LazyLoad height={'100%'} offset={app.settings.lazyLoadOffset} resize>
          <img className={this.classes.image} ref={(imageRef) => this._onLoad(imageRef)} />
        </LazyLoad>
        <mui.Typography className={this.classes.provider}>{getProvider(this.props.url)}</mui.Typography>
        {Boolean(this.props.unreadCount) && <mui.Typography className={this.classes.unreadCount}>{this.props.unreadCount}</mui.Typography>}
      </mui.Grid>
    );
  }
  
  private async _loadAsync(imageRef: HTMLImageElement) {
    const response = await this.props.imageAsync();
    const revokeUrl = () => Boolean(URL.revokeObjectURL(imageRef.src));
    imageRef.addEventListener('error', () => revokeUrl() || Boolean(imageRef.style.opacity = '0'));
    imageRef.addEventListener('load', () => revokeUrl() || Boolean(imageRef.style.opacity = '1'));
    imageRef.src = URL.createObjectURL(response.value);
  }

  private _onLoad(imageRef: HTMLImageElement | null) {
    if (!imageRef || this._imageRef) return;
    this._imageRef = imageRef;
    this._loadAsync(imageRef);
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
    transition: 'opacity .25s ease-in',
    width: '100%'
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
