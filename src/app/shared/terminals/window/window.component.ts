import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'ws-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent {
    @Input()
    public title: string;
}
