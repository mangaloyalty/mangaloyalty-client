import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: area.ChapterViewModel}> {
  render() {
    return (
      <mui.Grid style={styles.chapterContent} onClick={() => this.props.vm.openAsync()}>
        <mui.Typography variant="subtitle1" style={this.props.vm.isUnread ? styles.chapterUnreadText : styles.chapterReadText}>
          {this.props.vm.title}
        </mui.Typography>
        <mui.Icon style={styles.chapterIcon}>
          <app.icons.ChevronRight />
        </mui.Icon>
      </mui.Grid>
    );
  }
}

const styles = app.styles({
  chapterContent: {
    cursor: 'pointer',
    padding: 8,
    paddingRight: 24,
    position: 'relative',
  },
  chapterReadText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chapterUnreadText: {
    color: app.theme.palette.secondary.main,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chapterIcon: {
    position: 'absolute',
    right: 0,
    top: 8
  }
});
