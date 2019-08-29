import {EventQueue, EventsOperator, pressNewLine, setChars} from '@typewriterjs/typewriterjs';
import {Terminal} from './terminal.operators';

export function finishScript(path: string): EventsOperator {
    return function (queue: EventQueue): EventQueue {
        return queue.pipe(
            Terminal.multiline([
                '## My new website is all finished!',
                '## Thank you for watching and please give the website a try!'
            ], path, 1000),
            Terminal.multiline([
                '## Click anywhere to continue...'
            ], path, 0),
            Terminal.multiline(['exit'], path),
            pressNewLine(),
            setChars('logout\r' +
                'Connection to reactgular.com closed.'),
        );
    };
}
