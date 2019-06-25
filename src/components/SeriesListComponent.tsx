import * as app from '..';
import * as mui from '@material-ui/core';
import * as React from 'react';

// TODO: No results, show a message?
export class SeriesListComponent extends React.Component<{seriesList: app.ISeriesList, onClick: (seriesListItem: app.ISeriesListItem) => void}> {
  render() {
    return (
      <mui.Grid style={styles.container}>
        {this.props.seriesList.map((seriesListItem) => (
          <mui.Grid key={seriesListItem.url} style={styles.series} onClick={() => this.props.onClick(seriesListItem)}>
            <img src={`data:;base64, ${seriesListItem.image}`} style={styles.image} />
            <mui.Typography style={styles.title}>{seriesListItem.title}</mui.Typography>
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
    margin: '8px 4px'
  },
  series: {
    float: 'left',
    margin: 4,
    width: 160
  },
  image: {
    objectFit: 'cover',
    height: 220,
    width: 160
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
