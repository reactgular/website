import {EventQueue, EventsOperator, pressNewLine, setChars} from '@typewriterjs/typewriterjs';
import {Terminal} from './terminal.operators';

export function ngServerScript(path: string): EventsOperator {
    return function (queue: EventQueue): EventQueue {
        return queue.pipe(
            Terminal.multiline([
                '## That was easy. Let\'s see what we\'ve got so far.'
            ], path, 2000),
            Terminal.multiline([
                'ng serve --prod --watch --open &'
            ], path),
            pressNewLine(),
            setChars(
                'chunk {{{3}}main{{0}}} {{1}}main.js, main.js.map{{0}} (main) 9.76 kB {{3}}[initial] {{1}}[rendered]{{0}}\r' +
                'chunk {{{3}}polyfills{{0}}} {{1}}polyfills.js, polyfills.js.map{{0}} ' +
                '(polyfills) 237 kB {{3}}[initial] {{1}}[rendered]{{0}}\r' +
                'chunk {{{3}}runtime{{0}}} {{1}}runtime.js, runtime.js.map{{0}} (runtime) 6.08 kB {{3}}[entry] {{1}}[rendered]{{0}}\r' +
                'chunk {{{3}}styles{{0}}} {{1}}styles.js, styles.js.map{{0}} (styles) 16.6 kB {{3}}[initial] {{1}}[rendered]{{0}}\r' +
                'chunk {{{3}}vendor{{0}}} {{1}}vendor.js, vendor.js.map{{0}} (vendor) 3.52 MB {{3}}[initial] {{1}}[rendered]{{0}}\r' +
                'i ｢wdm｣: Compiled successfully.\r'
            )
        );
    };
}
