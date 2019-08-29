import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {BodyComponent} from './body/body.component';

import {MainModule} from './main.module';

@NgModule({
    imports: [
        MainModule,
        ServerModule,
        ModuleMapLoaderModule,
    ],
    bootstrap: [BodyComponent],
})
export class MainServerModule {
}
