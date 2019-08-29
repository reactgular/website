import {EmitterAction, Receiver} from '@ngxs-labs/emitter';
import {Selector, State, StateContext} from '@ngxs/store';
import {DemoModel} from './demo.model';

type DemoContext = StateContext<DemoModel>;

@State<DemoModel>({
    name: 'demo',
    defaults: {
        play: true,
        doNotPlayAgain: false,
        showBrowser: false
    }
})
export class DemoState {
    @Selector()
    public static doNotPlayAgain({doNotPlayAgain}: DemoModel) {
        return doNotPlayAgain;
    }

    @Selector()
    public static playDemo(state: DemoModel) {
        return state.play && !state.doNotPlayAgain;
    }

    @Receiver()
    public static restartDemo(ctx: DemoContext) {
        ctx.patchState({play: true, doNotPlayAgain: false});
    }

    @Receiver()
    public static setShowBrowser(ctx: DemoContext, {payload}: EmitterAction<boolean>) {
        ctx.patchState({showBrowser: payload});
    }

    @Selector()
    public static showBrowser({showBrowser}: DemoModel) {
        return showBrowser;
    }

    @Receiver()
    public static stopDemo(ctx: DemoContext, {payload}: EmitterAction<boolean>) {
        ctx.patchState({play: false, doNotPlayAgain: payload});
    }
}
