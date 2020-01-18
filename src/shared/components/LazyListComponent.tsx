import LazyLoad from 'react-lazyload';
import * as mui from '@material-ui/core';
import * as React from 'react';

export class LazyListComponent<T> extends React.Component<{children: (item: T) => JSX.Element, items: T[], itemHeight: number, itemsPerBatch: number}> {
  render() {
    return (
      <mui.Grid>
        {batchItems(this.props.items).map((items, index) => (
          <LazyLoad key={index} resize unmountIfInvisible
            height={this.props.itemHeight * this.props.itemsPerBatch}
            offset={this.props.itemHeight * this.props.itemsPerBatch}>
            {items.map((item) => this.props.children(item))}
          </LazyLoad>
        ))}
      </mui.Grid>
    );
  }
}

function batchItems<T>(items: T[]) {
  const results: T[][] = [];
  for (let i = 0; i < items.length; i+= 10) results.push(items.slice(i, i + 10));
  return results;
}
