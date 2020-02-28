import * as app from '..';
import * as Hammer from 'hammerjs';

export class Touch {
  private _beginS = 1;
  private _beginX = 0;
  private _beginY = 0;
  private _currentS = 0;
  private _currentX = 0;
  private _currentY = 0;
  private _element?: HTMLElement;
  private _elementManager?: HammerManager;
  private _panTime = 0;
  private _onEvent: (event: app.ITouchEvent) => void;

  constructor(onEvent: (event: app.ITouchEvent) => void) {
    this._onEvent = onEvent;
  }

  attach(element: HTMLElement) {
    // Initialize the elements.
    if (this._element) return;
    this._element = element;
    this._elementManager = new Hammer.Manager(element);

    // Initialize the event gestures.
    const pinch = new Hammer.Pinch();
    const pan = new Hammer.Pan();
    const tap = new Hammer.Tap();
    pinch.recognizeWith(pan);

    // Initialize the event handlers.
    this._elementManager.add([pinch, pan, tap]);
    this._elementManager.on('pan pinch', (ev) => this._move(ev));
    this._elementManager.on('panend pinchend', (ev) => this._end(ev));
    this._elementManager.on('tap', (ev) => this._tap(ev));
  }

  destroy() {
    if (!this._elementManager) return;
    this._elementManager.destroy();
    this._elementManager = undefined;
  }

  reset() {
    this._beginS = this._currentS = 1;
    this._beginX = this._currentX = 0;
    this._beginY = this._currentY = 0;
    this._update();
  }

  private _checkSwipe(ev: HammerInput) {
    if (this._currentS === 1) {
      if (ev.velocityX < -0.3 && ev.distance > 32) {
        this._onEvent({type: 'Swipe', direction: app.DirectionType.Left});
      } else if (ev.velocityX > 0.3 && ev.distance > 32) {
        this._onEvent({type: 'Swipe', direction: app.DirectionType.Right});
      } else if (ev.velocityY < -0.3 && ev.distance > 32) {
        this._onEvent({type: 'Swipe', direction: app.DirectionType.Up});
      } else if (ev.velocityY > 0.3 && ev.distance > 32) {
        this._onEvent({type: 'Swipe', direction: app.DirectionType.Down});
      }
    }
  }

  private _end(ev: HammerInput) {
    this._beginS = this._currentS;
    this._beginX = this._currentX;
    this._beginY = this._currentY;
    switch (ev.type) {
      case 'panend':
        this._checkSwipe(ev);
        this._panTime = 0;
        break;
      case 'pinchend':
        this._panTime = Date.now() + 250;
        break;
    }
  }
  
  private _move(ev: HammerInput) {   
    // Compute each delta and the scale.
    if (!this._element || (this._panTime >= Date.now())) return;
    this._currentS = Math.min(Math.max(1, this._beginS * ev.scale), 4);
    this._currentX = Math.round(this._beginX + (ev.deltaX / this._currentS));
    this._currentY = Math.round(this._beginY + (ev.deltaY / this._currentS));

    // Restrict boundaries on the x-axis.
    const limitX = Math.floor((this._element.clientWidth - (this._element.clientWidth / this._currentS)) / 2);
    this._currentX = Math.max(this._currentX, -limitX);
    this._currentX = Math.min(this._currentX, limitX);
    
    // Restrict boundaries on the y-axis.
    const limitY = Math.floor((this._element.clientHeight - (this._element.clientHeight / this._currentS)) / 2);
    this._currentY = Math.max(this._currentY, -limitY);
    this._currentY = Math.min(this._currentY, limitY);
    this._update();
  }

  private _tap(ev: HammerInput) {
    this._onEvent({type: 'Tap', x: ev.center.x, y: ev.center.y});
  }

  private _update() {
    if (!this._element) return;
    const scale = `scale(${this._currentS})`;
    const translate = `translate(${this._currentX}px,${this._currentY}px)`;
    this._element.style.transform = `${scale} ${translate}`;
  }
}
