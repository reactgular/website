import {ComponentBundle} from '../demo.types';
import {lines as bookmarksCss} from './templates/bookmarks.component.css';
import {lines as bookmarksHtml} from './templates/bookmarks.component.html';
import {lines as bookmarksScss} from './templates/bookmarks.component.scss';
import {lines as summaryCss} from './templates/summary.component.css';
import {lines as summaryHtml} from './templates/summary.component.html';
import {lines as summaryScss} from './templates/summary.component.scss';

export function createBundle(name: string, toHtml: string): ComponentBundle {
    const bundle: ComponentBundle = {
        name,
        from: {html: null, scss: null},
        to: {html: toHtml, scss: null}
    };
    switch (name) {
        case 'summary':
            bundle.from.scss = summaryScss.join('\r');
            bundle.from.html = summaryHtml.join('\r');
            bundle.to.scss = summaryCss.join(' ');
            break;
        case 'bookmarks':
            bundle.from.scss = bookmarksScss.join('\r');
            bundle.from.html = bookmarksHtml.join('\r');
            bundle.to.scss = bookmarksCss.join(' ');
            break;
        default:
            throw new Error(`${name} is not a supported bundle.`);
    }
    return bundle;
}
