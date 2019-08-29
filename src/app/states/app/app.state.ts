import {EmitterAction, Receiver} from '@ngxs-labs/emitter';
import {Selector, State, StateContext} from '@ngxs/store';
import {AppModel} from './app.model';

type AppContext = StateContext<AppModel>;

@State<AppModel>({
    name: 'app',
    defaults: {
        scroll: 0
    }
})
export class AppState {
    public static TOP_BAR_MAX_HEIGHT = 135;

    public static TOP_BAR_MIN_HEIGHT = 60;

    @Selector()
    public static scroll(state: AppModel) {
        return state.scroll;
    }

    @Receiver({payload: 0})
    public static setScroll(ctx: AppContext, {payload}: EmitterAction<number>) {
        ctx.patchState({scroll: payload});
    }

    @Selector()
    public static topBarBrand(state: AppModel) {
        const MAX_HEIGHT = AppState.TOP_BAR_MAX_HEIGHT - AppState.TOP_BAR_MIN_HEIGHT;
        const percent = Math.max(0, MAX_HEIGHT - state.scroll) / MAX_HEIGHT;
        return 25 + (25 * percent);
    }

    @Selector()
    public static topBarDocked(state: AppModel) {
        const height = Math.max(AppState.TOP_BAR_MIN_HEIGHT, AppState.TOP_BAR_MAX_HEIGHT - state.scroll);
        return height === AppState.TOP_BAR_MIN_HEIGHT;
    }

    @Selector()
    public static topBarHeight(state: AppModel) {
        return Math.max(AppState.TOP_BAR_MIN_HEIGHT, AppState.TOP_BAR_MAX_HEIGHT - state.scroll);
    }
}
