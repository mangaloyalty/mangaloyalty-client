import * as app from '../../..';
import * as area from '..';
import * as mobxReact from 'mobx-react';
import * as mui from '@material-ui/core';
import * as React from 'react';

@mobxReact.observer
export class ChapterView extends React.Component<{vm: area.ChapterViewModel}> {
  private readonly _container: React.RefObject<HTMLImageElement>;
  private readonly _touch: area.Touch;

  constructor(props: {vm: area.ChapterViewModel}) {
    super(props);
    this._container = React.createRef();
    this._touch = new area.Touch(this._onTapEvent.bind(this));
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    if (!this._container.current) return;
    this._touch.attach(this._container.current);
    this._touch.reset();
  }

  componentWillUnmount() {
    this._touch.destroy();
  }

  render() {
    return (
      <mui.Grid>
        {this.props.vm.imageUrl && <div ref={this._container} style={styles.container}>
          <img src={this.props.vm.imageUrl} style={styles.image}
            onContextMenu={(ev) => ev.preventDefault()} />
        </div>}
      </mui.Grid>
    );
  }

  private _onTapEvent(x: number, y: number) {
    const tresholdX = innerWidth / 2;
    const tresholdY = innerHeight / 3;
    if (y < tresholdY) {
      this.props.vm.toggleControls();
    } else if (x < tresholdX) {
      this.props.vm.imageNextAsync();
    } else {
      this.props.vm.imagePreviousAsync();
    }
  }
}

const styles = app.styles({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    top: 0
  },
  image: {
    left: '50%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
