import {Injectable} from '@angular/core';
import {BufferEvent, EventQueue, speed, tapEvents} from '@typewriterjs/typewriterjs';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ComponentBundle, ComponentPlayback, DemoPlayback} from '../demo.types';
import {createComponentScript} from '../scripts/create-component.script';
import {createProjectScript} from '../scripts/create-project.script';
import {finishScript} from '../scripts/finish.script';
import {installAngularScript} from '../scripts/install-angular.script';
import {introScript} from '../scripts/intro.script';
import {loginScript} from '../scripts/login.script';
import {ngServerScript} from '../scripts/ng-serve.script';
import {Terminal} from '../scripts/terminal.operators';

/**
 * A factory service for creating the introduction demo scripts.
 */
@Injectable({providedIn: 'root'})
export class DemoPlayBackService {
    private readonly _layout$: ReplaySubject<string> = new ReplaySubject(1);

    /**
     * @deprecated
     */
    private readonly _nanoScript$: Subject<Observable<BufferEvent>> = new Subject();

    /**
     * @deprecated
     */
    private readonly _playBack$: Subject<ComponentPlayback> = new Subject();

    private readonly _stage$: ReplaySubject<string> = new ReplaySubject(1);

    public layout(): Observable<string> {
        return this._layout$.asObservable();
    }

    /**
     * @deprecated
     */
    public nanoScripts(): Observable<Observable<BufferEvent>> {
        return this._nanoScript$.asObservable();
    }

    /**
     * Creates the demo scrip and it's children that create components.
     */
    public play(cancel$: Observable<any>, pause$: Observable<boolean>, bundles: Map<string, ComponentBundle>): DemoPlayback {

        const path = '~/reactgular';

        const [summary, summaryScript] = createComponentScript({
            bundle: bundles.get('summary'),
            component: 'Summary',
            message: ['## Let\'s start with a summary of who I am and what I do.'],
            path
        }, {cancel$, pause$});

        const [bookmarks, bookmarksScript] = createComponentScript({
            bundle: bundles.get('bookmarks'),
            component: 'Bookmarks',
            message: [
                '## Let\'s add a project to my portfolio with a live demo.'
            ],
            path
        }, {cancel$, pause$});

        const buffer$ = EventQueue.create().pipe(
            speed(environment.fast ? 1 : 10),
            tapEvents(() => this._layout$.next('single')),
            tapEvents(() => this._stage$.next('intro')),
            loginScript(),
            introScript(),
            installAngularScript(),
            createProjectScript(),
            ngServerScript(path),
            tapEvents(() => this._layout$.next('double')),
            tapEvents(() => this._stage$.next('browser')),
            Terminal.multiline([
                '## As you can see. This is an empty Angular project.',
                '## We got some work to do!'
            ], path, 2000),
            summaryScript,
            bookmarksScript,
            finishScript(path)
        ).play(cancel$, pause$);

        return {summary, bookmarks, buffer$};
    }

    /**
     * @deprecated
     */
    public playBack(): Observable<ComponentPlayback> {
        return this._playBack$.asObservable();
    }

    public stage(): Observable<string> {
        return this._stage$.asObservable();
    }
}
