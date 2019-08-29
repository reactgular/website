import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'ws-chromium',
    templateUrl: './chromium.component.html',
    styleUrls: ['./chromium.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChromiumComponent implements OnInit, OnDestroy {
    @Input()
    public backgroundColor: string = '#FFFFFF';

    @ViewChild('chromeContent', {read: ElementRef})
    public chromeContent: ElementRef<HTMLElement>;

    @Input()
    public favIcon: string;

    @Input()
    public tabName: string = 'Reactgular';

    @Input()
    public url: string = 'http://google.com/';

    private readonly _destroyed$: Subject<void> = new Subject();

    private _scroll$: Subject<void> = new Subject();

    public constructor(@Inject(WINDOW) private _wnd: Window,
                       private _el: ElementRef<HTMLElement>) {

    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._scroll$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this.chromeContent.nativeElement.scrollTo(0, this.chromeContent.nativeElement.scrollHeight));
    }

    public scrollBottom() {
        this._wnd.setTimeout(() => this._scroll$.next());
    }
}
