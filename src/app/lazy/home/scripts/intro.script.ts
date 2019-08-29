import {EventQueue, EventsOperator} from '@typewriterjs/typewriterjs';
import {Terminal} from './terminal.operators';

export function introScript(): EventsOperator {
    return function (queue: EventQueue): EventQueue {
        return queue.pipe(
            Terminal.multiline([
                '## Hi, My name is Nick Foscarini.',
                '## I\'m a Front-End Developer living near Toronto, Canada.',
                '## I like to code in JavaScript and many other languages.',
                '## I have over 10+ years of experience.',
                '## You caught me in the middle of making my website.',
                '## Why don\'t you stay and watch while I finish it!'
            ], 'reactgular')
        );
    };
}
