import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

type FlexDirection = 'row' | 'column';

@Directive({
  selector: '[fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]'
})
export class FxLayoutDirective implements OnInit {
  @Input() 'fxLayout': FlexDirection;
  @Input() 'fxLayout.xs': FlexDirection;
  @Input() 'fxLayout.sm': FlexDirection;
  @Input() 'fxLayout.md': FlexDirection;
  @Input() 'fxLayout.lg': FlexDirection;
  @Input() 'fxLayout.xl': FlexDirection;
  @Input() 'fxLayout.lt-sm': FlexDirection;
  @Input() 'fxLayout.lt-md': FlexDirection;
  @Input() 'fxLayout.lt-lg': FlexDirection;
  @Input() 'fxLayout.lt-xl': FlexDirection;
  @Input() 'fxLayout.gt-xs': FlexDirection;
  @Input() 'fxLayout.gt-sm': FlexDirection;
  @Input() 'fxLayout.gt-md': FlexDirection;
  @Input() 'fxLayout.gt-lg': FlexDirection;

  default: FlexDirection;
  direction: FlexDirection;
  selectors: string[] = [];
  screen: number;

  breakPoints = {
    'fxLayout.xs': { from: 0, to: 599 },
    'fxLayout.sm': { from: 600, to: 959 },
    'fxLayout.md': { from: 960, to: 1279 },
    'fxLayout.lg': { from: 1280, to: 1919 },
    'fxLayout.xl': { from: 1920, to: 5000 },
    'fxLayout.lt-sm': { from: null, to: 600 },
    'fxLayout.lt-md': { from: null, to: 960 },
    'fxLayout.lt-lg': { from: null, to: 1280 },
    'fxLayout.lt-xl': { from: null, to: 5000 },
    'fxLayout.gt-xs': { from: 599, to: null },
    'fxLayout.gt-sm': { from: 959, to: null },
    'fxLayout.gt-md': { from: 1279, to: null },
    'fxLayout.gt-lg': { from: 1919, to: null }
  };

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.default = this['fxLayout'];
    this.direction = this.default;
    this.screen = window.innerWidth;
    this.selectors = this.getSelectors();
  }

  @HostListener('window:resize', ['$event'])
  resize() {
    if (!this.selectors.length) return;
    this.screen = window.innerWidth;
    console.log(this.screen);
    this.applyDirection();
    this.applyStyles();
  }

  applyDirection() {
    this.selectors.forEach(selector => {

      

    });
  }



  applyStyles() {
    this.el.nativeElement.style['display'] = 'flex';
    this.el.nativeElement.style['flex-direction'] = this.direction;
  }

  getSelectors() {
    let selectors = [];
    for (let selector in this.breakPoints) {
      if (this.hasSelector(selector)) selectors.push(selector);
    }
    return selectors;
  }

  hasSelector(selector: string) {
    return this.el.nativeElement.hasAttribute(selector);
  }

}


// breakpoint	mediaQuery
// ----------------------
// xs	'screen and (max-width: 599px)'
// sm	'screen and (min-width: 600px) and (max-width: 959px)'
// md	'screen and (min-width: 960px) and (max-width: 1279px)'
// lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
// xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
// lt-sm	'screen and (max-width: 599px)'
// lt-md	'screen and (max-width: 959px)'
// lt-lg	'screen and (max-width: 1279px)'
// lt-xl	'screen and (max-width: 1919px)'
// gt-xs	'screen and (min-width: 600px)'
// gt-sm	'screen and (min-width: 960px)'
// gt-md	'screen and (min-width: 1280px)'
// gt-lg	'screen and (min-width: 1920px)'