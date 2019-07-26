import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesListComponent<T extends app.ISeriesItem> extends React.Component<{emptyBody: string, emptyTitle: string, series: T[], onClick: (series: T) => void}> {
  componentWillReceiveProps() {
    scrollTo(0, 0);
  }

  render() {
    return (
      <mui.Grid style={styles.container}>
        {this.props.series.length === 0 && <app.CenterComponent
          body={this.props.emptyBody}
          title={this.props.emptyTitle} />}
        {this.props.series.length !== 0 && this.props.series.map((series, index) => (
          <mui.Grid key={index} style={styles.series} onClick={() => this.props.onClick(series)}>
            <img src={`data:;base64, ${series.image}`} style={styles.image} />
            <mui.Typography style={styles.title}>{series.title}</mui.Typography>
            {series.unreadCount && <mui.Typography style={styles.unreadCount}>{series.unreadCount}</mui.Typography>}
          </mui.Grid>
        ))}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'grid',
    gridGap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, 158px)',
    justifyContent: 'center',
    margin: 16
  },
  series: {
    cursor: 'pointer',
    position: 'relative',
    width: 158,
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
    width: 158
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
