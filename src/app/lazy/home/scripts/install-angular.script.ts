import {EventQueue, EventsOperator, pressNewLine, setChars} from '@typewriterjs/typewriterjs';
import {Terminal} from './terminal.operators';

export function installAngularScript(): EventsOperator {
    return function (queue: EventQueue): EventQueue {
        return queue.pipe(
            Terminal.multiline([
                'npm install -g @angular/cli'
            ]),
            pressNewLine(),
            setChars(
                '+ @angular/cli@7.3.8\r' +
                'added 295 packages from 180 contributors in 1.588s'
            )
        );
    };
}
