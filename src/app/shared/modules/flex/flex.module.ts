import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxLayoutDirective } from './fx-layout.directive';

@NgModule({
  declarations: [
    FxLayoutDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FxLayoutDirective
  ]
})
export class FlexModule { }
