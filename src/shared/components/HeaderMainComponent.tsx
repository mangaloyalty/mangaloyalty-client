import * as app from '..';
import * as areas from '../../areas';
import * as mui from '@material-ui/core';
import * as React from 'react';
import {language} from '../language';

export class HeaderMainComponent extends app.BaseComponent<typeof HeaderMainComponentStyles, {currentProvider?: app.IEnumeratorProvider, defaultSearch: string, onSearch: (value: string) => void}> {
  state = {
    currentSearch: this.props.defaultSearch,
    nextSearch: this.props.defaultSearch,
  };

  render() {
    return (
      <mui.Grid>
        <mui.AppBar className="disablePadding">
          <mui.Grid className="inset-top">
            <mui.Toolbar className={this.classes.toolBar}>
              <mui.Grid className={this.classes.selectContainer}>
                <mui.Select className={this.classes.select} disableUnderline displayEmpty value={String(this.props.currentProvider)}
                  IconComponent={() => <app.icons.ArrowDropDown className={this.classes.selectIcon} />}
                  MenuProps={{anchorOrigin: {horizontal: 'left', vertical: 'top'}, getContentAnchorEl: null, transitionDuration: 0}}
                  onChange={(ev) => this._onChangeAsync(ev.target.value as any)}>
                  <mui.MenuItem>{language.menuLibrary}</mui.MenuItem>
                  <mui.MenuItem value="batoto">{language.menuBatoto}</mui.MenuItem>
                  <mui.MenuItem value="fanfox">{language.menuFanfox}</mui.MenuItem>
                </mui.Select>
              </mui.Grid>
              <mui.InputBase className={this.classes.search} value={this.state.nextSearch}
                onBlur={() => this._onSearch()}
                onChange={(ev) => this.setState({nextSearch: (ev.currentTarget as HTMLInputElement).value})}
                onKeyDown={(ev) => ev.keyCode === 13 && ev.currentTarget.blur()} />
              {this.state.currentSearch && this.state.currentSearch === this.state.nextSearch
                ? <app.ButtonComponent className={this.classes.searchIcon}
                    title={language.iconClose}
                    onClick={() => this._onResetSearch()}><app.icons.Close /></app.ButtonComponent>
                : <app.ButtonComponent className={this.classes.searchIcon}
                    title={language.iconSearch}
                    onClick={() => this._onSearch()}><app.icons.Search /></app.ButtonComponent>}
            </mui.Toolbar>
          </mui.Grid>
        </mui.AppBar>
        <mui.Grid className="inset-top">
          <mui.Grid className={this.classes.children}>
            {this.props.children}
          </mui.Grid>
        </mui.Grid>
      </mui.Grid>
    );
  }

  private async _onChangeAsync(providerName?: app.IEnumeratorProvider) {
    if (providerName === this.props.currentProvider) return;
    await app.core.screen.openAsync(providerName
      ? areas.remote.MainController.createConstruct(providerName, this.state.currentSearch)
      : areas.library.MainController.createConstruct(this.state.currentSearch));
  }

  private _onSearch() {
    if (this.state.currentSearch === this.state.nextSearch) return;
    this.setState({currentSearch: this.state.nextSearch});
    this.props.onSearch(this.state.nextSearch);
  }

  private _onResetSearch() {
    if (!this.state.currentSearch) return;
    this.setState({currentSearch: '', nextSearch: ''});
    this.props.onSearch('');
  }
}

export const HeaderMainComponentStyles = mui.createStyles({
  children: app.withLimiter({
    paddingTop: 64
  }),
  toolBar: app.withLimiter({
    paddingLeft: 16,
    paddingRight: 16
  }),
  selectContainer: {
    flex: 1
  },
  select: {
    color: app.theme.palette.primary.contrastText,
    fontSize: 20
  },
  selectIcon: {
    color: app.theme.palette.primary.contrastText,
    marginLeft: -24,
    pointerEvents: 'none'
  },
  search: {
    backgroundColor: app.theme.palette.primary.contrastText,
    borderRadius: 8,
    maxWidth: '45%',
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 36,
    paddingTop: 4,
    width: 155
  },
  searchIcon: {
    padding: 8,
    position: 'absolute',
    right: 16,
    top: 12
  }
});
