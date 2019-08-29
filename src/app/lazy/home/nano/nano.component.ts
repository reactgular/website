import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {BufferEvent} from '@typewriterjs/typewriterjs';
import {fromEvent, Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector: 'ws-nano',
    templateUrl: './nano.component.html',
    styleUrls: ['./nano.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanoComponent implements OnInit, OnDestroy {
    @Input()
    public buffer: BufferEvent;

    @Input()
    public fileName: string;

    public keys1$: Observable<string[][]>;

    public keys2$: Observable<string[][]>;

    private _destroyed$: Subject<void> = new Subject();

    private readonly _keys1: string[][];

    private readonly _keys2: string[][];

    public constructor(@Inject(WINDOW) private _wnd: Window) {
        this._keys1 = [
            '^G|Get Help', '^O|Write Out', '^W|Where Is', '^K|Cut Text', '^J|Justify', '^C|Cur Pos', 'M-U|Undo', 'M-A|Mark Text',
            'M-]|To Bracket', 'M-▲|Previous', '^B|Back', '^◀|Prev Word'
        ].map(str => str.split('|'));

        this._keys2 = [
            '^X|Exit', '^R|Read File', '^ \|Replace', '^U|Uncut Text', '^T|To Spell', '^_|Go To Line', 'M-E|Redo', 'M-6|Copy Text',
            'M-W|WhereIs Next', 'M-▼|Next', '^F|Forward', '^▶|Next Word'
        ].map(str => str.split('|'));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const count$ = fromEvent(this._wnd, 'resize').pipe(
            map(() => this._wnd.innerWidth),
            startWith(this._wnd.innerWidth),
            map(width => Math.floor(Math.min(1920, width) / 240)),
        );

        this.keys1$ = count$.pipe(map(count => this._keys1.slice(0, count)));
        this.keys2$ = count$.pipe(map(count => this._keys2.slice(0, count)));
    }
}
