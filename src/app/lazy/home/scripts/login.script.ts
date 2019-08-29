import {EventQueue, EventsOperator, pause, setChars, typeChars} from '@typewriterjs/typewriterjs';
import {Terminal} from './terminal.operators';

export function loginScript(): EventsOperator {
    return function (queue: EventQueue): EventQueue {
        return queue.pipe(
            Terminal.prompt('nick', '~'),
            pause(),
            typeChars('ssh root@reactgular.com\r'),
            pause(500),
            setChars('password: '),
            typeChars('************\r'),
            pause(500),
            setChars('\rWelcome to Ubuntu 18.04.2 LTS (GNU/Linux 4.15.0-43-generic x86_64)\r\r' +
                ' * Documentation:  https://help.ubuntu.com\r' +
                ' * Management:     https://landscape.canonical.com\r' +
                ' * Support:        https://ubuntu.com/advantage\r\r' +
                '8 packages can be updated.\r' +
                '0 updates are security updates.\r')
        );
    };
}
