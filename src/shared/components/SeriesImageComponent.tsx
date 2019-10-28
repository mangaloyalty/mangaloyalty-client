import LazyLoad from 'react-lazyload';
import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesImage extends React.Component<{offset?: number, src: string, style?: React.CSSProperties}> {
  render() {
    return (
      <mui.Grid style={{...this.props.style, ...styles.container}}>
        <LazyLoad height={'100%'} offset={this.props.offset} resize>
          <img src={this.props.src} style={styles.image}
            onError={(ev) => ev.currentTarget.style.opacity = '1'}
            onLoad={(ev) => ev.currentTarget.style.opacity = '1'} />
        </LazyLoad>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
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
