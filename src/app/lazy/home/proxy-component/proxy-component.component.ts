import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {merge, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {ChromiumComponent} from '../../../shared/terminals/chromium/chromium.component';

/**
 * This is a proxy component that renders HTML inside the view, and also binds a CSS styles for that view.
 */
@Component({
    selector: 'ws-proxy-component',
    templateUrl: './proxy-component.component.html',
    styleUrls: ['./proxy-component.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.demo-reset]': 'true'
    }
})
export class ProxyComponentComponent implements OnInit, OnDestroy {
    /**
     * The DOM element tag name to be used.
     */
    @Input()
    public tagName: string;

    /**
     * Bound to the CSS input binding.
     */
    private readonly _css$: Subject<string> = new Subject();

    /**
     * Destructor event
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Bound to the HTML input binding.
     */
    private readonly _html$: Subject<string> = new Subject();

    /**
     * Constructor
     */
    public constructor(@Inject(WINDOW) private _wnd: Window,
                       @Inject(DOCUMENT) private _doc: Document,
                       private _chromium: ChromiumComponent,
                       private _el: ElementRef<HTMLElement>) {
    }

    /**
     * The CSS styles to be added to a <style> tag.
     */
    @Input()
    public set css(value: string) {
        this._css$.next(value);
    }

    /**
     * The contents of the view.
     */
    @Input()
    public set html(value: string) {
        this._html$.next(value);
    }

    /**
     * Destructor
     */
    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Initialize
     */
    public ngOnInit(): void {
        const proxyEl = this._doc.createElement(this._getTagName());
        this._el.nativeElement.appendChild(proxyEl);

        const styleEl = this._doc.createElement(`style`);
        this._doc.head.appendChild(styleEl);
        this._destroyed$.subscribe(() => {
            styleEl.remove();
        });

        this._html$.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(value => proxyEl.innerHTML = value);

        this._css$.pipe(
            map(value => value.replace(new RegExp(this.tagName, 'g'), this._getTagName())),
            map(value => {
                const opened = value.split('{').length;
                const closed = value.split('}').length;
                return opened - closed === 1 ? `${value}; }` : value;
            }),
            takeUntil(this._destroyed$)
        ).subscribe(value => styleEl.innerHTML = value);

        merge(this._html$, this._css$).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => this._chromium.scrollBottom());
    }

    /**
     * The tag name for the proxy DOM element.
     */
    private _getTagName(): string {
        return `${this.tagName}-proxy`;
    }
}
