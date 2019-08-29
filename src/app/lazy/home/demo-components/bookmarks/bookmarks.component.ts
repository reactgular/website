import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AnalyticsService} from '../../../../shared/analytics/analytics.service';

@Component({
    selector: 'ws-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarksComponent {

    constructor(private _analytics: AnalyticsService) {
    }

    public track(category: string) {
        this._analytics.click(category);
    }
}
