import {BufferEvent, EventQueue, EventsOperator, pause, pressNewLine, setChars, tapEvents, typeChars} from '@typewriterjs/typewriterjs';
import * as fastDiff from 'fast-diff';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, scan} from 'rxjs/operators';
import {ChildScriptOptions, CreateComponentObservables, CreateComponentOptions} from '../demo.types';
import {Terminal} from './terminal.operators';

function generateComponent(message: string[], path: string, component: string): EventsOperator[] {
    const fileName = component.toLowerCase();
    return [
        Terminal.multiline(message, path, 2000),
        Terminal.multiline([
            `ng generate component ${component} --defaults`
        ], path),
        pressNewLine(),
        setChars(
            `{{3}}CREATE{{0}} src/app/${fileName}.component.html (0 bytes)\r` +
            `{{3}}CREATE{{0}} src/app/${fileName}.component.ts (274 bytes)\r` +
            `{{3}}CREATE{{0}} src/app/${fileName}.component.scss (0 bytes)\r` +
            'UPDATE src/app/app.module.ts (479 bytes)\r'
        )
    ];
}

export function createComponentScript(options: CreateComponentOptions, child: ChildScriptOptions)
    : [CreateComponentObservables, EventsOperator] {

    const fileName = options.component.toLowerCase();

    const nanoBuffer$: Subject<Observable<BufferEvent>> = new Subject();
    const renderCss$: Subject<string> = new Subject();
    const renderHtml$: Subject<string> = new Subject();
    const showComponent$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * Splits the string so that spaces are not animated as being typed.
     */
    function typeSourceCode(value: string, render$?: Subject<string>): EventsOperator {
        return (queue: EventQueue): EventQueue => {
            const chunks = value.replace(/\n/g, '\r').split(/(\s+)/g).filter(Boolean);
            return chunks.reduce((acc, chunk) => {
                return acc.pipe(
                    Boolean(chunk.trim()) ? typeChars(chunk) : setChars(chunk),
                    render$ ? tapEvents(() => render$.next(chunk)) : undefined
                );
            }, queue);
        };
    }

    function editComponentScript(
        message: string,
        nanoCommand: string,
        fromSource: string,
        toSource: string,
        render$: Subject<string>
    ): EventsOperator {
        const finished$: Subject<void> = new Subject();
        const differences = fastDiff(fromSource.replace(/\r/g, '\n'), toSource);
        const typing = differences.map(([diff, value]) => {
            return (queue: EventQueue): EventQueue => {
                switch (diff) {
                    case fastDiff.DELETE:
                        return queue.pipe(
                            typeSourceCode(value)
                        );
                    case fastDiff.EQUAL:
                        return queue.pipe(
                            typeSourceCode(value, render$)
                        );
                    case fastDiff.INSERT:
                        return queue.pipe(
                            tapEvents(() => render$.next(value))
                        );
                }
                return queue;
            };
        });

        const nanoScript = EventQueue.create().pipe(
            tapEvents(() => showComponent$.next(true)),
            ...typing,
            pause(2000),
            tapEvents(() => finished$.next())
        ).play(child.cancel$, child.pause$);

        return function (queue: EventQueue): EventQueue {
            return queue.pipe(
                Terminal.multiline([message], options.path, 2000),
                Terminal.multiline([nanoCommand], options.path),
                tapEvents(() => nanoBuffer$.next(nanoScript)),
                pause(finished$),
                tapEvents(() => nanoBuffer$.next(null))
            );
        };
    }

    const script = function (queue: EventQueue): EventQueue {
        return queue.pipe(
            ...generateComponent(options.message, options.path, options.component),
            editComponentScript(
                `## Let\'s give the ${fileName} component some HTML.`,
                `nano src/app/${fileName}.component.html`,
                options.bundle.from.html,
                options.bundle.to.html,
                renderHtml$
            ),
            editComponentScript(
                `## The ${fileName} component needs some CSS styles.`,
                `nano src/app/${fileName}.component.scss`,
                options.bundle.from.scss,
                options.bundle.to.scss,
                renderCss$
            )
        );
    };

    return [{
        nanoBuffer$: nanoBuffer$.asObservable(),
        renderCss$: renderCss$.pipe(scan((a, b) => a + b, '')),
        renderHtml$: renderHtml$.pipe(scan((a, b) => a + b, '')),
        showComponent$: showComponent$.pipe(distinctUntilChanged())
    }, script];
}
