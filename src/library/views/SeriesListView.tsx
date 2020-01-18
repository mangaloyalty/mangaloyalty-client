import * as app from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

@mobxReact.observer
export class SeriesListView extends app.BaseComponent<typeof SeriesListViewStyles, {vm: app.SeriesListViewModel}> {
  render() {
    return (
      <mui.Grid className={`${this.props.vm.showControls && this.classes.contentControls}`}>
        <mui.Paper square={true}>
          <mui.List>
            <app.LazyListComponent items={this.props.vm.items} itemHeight={48} itemsPerBatch={10}>
              {(item) => <app.SeriesListItemView key={item.id} vm={item} />}
            </app.LazyListComponent>
          </mui.List>
        </mui.Paper>
        <mui.Grid className={`${this.classes.container} ${this.props.vm.showControls && this.classes.containerControls}`}>
          <mui.Divider />
          <mui.Paper className={this.classes.control} square={true}>
            <mui.Select className={this.classes.controlSelect} disableUnderline value={this.props.vm.selectionMode}
              IconComponent={() => <span />}
              MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
              renderValue={(value) => getText(value as any)}
              onChange={(ev) => this.props.vm.changeSelectionMode(ev.target.value as any)}>
              <mui.MenuItem value="none" >{language.librarySeriesSelectionNone}</mui.MenuItem>
              {this.props.vm.canSelectAll && <mui.MenuItem value="all">{language.librarySeriesSelectionAll}</mui.MenuItem>}
              {this.props.vm.canSelectUnread && <mui.MenuItem value="unread">{language.librarySeriesSelectionUnread}</mui.MenuItem>}
              {this.props.vm.canSelectRead && <mui.MenuItem value="read">{language.librarySeriesSelectionRead}</mui.MenuItem>}
            </mui.Select>
            <mui.Grid className={this.classes.controlActions}>
              <app.ButtonComponent color="inherit"
                title={this.props.vm.isSelectionReadCompleted ? language.libraryChapterMarkUnread : language.libraryChapterMarkRead}
                onClick={() => this.props.vm.toggleReadCompletedAsync()}>
                {this.props.vm.isSelectionReadCompleted ? <app.icons.CheckCircle /> : <app.icons.CheckCircleOutlined />}
              </app.ButtonComponent>
              <app.ButtonComponent color="inherit"
                title={this.props.vm.isSelectionSynchronizing ? language.libraryChapterActionBusy : this.props.vm.isSelectionSynchronized ? language.libraryChapterActionDelete : language.libraryChapterActionSynchronize}
                onClick={() => this.props.vm.actionAsync()}>
                {this.props.vm.isSelectionSynchronizing ? <app.icons.CloudDownload /> : this.props.vm.isSelectionSynchronized ? <app.icons.Cloud /> : <app.icons.CloudQueue />}
              </app.ButtonComponent>
            </mui.Grid>
          </mui.Paper>
        </mui.Grid>
      </mui.Grid>
    );
  }
}

function getText(selectionMode: app.SeriesListViewModel['selectionMode']) {
  switch (selectionMode) {
    case 'none':
      return language.librarySeriesSelectionNone;
    case 'all':
      return language.librarySeriesSelectionAll;
    case 'unread':
      return language.librarySeriesSelectionUnread;
    case 'read':
      return language.librarySeriesSelectionRead;
    case 'custom':
      return language.librarySeriesSelectionCustom;
  }
}

export const SeriesListViewStyles = mui.createStyles({
  container: app.withLimiter({
    bottom: -48,
    position: 'fixed',
    zIndex: 1
  }),
  containerControls: {
    bottom: 0
  },
  contentControls: {
    paddingBottom: 40
  },
  control: {
    padding: '10px 8px'
  },
  controlSelect: {
    fontSize: 13,
    opacity: 0.7,
    paddingRight: 4
  },
  controlActions: {
    position: 'absolute',
    right: 0,
    top: 0
  }
});
