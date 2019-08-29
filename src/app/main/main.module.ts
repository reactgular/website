import {ModuleWithProviders, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {library} from '@fortawesome/fontawesome-svg-core';
import {NgtUniversalModule} from '@ng-toolkit/universal';
import {NgxsEmitPluginModule} from '@ngxs-labs/emitter';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsModule} from '@ngxs/store';
import {Angulartics2Module} from 'angulartics2';
import {environment} from '../../environments/environment';
import {AppState} from '../states/app/app.state';
import {DemoState} from '../states/demo/demo.state';
import {BodyComponent} from './body/body.component';
import {FONT_AWESOME_ICONS} from './font-awesome-icons';
import {MainRoutingModule} from './main-routing.module';

library.add(...FONT_AWESOME_ICONS);

const STATES = [
    AppState,
    // @todo move to the home lazy module
    DemoState
];

@NgModule({
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        NgxsModule.forRoot(STATES, {developmentMode: !environment.production}),
        NgxsEmitPluginModule.forRoot() as ModuleWithProviders,
        NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
        NgxsStoragePluginModule.forRoot({
            key: ['demo.doNotPlayAgain']
        }),
        NgtUniversalModule,
        MainRoutingModule,
        Angulartics2Module.forRoot()
    ],
    declarations: [
        BodyComponent
    ],
    bootstrap: [BodyComponent]
})
export class MainModule {
}
