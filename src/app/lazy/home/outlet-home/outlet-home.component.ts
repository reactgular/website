import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {DemoState} from '../../../states/demo/demo.state';

@Component({
    selector: 'ws-outlet-home',
    templateUrl: './outlet-home.component.html',
    styleUrls: ['./outlet-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletHomeComponent {
    @Select(DemoState.playDemo)
    public playDemo$: Observable<boolean>;
}
