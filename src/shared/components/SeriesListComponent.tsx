import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {forceCheck} from 'react-lazyload';

export class SeriesListComponent<T extends app.ISeriesItem> extends app.BaseComponent<typeof SeriesListComponentStyles, {empty: string, series: T[], onClick: (series: T) => void}> {
  componentDidUpdate() {
    forceCheck();
  }

  render() {
    return (
      <mui.Grid className={this.classes.container}>
        {this.props.series.length === 0 && <mui.Grid className={this.classes.textContent}>
          <mui.Typography align="justify">
            {this.props.empty}
          </mui.Typography>
        </mui.Grid>}
        {this.props.series.length !== 0 && <mui.Grid className={`inset-bottom ${this.classes.seriesContent}`}>
          {this.props.series.map((series) => (
            <mui.Grid className={this.classes.series} key={getKey(series)} onClick={() => this.props.onClick(series)}>
              <app.SeriesImage className={this.classes.image} offset={516} src={getSrc(series)} unreadCount={series.unreadCount} url={series.url} />
              <mui.Typography className={this.classes.title}>{series.title}</mui.Typography>
            </mui.Grid>
          ))}
        </mui.Grid>}
      </mui.Grid>
    );
  }
}

function getKey(series: app.ISeriesItem) {
  if (series.id) {
    return series.id;
  } else if (series.imageId) {
    return series.imageId;
  } else {
    throw new Error();
  }
}

function getSrc(series: app.ISeriesItem) {
  if (series.id) {
    return app.api.library.seriesImageUrl(series.id);
  } else if (series.imageId) {
    return app.api.remote.imageUrl(series.imageId);
  } else {
    throw new Error();
  }
}

export const SeriesListComponentStyles = mui.createStyles({
  container: {
    minHeight: 'calc(100vh - 112px)',
    position: 'relative'
  },
  textContent: {
    left: '50%',
    padding: 16,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320
  },
  seriesContent: {
    display: 'grid',
    gridGap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, 152px)',
    justifyContent: 'center',
    padding: '16px 4px'
  },
  series: {
    cursor: 'pointer',
    height: 250,
    position: 'relative',
    width: 152
  },
  image: {
    height: 220
  },
  title: {
    bottom: 0,
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%'
  }
});
