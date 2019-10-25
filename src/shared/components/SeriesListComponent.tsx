import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {forceCheck} from 'react-lazyload';

export class SeriesListComponent<T extends app.ISeriesItem> extends React.Component<{emptyBody: string, emptyTitle: string, series: T[], onClick: (series: T) => void}> {
  componentDidUpdate() {
    forceCheck();
  }

  render() {
    return (
      <mui.Grid>
        {this.props.series.length === 0 && <mui.Grid style={styles.textContent}>
          <mui.Typography align="center" variant="h6">
            {this.props.emptyTitle}
          </mui.Typography>
          <mui.Typography align="justify">
            {this.props.emptyBody}
          </mui.Typography>
        </mui.Grid>}
        {this.props.series.length !== 0 && <mui.Grid style={styles.seriesContent}>
          {this.props.series.map((series) => (
            <mui.Grid key={getKey(series)} style={styles.series} onClick={() => this.props.onClick(series)}>
              <app.SeriesImage src={getUrl(series)} style={styles.image} />
              <mui.Typography style={styles.title}>{series.title}</mui.Typography>
              {Boolean(series.unreadCount) && <mui.Typography style={styles.unreadCount}>{series.unreadCount}</mui.Typography>}
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

function getUrl(series: app.ISeriesItem) {
  if (series.id) {
    return app.api.library.seriesImageUrl(series.id);
  } else if (series.imageId) {
    return app.api.remote.imageUrl(series.imageId);
  } else {
    throw new Error();
  }
}

const styles = app.styles({
  textContent: {
    left: '50%',
    padding: 16,
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320
  },
  seriesContent: {
    display: 'grid',
    gridGap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, 152px)',
    justifyContent: 'center',
    margin: '16px 4px'
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
  },
  unreadCount: {
    backgroundColor: app.theme.palette.primary.main,
    color: app.theme.palette.primary.contrastText,
    padding: '8px 0',
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 0,
    width: 44
  }
});
