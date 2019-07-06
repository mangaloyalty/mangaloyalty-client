import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class SeriesListComponent extends React.Component<{emptyBody: string, emptyTitle: string, series: app.ISeriesList, onClick: (series: app.ISeriesListItem) => void}> {
  componentWillReceiveProps() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <mui.Grid style={styles.container}>
        {this.props.series.items.length === 0 && <app.CenterComponent
          body={this.props.emptyBody}
          title={this.props.emptyTitle} />}
        {this.props.series.items.length !== 0 && this.props.series.items.map((series) => (
          <mui.Grid key={series.url} style={styles.series} onClick={() => this.props.onClick(series)}>
            <img src={`data:;base64, ${series.image}`} style={styles.image} />
            <mui.Typography style={styles.title}>{series.title}</mui.Typography>
          </mui.Grid>
        ))}
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    margin: 4
  },
  series: {
    cursor: 'pointer',
    margin: 4,
    width: 158,
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
