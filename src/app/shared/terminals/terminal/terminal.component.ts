import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {BufferEvent} from '@typewriterjs/typewriterjs';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'ws-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent implements OnChanges, OnInit, OnDestroy {
    @Input()
    public buffer: BufferEvent;

    private readonly _destroyed$: Subject<void> = new Subject();

    private _scroll$: Subject<void> = new Subject();

    public constructor(@Inject(WINDOW) private _wnd: Window,
                       private _el: ElementRef<HTMLElement>) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('buffer' in changes) {
            this._wnd.setTimeout(() => this._scroll$.next());
        }
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._scroll$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._el.nativeElement.scrollTo(0, this._el.nativeElement.scrollHeight));
    }
}
