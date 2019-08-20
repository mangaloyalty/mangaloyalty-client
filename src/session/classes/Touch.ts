import * as Hammer from 'hammerjs';

export class Touch {
  private _adjustScale = 1;
  private _adjustDeltaX = 0;
  private _adjustDeltaY = 0;
  private _currentScale = 0;
  private _currentDeltaX = 0;
  private _currentDeltaY = 0;
  private _element?: HTMLElement;
  private _elementManager?: HammerManager;
  private _panTime = 0;
  private _onTap?: (x: number, y: number) => void;

  constructor(onTap?: (x: number, y: number) => void) {
    this._onTap = onTap;
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
  }

  reset() {
    this._adjustScale = this._currentScale = 1;
    this._adjustDeltaX = this._currentDeltaX = 0;
    this._adjustDeltaY = this._currentDeltaY = 0;
    this._update();
  }

  private _end(ev: HammerInput) {
    this._adjustScale = this._currentScale;
    this._adjustDeltaX = this._currentDeltaX;
    this._adjustDeltaY = this._currentDeltaY;
    this._panTime = ev.type === 'pinchend' ? Date.now() + 250 : 0;
  }
  
  private _move(ev: HammerInput) {   
    // Calculate the scale and the deltas.
    if (!this._element || (this._panTime >= Date.now() && ev.type === 'pan')) return;
    this._currentScale = Math.min(Math.max(1, this._adjustScale * ev.scale), 4);
    this._currentDeltaX = Math.round(this._adjustDeltaX + (ev.deltaX / this._currentScale));
    this._currentDeltaY = Math.round(this._adjustDeltaY + (ev.deltaY / this._currentScale));

    // Calculate and restrict the x-axis boundaries.
    const limitX = Math.floor((this._element.clientWidth - (this._element.clientWidth / this._currentScale)) / 2);
    if (this._currentDeltaX < -limitX) this._currentDeltaX = -limitX;
    if (this._currentDeltaX > limitX) this._currentDeltaX = limitX;

    // Calculate and restrict the y-axis boundaries.
    const limitY = Math.floor((this._element.clientHeight - (this._element.clientHeight / this._currentScale)) / 2);
    if (this._currentDeltaY < -limitY) this._currentDeltaY = -limitY;
    if (this._currentDeltaY > limitY) this._currentDeltaY = limitY;
    this._update();
  }

  private _tap(ev: HammerInput) {
    if (!this._onTap) return;
    this._onTap(ev.center.x, ev.center.y);
  }

  private _update() {
    if (!this._element) return;
    const scale = `scale(${this._currentScale})`;
    const translate = `translate(${this._currentDeltaX}px,${this._currentDeltaY}px)`;
    this._element.style.transform = `${scale} ${translate}`;
  }
}
