export class AppScrollAction {
    public static readonly type: string = '[App] scroll';

    public constructor(public readonly scroll: number) {

    }
}
