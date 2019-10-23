import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: Images should be lazy-loaded (when in view). That includes the session image viewer since it uses blob references, now.
// TODO: When switching properties, all images should display placeholder images!
export class SeriesListComponent<T extends app.ISeriesItem> extends React.Component<{emptyBody: string, emptyTitle: string, series: T[], onClick: (series: T) => void}> {
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
          {this.props.series.map((series, index) => (
            <mui.Grid key={index} style={styles.series} onClick={() => this.props.onClick(series)}>
              <img src={getImageUrl(series)} style={styles.image} />
              <mui.Typography style={styles.title}>{series.title}</mui.Typography>
              {Boolean(series.unreadCount) && <mui.Typography style={styles.unreadCount}>{series.unreadCount}</mui.Typography>}
            </mui.Grid>
          ))}
        </mui.Grid>}
      </mui.Grid>
    );
  }
}

function getImageUrl(series: app.ISeriesItem) {
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
    margin: '16px 4px'
  },
  series: {
    cursor: 'pointer',
    position: 'relative',
    width: 152,
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
  },
  image: {
    objectFit: 'cover',
    height: 220,
    width: 152
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
