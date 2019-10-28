import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class SeriesPagerComponent extends React.Component<{canPageNext: boolean, canPagePrevious: boolean, currentPage: number, pageNext: () => void, pagePrevious: () => void, style?: React.CSSProperties}> {
  render() {
    return (
      <mui.Grid style={this.props.style}>
        {!this.props.canPageNext && !this.props.canPagePrevious ? this.props.children : <mui.Grid style={styles.container}>
          <mui.Grid>
            {this.props.children}
          </mui.Grid>
          <mui.Paper square={true} style={{...styles.content, ...app.limiter}}>
            <mui.Tooltip title={language.seriesPagePrevious}>
              <mui.Grid style={styles.buttonPrevious}>
                <mui.Button color="primary" variant="outlined"
                  disabled={!this.props.canPagePrevious}
                  onClick={() => this.props.pagePrevious()}>
                  <app.icons.ArrowBack />
                </mui.Button>
              </mui.Grid>
            </mui.Tooltip>
            <mui.Tooltip title={language.seriesPageNext}>
              <mui.Grid style={styles.buttonNext}>
                <mui.Button color="primary" variant="outlined"
                  disabled={!this.props.canPageNext}
                  onClick={() => this.props.pageNext()}>
                  <app.icons.ArrowForward />
                </mui.Button>
              </mui.Grid>
            </mui.Tooltip>
            <mui.Typography style={styles.text}>
              {(this.props.currentPage < 10 ? '0' : '') + this.props.currentPage}
            </mui.Typography>
          </mui.Paper>
        </mui.Grid>}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    paddingBottom: 40
  },
  content: {
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
