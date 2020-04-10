import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class MainView extends app.BaseComponent<typeof MainViewStyles, {vm: app.MainViewModel}> {
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
        <mui.Paper className={this.classes.container} square={true}>
          <mui.Select className={this.classes.select} disableUnderline ref={this._selectReadStatusRef} value={this.props.vm.filterReadStatus}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterReadStatusAsync(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryMainReadStatusAll}</mui.MenuItem>
            <mui.MenuItem value="unread">{language.libraryMainReadStatusUnread}</mui.MenuItem>
            <mui.MenuItem value="read">{language.libraryMainReadStatusRead}</mui.MenuItem>
          </mui.Select>
          <mui.Select className={this.classes.select} disableUnderline ref={this._selectSeriesStatusRef} value={this.props.vm.filterSeriesStatus}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterSeriesStatusAsync(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryMainSeriesStatusAll}</mui.MenuItem>
            <mui.MenuItem value="ongoing">{language.libraryMainSeriesStatusOngoing}</mui.MenuItem>
            <mui.MenuItem value="completed">{language.libraryMainSeriesStatusCompleted}</mui.MenuItem>
          </mui.Select>
          <mui.Select className={this.classes.selectResizable} disableUnderline ref={this._selectSortKeyRef} value={this.props.vm.filterSortKey}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
            onChange={(ev) => this.props.vm.changeFilterSortKeyAsync(ev.target.value as any)}>
            <mui.MenuItem value="addedAt">{language.libraryMainSortKeyAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastChapterAddedAt">{language.libraryMainSortKeyLastChapterAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastPageReadAt">{language.libraryMainSortKeyLastPageReadAt}</mui.MenuItem>
            <mui.MenuItem value="title">{language.libraryMainSortKeyTitle}</mui.MenuItem>
          </mui.Select>
        </mui.Paper>
        <mui.Paper className={this.classes.content} square={true}>
          <app.SeriesListComponent
            empty={language.libraryEmpty}
            series={this.props.vm.series}
            onClick={(series) => this.props.vm.openAsync(series)} />
        </mui.Paper>
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

export const MainViewStyles = mui.createStyles({
  container: app.withLimiter({
    padding: '10px 16px',
    position: 'fixed',
    zIndex: 1
  }),
  content: {
    minHeight: 'calc(100vh - 64px)',
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
