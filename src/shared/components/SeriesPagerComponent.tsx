import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesPagerComponent extends React.Component<{canPageNext: boolean, canPagePrevious: boolean, currentPage: number, pageNext: () => void, pagePrevious: () => void}> {
  render() {
    return (
      <mui.Paper square={true} style={{...app.limiter, ...styles.container}}>
        <mui.Button color="primary" variant="outlined" style={styles.buttonPrevious}
          disabled={!this.props.canPagePrevious}
          onClick={() => this.props.pagePrevious()}>
          <app.icons.ArrowBack />
        </mui.Button>
        <mui.Button color="primary" variant="outlined" style={styles.buttonNext}
          disabled={!this.props.canPageNext}
          onClick={() => this.props.pageNext()}>
          <app.icons.ArrowForward />
        </mui.Button>
        <mui.Typography style={styles.text}>
          {(this.props.currentPage < 10 ? '0' : '') + this.props.currentPage}
        </mui.Typography>
      </mui.Paper>
    );
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    padding: 8,
    position: 'fixed',
    textAlign: 'center',
    zIndex: 1
  },
  buttonNext: {
    position: 'absolute',
    right: 4
  },
  buttonPrevious: {
    left: 4,
    position: 'absolute'
  },
  text: {
    border: '1px solid rgba(0, 0, 0, 0.26)',
    borderRadius: 4,
    display: 'inline-block',
    lineHeight: '34px',
    width: 'calc(100% - 128px)',
  }
});
