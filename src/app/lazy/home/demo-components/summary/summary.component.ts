import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {faGithubSquare, faLinkedin, faStackOverflow} from '@fortawesome/free-brands-svg-icons';
import {Emittable, Emitter} from '@ngxs-labs/emitter';
import {AnalyticsService} from '../../../../shared/analytics/analytics.service';
import {DemoState} from '../../../../states/demo/demo.state';

@Component({
    selector: 'ws-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent {
    public faGitHub = faGithubSquare;

    public faLinkedIn = faLinkedin;

    public faStackOverflow = faStackOverflow;

    @Emitter(DemoState.restartDemo)
    public restart: Emittable<void>;

    constructor(private _analytics: AnalyticsService) {
    }

    /**
     * Replays the greeting
     */
    public replay() {
        this.track('intro-replay');
        this.restart.emit();
    }

    /**
     * Tracks an event via analytics
     */
    public track(category: string) {
        this._analytics.click(category);
    }
}
