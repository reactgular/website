import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {Subject} from 'rxjs';
import {filter, first, map, pairwise, takeUntil, tap} from 'rxjs/operators';

/**
 * This component reads the innerHTML from the first child inside <ng-content> and then
 * emits that HTML when Angular digestions has finished rendering it.
 */
@Component({
    selector: 'ws-component-html',
    templateUrl: './component-html.component.html',
    styleUrls: ['./component-html.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentHtmlComponent implements OnInit, OnDestroy, AfterContentInit {

    /**
     * The output HTML that was read.
     */
    @Output()
    public html: EventEmitter<string> = new EventEmitter(true);

    /**
     * Destruction event.
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Emits changes from the component's HTML.
     */
    private readonly _htmlChanged$: Subject<string> = new Subject();

    /**
     * Constructor
     */
    public constructor(@Inject(WINDOW) private _wnd: Window,
                       private _el: ElementRef<HTMLElement>) {
    }

    /**
     * Start listening for HTML changes after the content is ready.
     */
    public ngAfterContentInit(): void {
        this._digestChanges();
    }

    /**
     * Destruction
     */
    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Initialize
     */
    public ngOnInit(): void {
        this._htmlChanged$.pipe(
            pairwise(),
            filter(([a, b]) => a === b),
            map(([a]) => a),
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(value => this.html.next(value));
    }

    private _digestChanges(depth: number = 0) {
        if (depth > 10) {
            throw new Error('Too many changes detected');
        }
        this._wnd.setTimeout(() => {
            this._htmlChanged$.next(this._getHtml());
            this._digestChanges(depth++);
        });
    }

    /**
     * Gets the HTML from the inner component.
     */
    private _getHtml(): string {
        return this._el.nativeElement.firstElementChild.innerHTML;
    }
}
