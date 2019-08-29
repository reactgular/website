import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {WINDOW} from '@ng-toolkit/universal';
import {Emittable, Emitter} from '@ngxs-labs/emitter';
import {fromEvent, Subject} from 'rxjs';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AnalyticsService} from '../../shared/analytics/analytics.service';
import {AppState} from '../../states/app/app.state';

@Component({
    selector: 'ws-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit, OnDestroy {
    @ViewChild(RouterOutlet)
    public outlet: RouterOutlet;

    @Emitter(AppState.setScroll)
    public scroll: Emittable<number>;

    private readonly _destroyed$: Subject<void> = new Subject();

    public constructor(@Inject(WINDOW) private _wnd: Window,
                       @Inject(DOCUMENT) private _doc: Document,
                       @Inject(PLATFORM_ID) private _platform_id: Object,
                       private _analytics: AnalyticsService) {
        if (environment.production) {
            this._analytics.start();
        }
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        /**
         * @deprecated Was used to scroll the top bar on the original site design.
         */
        if (isPlatformBrowser(this._platform_id)) {
            fromEvent(this._wnd, 'scroll').pipe(
                startWith(this._wnd.scrollY),
                map(() => this._wnd.scrollY),
                filter(value => value <= AppState.TOP_BAR_MAX_HEIGHT),
                takeUntil(this._destroyed$)
            ).subscribe(scroll => this.scroll.emit(scroll));
        }

        this.outlet.activateEvents.pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            const el = this._doc.querySelector('#bootstrap');
            if (el) {
                el.parentNode.removeChild(el);
            }
        });
    }
}
