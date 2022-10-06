import { NgModule } from '@angular/core';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js"
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";

@NgModule({
    exports: [
        FroalaEditorModule,
        FroalaViewModule,
    ],
    providers: [
        FroalaEditorModule,
        FroalaViewModule
    ]
})
export class EditorModule { }