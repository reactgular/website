import {DOCUMENT} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {WINDOW} from '@ng-toolkit/universal';
import {BufferEvent} from '@typewriterjs/typewriterjs';
import {BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, finalize, map, pairwise, startWith, takeUntil} from 'rxjs/operators';
import {DemoPlayBackService} from '../demo-play-back/demo-play-back.service';
import {ComponentBundle, CreateComponentObservables, MIN_DEMO_WIDTH} from '../demo.types';

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

/**
 * Displays the animation for the introduction.
 */
@Component({
    selector: 'ws-demo-player',
    templateUrl: './demo-player.component.html',
    styleUrls: ['./demo-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'demoPlayer'
})
export class DemoPlayerComponent implements OnInit, OnDestroy {
    /**
     * The background color of the Chrome browser.
     */
    public backgroundColor$: Observable<string>;

    /**
     * A map of component names and their source code bundles.
     */
    @Input()
    public bundles: Map<string, ComponentBundle>;

    /**
     * The favicon for the browser.
     */
    public favIcon$: Observable<string>;

    /**
     * Emits when the playback of the entire intro script is finished.
     */
    @Output()
    public finished: EventEmitter<void> = new EventEmitter();

    /**
     * Emits the buffer for the nano editor window.
     */
    public nanoBuffer$: Observable<Observable<BufferEvent>>;

    /**
     * used to render the bookmarks component
     */
    public observeBookmarks: CreateComponentObservables;

    /**
     * Used to render the summary component.
     */
    public observeSummary: CreateComponentObservables;

    /**
     * Emits when the user has paused the playback.
     */
    @Output()
    public paused: EventEmitter<void> = new EventEmitter();

    /**
     * Emits the paused state of true or false for playback.
     */
    public readonly paused$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * Emits the ngStyle properties to position the browser window.
     */
    public positionBrowser$: Observable<{ [key: string]: string; }>;

    /**
     * Emits the ngStyle properties to position the terminal.
     */
    public positionTerminal$: Observable<{ [key: string]: string; }>;

    /**
     * Emits when the user has resumed playback.
     */
    @Output()
    public resumed: EventEmitter<void> = new EventEmitter();

    /**
     * When false the default Angular component is rendered, when true the website components are being rendered.
     */
    public showComponents$: Observable<boolean>;

    /**
     * Emits when the playback starts.
     */
    @Output()
    public started: EventEmitter<void> = new EventEmitter();

    /**
     * Emits the buffer for the Linux terminal window.
     */
    public terminalBuffer$: Observable<BufferEvent>;

    /**
     * Emits when the component has been destroyed.
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Constructor
     */
    public constructor(@Inject(WINDOW) private _wnd: Window,
                       @Inject(DOCUMENT) private _doc: Document,
                       private _demoScripts: DemoPlayBackService,
                       private _el: ElementRef<HTMLElement>,
                       private _sanitizer: DomSanitizer,
                       private _change: ChangeDetectorRef) {
    }

    /**
     * Destruction hook
     */
    public ngOnDestroy(): void {
        this._doc.body.style.perspective = undefined;
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Initialization hook
     */
    public ngOnInit(): void {

        this._doc.body.style.perspective = '1500px';
        this._animatePositions();

        this.paused$.pipe(
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe(value => {
            if (value) {
                this.paused.emit();
            } else {
                this.resumed.emit();
            }
        });

        const demoPlayback = this._demoScripts.play(this._destroyed$, this.paused$.asObservable(), this.bundles);

        this.observeSummary = demoPlayback.summary;
        this.observeBookmarks = demoPlayback.bookmarks;

        this.terminalBuffer$ = demoPlayback.buffer$.pipe(
            finalize(() => this.finished.emit())
        );

        this._demoScripts.stage().pipe(
            startWith<string, string>(null),
            pairwise(),
            takeUntil(this._destroyed$)
        ).subscribe(([previous, next]) => {
            if (previous !== null) {
                this._el.nativeElement.classList.remove(`stage-${previous}`);
            }
            this._el.nativeElement.classList.add(`stage-${next}`);
        });

        this.showComponents$ = combineLatest([
            demoPlayback.summary.showComponent$,
            demoPlayback.bookmarks.showComponent$
        ]).pipe(map(([a, b]) => a || b));

        this.backgroundColor$ = this.showComponents$.pipe(
            map(show => show ? '#f9f8f5' : '#FFFFFF')
        );

        this.favIcon$ = this.showComponents$.pipe(
            map(show => show ? '/favicon.png' : '/assets/angular.ico')
        );

        this.nanoBuffer$ = merge(
            demoPlayback.summary.nanoBuffer$,
            demoPlayback.bookmarks.nanoBuffer$
        );

        this.started.emit();
    }

    /**
     * Pauses playback
     */
    public pause() {
        this.paused$.next(true);
    }

    /**
     * Resumes playback
     */
    public resume() {
        this.paused$.next(false);
    }

    /**
     * Initializations the observables used to position the windows.
     */
    private _animatePositions() {
        const width$ = fromEvent(this._wnd, 'resize').pipe(
            map(() => this._wnd.innerWidth),
            startWith(this._wnd.innerWidth)
        );

        this.positionTerminal$ = combineLatest([width$, this._demoScripts.layout()]).pipe(
            map(([width, layout]) => {
                const delta = 1 - (Math.min(1024, width - MIN_DEMO_WIDTH) / 1024);
                const angle = lerp(0, 20, delta);
                return layout === 'single'
                    ? {'max-width': '50%', 'transform': 'translate(50%, 10%)'}
                    : {
                        'max-width': '47%',
                        'transform': angle === 0
                            ? `translate(${lerp(3, 8, delta)}%, 10%)`
                            : `translate(${lerp(3, 8, delta)}%, 10%) rotateY(${lerp(0, 20, delta)}deg)`
                    };
            })
        );

        this.positionBrowser$ = combineLatest([width$, this._demoScripts.layout()]).pipe(
            map(([width, layout]) => {
                const delta = 1 - (Math.min(1024, width - MIN_DEMO_WIDTH) / 1024);
                const angle = lerp(0, -20, delta);
                return layout === 'single'
                    ? undefined
                    : {
                        'max-width': '47%',
                        'transform': angle === 0
                            ? `translate(${lerp(109, 106, delta)}%, 10%)`
                            : `translate(${lerp(109, 106, delta)}%, 10%) rotateY(${angle}deg)`
                    };
            })
        );
    }
}
