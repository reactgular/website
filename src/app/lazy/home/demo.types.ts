import {BufferEvent} from '@typewriterjs/typewriterjs';
import {Observable} from 'rxjs';

export const MIN_DEMO_WIDTH = 1024;

/**
 * Defines the source code for a component.
 */
export interface ComponentSource {
    /**
     * HTML source code.
     */
    html: string;
    /**
     * CSS source code
     */
    scss: string;
}

/**
 * Defines how a component will transition from the source code to the rendered output.
 */
export interface ComponentBundle {
    /**
     * The source code (HTML/CSS) of the component.
     */
    from: ComponentSource;
    /**
     * The name of the component.
     */
    name: string;
    /**
     * The rendered code (HTML/CSS) of the component.
     */
    to: ComponentSource;
}

/**
 * @deprecated
 */
export interface ComponentPlayback {
    html: number;
    name: string;
    style: number;
}

/**
 * Configuration for spawning a child script.
 */
export interface ChildScriptOptions {
    /**
     * Cancel observable for the child script.
     */
    cancel$: Observable<any>;
    /**
     * Pause observable for the child script.
     */
    pause$: Observable<boolean>;
}

/**
 * Configuration of the script that plays the nano editor animation.
 */
export interface CreateComponentOptions {
    /**
     * The bundle contains the from and to source code.
     */
    bundle: ComponentBundle;
    /**
     * Human readable name of the component.
     */
    component: string;
    /**
     * The message to type before editing.
     */
    message: string[];
    /**
     * The path for the terminal prompt.
     */
    path: string;
}

/**
 * Everything needed to playback the animation of a component being created.
 */
export interface CreateComponentObservables {
    /**
     * Playback of the nano editor.
     */
    nanoBuffer$: Observable<Observable<BufferEvent>>;
    /**
     * Emits CSS as it is updated by the nano script.
     */
    renderCss$: Observable<string>;
    /**
     * Emits HTML as it is updated by the name script.
     */
    renderHtml$: Observable<string>;
    /**
     * Emits when the component should be shown in the browser.
     */
    showComponent$: Observable<boolean>;
}

/**
 * Playback observables for the demo.
 */
export interface DemoPlayback {
    /**
     * The script for creating the bookmarks component.
     */
    bookmarks: CreateComponentObservables;
    /**
     * Emits the buffer for the linux terminal.
     */
    buffer$: Observable<BufferEvent>;
    /**
     * The script for creating the summary component.
     */
    summary: CreateComponentObservables;
}
