import {Injectable} from '@angular/core';
import {Angulartics2} from 'angulartics2';
import {Angulartics2GoogleGlobalSiteTag} from 'angulartics2/gst';
import {environment} from '../../../environments/environment';

/**
 * A wrapper around the analytics library being used.
 */
@Injectable({providedIn: 'root'})
export class AnalyticsService {
    /**
     * Verify that the service has been started.
     */
    private _started: boolean = false;

    /**
     * Constructor
     */
    public constructor(private _siteTag: Angulartics2GoogleGlobalSiteTag,
                       private _analytics: Angulartics2) {
    }

    /**
     * Tracks an action by a category.
     */
    public action(action: string, category: string) {
        if (environment.production) {
            this._analytics.eventTrack.next({action, properties: {category}});
        }
    }

    /**
     * Tracks the click of a category.
     */
    public click(category: string) {
        this.action('click', category);
    }

    /**
     * Should only be called once.
     */
    public start() {
        if (!this._started && environment.production) {
            this._started = true;
            this._siteTag.startTracking();
        }
    }
}
