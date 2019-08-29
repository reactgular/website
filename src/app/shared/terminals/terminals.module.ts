import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TypewriterModule} from '@typewriterjs/typewriterjs-angular';
import {ChromiumComponent} from './chromium/chromium.component';
import {TerminalComponent} from './terminal/terminal.component';
import {WindowComponent} from './window/window.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        TypewriterModule
    ],
    declarations: [
        TerminalComponent,
        ChromiumComponent,
        WindowComponent
    ],
    exports: [
        TerminalComponent,
        ChromiumComponent,
        WindowComponent
    ]
})
export class TerminalsModule {
}
