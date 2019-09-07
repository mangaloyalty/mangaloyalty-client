import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

// TODO: On refresh, scrollToTop.
@mobxReact.observer
export class MainView extends React.Component<{vm: app.MainViewModel}> {
  private readonly _eventHandler: () => void;
  private readonly _selectReadStatusRef: React.RefObject<HTMLElement>;
  private readonly _selectSeriesStatusRef: React.RefObject<HTMLElement>;
  private readonly _selectSortKeyRef: React.RefObject<HTMLElement>;

  constructor(props: {vm: app.MainViewModel}) {
    super(props);
    this._eventHandler = this._updateSize.bind(this);
    this._selectReadStatusRef = React.createRef();
    this._selectSeriesStatusRef = React.createRef();
    this._selectSortKeyRef = React.createRef();
  }

  componentDidMount() {
    addEventListener('resize', this._eventHandler);
    this._updateSize();
  }

  componentWillUnmount() {
    removeEventListener('resize', this._eventHandler);
  }

  componentDidUpdate() {
    this._updateSize();
  }

  render() {
    return (
      <mui.Grid>
        <mui.Paper style={{...styles.container, ...app.limiter}}>
          <mui.Select disableUnderline ref={this._selectReadStatusRef} value={this.props.vm.filterReadStatus} style={styles.select}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null}}
            onChange={(ev) => this.props.vm.changeFilterReadStatus(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryListReadStatusAll}</mui.MenuItem>
            <mui.MenuItem value="unread">{language.libraryListReadStatusUnread}</mui.MenuItem>
            <mui.MenuItem value="read">{language.libraryListReadStatusRead}</mui.MenuItem>
          </mui.Select>
          <mui.Select disableUnderline ref={this._selectSeriesStatusRef} value={this.props.vm.filterSeriesStatus} style={styles.select}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null}}
            onChange={(ev) => this.props.vm.changeFilterSeriesStatus(ev.target.value as any)}>
            <mui.MenuItem value="all">{language.libraryListSeriesStatusAll}</mui.MenuItem>
            <mui.MenuItem value="ongoing">{language.libraryListSeriesStatusOngoing}</mui.MenuItem>
            <mui.MenuItem value="completed">{language.libraryListSeriesStatusCompleted}</mui.MenuItem>
          </mui.Select>
          <mui.Select disableUnderline ref={this._selectSortKeyRef} value={this.props.vm.filterSortKey} style={styles.selectResizable}
            IconComponent={() => <span />}
            MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null}}
            onChange={(ev) => this.props.vm.changeFilterSortKey(ev.target.value as any)}>
            <mui.MenuItem value="addedAt">{language.libraryListSortKeyAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastChapterAddedAt">{language.libraryListSortKeyLastChapterAddedAt}</mui.MenuItem>
            <mui.MenuItem value="lastPageReadAt">{language.libraryListSortKeyLastPageReadAt}</mui.MenuItem>
            <mui.MenuItem value="title">{language.libraryListSortKeyTitle}</mui.MenuItem>
          </mui.Select>
        </mui.Paper>
        <mui.Grid style={styles.content}>
          {this.props.vm.series && <app.SeriesListComponent
            emptyBody={language.libraryEmptyBody}
            emptyTitle={language.libraryEmptyTitle}
            series={this.props.vm.series.items}
            onClick={(series) => this.props.vm.openAsync(series.id)} />}
        </mui.Grid>
      </mui.Grid>
    );
  }

  private _removePadding(select: HTMLElement) {
    const firstElementChild = select.firstElementChild as HTMLElement;
    if (firstElementChild) firstElementChild.style.paddingRight = '0';
  }

  private _updateSize() {
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
