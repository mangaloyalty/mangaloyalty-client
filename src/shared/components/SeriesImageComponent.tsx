import LazyLoad from 'react-lazyload';
import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesImage extends app.BaseComponent<typeof SeriesImageStyles, {className?: string, offset?: number, src: string}> {
  render() {
    return (
      <mui.Grid className={`${this.classes.container} ${this.props.className}`}>
        <LazyLoad height={'100%'} offset={this.props.offset} resize>
          <img className={this.classes.image} src={this.props.src}
            onError={(ev) => ev.currentTarget.style.opacity = '1'}
            onLoad={(ev) => ev.currentTarget.style.opacity = '1'} />
        </LazyLoad>
      </mui.Grid>
    );
  }
}

export const SeriesImageStyles = mui.createStyles({
  container: {
    backgroundColor: '#E1E2E1'
  },
  image: {
    objectFit: 'cover',
    opacity: 0,
    height: '100%',
    transition: 'opacity .25s ease-in',
    width: '100%'
  }
});
