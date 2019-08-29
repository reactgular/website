import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Emittable, Emitter} from '@ngxs-labs/emitter';
import {Select} from '@ngxs/store';
import {merge, Observable, Subject, timer} from 'rxjs';
import {first, map, mapTo, startWith, takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {AnalyticsService} from '../../../shared/analytics/analytics.service';
import {DemoState} from '../../../states/demo/demo.state';
import {DemoPlayerComponent} from '../demo-player/demo-player.component';

/**
 * Displays the controls on the bottom of the page for the intro animation.
 * Shows the "pause" and "skip" buttons.
 */
@Component({
    selector: 'ws-demo-footer',
    templateUrl: './demo-footer.component.html',
    styleUrls: ['./demo-footer.component.scss'],
    host: {
        '[class.show-dialog]': 'paused'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'demoFooter'
})
export class DemoFooterComponent implements OnInit, OnDestroy {
    @ViewChild('checkInput', {read: ElementRef})
    public checkInput: ElementRef<HTMLInputElement>;

    /**
     * This is the playback component that will be directly controlled by this component.
     */
    @Input()
    public demoPlayer: DemoPlayerComponent;

    /**
     * Emits when playback has finished.
     */
    public finished$: Observable<boolean>;

    /**
     * Toggles the displaying of the "paused" footer message.
     */
    @Input()
    public paused: boolean;

    /**
     * Selects the boolean value for the do not play again checkbox.
     */
    @Select(DemoState.doNotPlayAgain)
    public playAgain$: Observable<boolean>;

    /**
     * Shows the timer for debugging.
     */
    public showTimer = !environment.production;

    /**
     * Broadcasts to the state that the user has chosen to stop the animation.
     */
    @Emitter(DemoState.stopDemo)
    public stopDemo: Emittable<boolean>;

    /**
     * A timer that emits duration when it is subscribed.
     */
    public timer$: Observable<number>;

    /**
     * Emits when the component is destroyed.
     */
    private readonly _destroyed$: Subject<void> = new Subject();

    /**
     * Constructor
     */
    constructor(private _analytics: AnalyticsService) {
    }

    /**
     * Closes the demo player.
     */
    public close() {
        this.track('intro-close');
        this.stopDemo.emit(this.checkInput.nativeElement.checked);
    }

    /**
     * Destruction hook
     */
    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Initialization hook
     */
    public ngOnInit(): void {
        if (!this.demoPlayer) {
            return;
        }

        this.timer$ = timer(0, 100).pipe(
            map(value => value * 0.1),
            takeUntil(merge(this._destroyed$, this.demoPlayer.finished))
        );

        this.finished$ = this.demoPlayer.finished.pipe(
            first(),
            mapTo(true),
            startWith(false)
        );
    }

    /**
     * Pauses playback
     */
    public pause() {
        this.track('intro-pause');
        if (this.demoPlayer) {
            this.demoPlayer.pause();
        }
    }

    /**
     * Resumes playback.
     */
    public resume() {
        this.track('intro-resume');
        if (this.demoPlayer) {
            this.demoPlayer.resume();
        }
    }

    /**
     * Tracks event via analytics.
     */
    public track(category: string) {
        this._analytics.click(category);
    }
}
