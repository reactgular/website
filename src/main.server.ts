import {enableProdMode} from '@angular/core';

import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

export {MainServerModule} from './app/main/main-server.module';
