import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'ws-default-angular',
    templateUrl: './default-angular.component.html',
    styleUrls: ['./default-angular.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultAngularComponent {
}
