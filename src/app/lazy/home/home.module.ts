import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TerminalsModule} from '../../shared/terminals/terminals.module';
import {ProxyComponentComponent} from './proxy-component/proxy-component.component';
import {DefaultAngularComponent} from './default-angular/default-angular.component';
import {BookmarksComponent} from './demo-components/bookmarks/bookmarks.component';
import {SummaryComponent} from './demo-components/summary/summary.component';
import {DemoFooterComponent} from './demo-footer/demo-footer.component';
import {DemoPlayerComponent} from './demo-player/demo-player.component';
import {HomeRoutingModule} from './home-routing.module';
import {NanoComponent} from './nano/nano.component';
import {OutletHomeComponent} from './outlet-home/outlet-home.component';
import { ComponentHtmlComponent } from './component-html/component-html.component';
import { DemoComponent } from './demo/demo.component';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        TerminalsModule,
        FontAwesomeModule
    ],
    declarations: [
        DefaultAngularComponent,
        DemoPlayerComponent,
        NanoComponent,
        OutletHomeComponent,
        SummaryComponent,
        ProxyComponentComponent,
        DemoFooterComponent,
        BookmarksComponent,
        ComponentHtmlComponent,
        DemoComponent
    ]
})
export class HomeModule {
}
