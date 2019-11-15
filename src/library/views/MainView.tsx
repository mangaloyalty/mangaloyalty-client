import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  private readonly _resizeHandler: () => void;
  private readonly _selectReadStatusRef: React.RefObject<HTMLElement>;
  private readonly _selectSeriesStatusRef: React.RefObject<HTMLElement>;
  private readonly _selectSortKeyRef: React.RefObject<HTMLElement>;

  constructor(props: {vm: app.MainViewModel}) {
    super(props);
    this._resizeHandler = () => this._onResize();
    this._selectReadStatusRef = React.createRef();
    this._selectSeriesStatusRef = React.createRef();
    this._selectSortKeyRef = React.createRef();
  }

  componentDidMount() {
    addEventListener('resize', this._resizeHandler);
    this._onResize();
  }

  componentWillUnmount() {
    removeEventListener('resize', this._resizeHandler);
  }

  componentDidUpdate() {
    this._onResize();
  }

  render() {
    return (
      <mui.Grid>
        <mui.Paper square={true} style={{...styles.container, ...app.limiter}}>
          <mui.Select disableUnderline ref={this._selectReadStatusRef} value={this.props.vm.filterReadStatus} style={styles.select}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterReadStatusAsync(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryMainReadStatusAll}</mui.MenuItem>
            <mui.MenuItem value="unread">{language.libraryMainReadStatusUnread}</mui.MenuItem>
            <mui.MenuItem value="read">{language.libraryMainReadStatusRead}</mui.MenuItem>
          </mui.Select>
          <mui.Select disableUnderline ref={this._selectSeriesStatusRef} value={this.props.vm.filterSeriesStatus} style={styles.select}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterSeriesStatusAsync(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryMainSeriesStatusAll}</mui.MenuItem>
            <mui.MenuItem value="ongoing">{language.libraryMainSeriesStatusOngoing}</mui.MenuItem>
            <mui.MenuItem value="completed">{language.libraryMainSeriesStatusCompleted}</mui.MenuItem>
          </mui.Select>
          <mui.Select disableUnderline ref={this._selectSortKeyRef} value={this.props.vm.filterSortKey} style={styles.selectResizable}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterSortKeyAsync(ev.target.value as any)}>
            <mui.MenuItem value="addedAt">{language.libraryMainSortKeyAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastChapterAddedAt">{language.libraryMainSortKeyLastChapterAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastPageReadAt">{language.libraryMainSortKeyLastPageReadAt}</mui.MenuItem>
            <mui.MenuItem value="title">{language.libraryMainSortKeyTitle}</mui.MenuItem>
          </mui.Select>
        </mui.Paper>
        <mui.Grid style={styles.content}>
          <app.SeriesListComponent
            emptyBody={language.libraryEmptyBody}
            emptyTitle={language.libraryEmptyTitle}
            series={this.props.vm.series}
            onClick={(series) => this.props.vm.openAsync(series)} />
        </mui.Grid>
      </mui.Grid>
    );
  }

  private _removePadding(select: HTMLElement) {
    const firstElementChild = select.firstElementChild as HTMLElement;
    if (firstElementChild) firstElementChild.style.paddingRight = '0';
  }

  private _onResize() {
    const selectReadStatus = this._selectReadStatusRef.current;
    const selectSeriesStatus = this._selectSeriesStatusRef.current;
    const selectSortKey = this._selectSortKeyRef.current;
    if (!selectReadStatus || !selectSeriesStatus || !selectSortKey) return;
    this._removePadding(selectReadStatus);
    this._removePadding(selectSeriesStatus);
    this._removePadding(selectSortKey);
    selectSortKey.style.maxWidth = `calc(100% - ${selectReadStatus.clientWidth + selectSeriesStatus.clientWidth}px - 1px)`;
  }
}

const styles = app.styles({
  container: {
    padding: '10px 16px',
    position: 'fixed',
    top: 64,
    zIndex: 1
  },
  content: {
    paddingTop: 48
  },
  select: {
    fontSize: 13,
    opacity: 0.7,
    paddingRight: 4
  },
  selectResizable: {
    fontSize: 13,
    opacity: 0.7
  }
});
