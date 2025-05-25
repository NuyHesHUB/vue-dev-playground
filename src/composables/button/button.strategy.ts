import { EvalButtonStrategy } from "./eval-button.strategy";

import type { ButtonContext, ButtonStrategy } from "./button.composable";

export function createButtonStrategy (menuType: string, params: any, contxt: ButtonContext): ButtonStrategy {
    switch(menuType) {
        case 'doc':
            return new EvalButtonStrategy(params, contxt);
        default: 
            throw new Error(`No strategy for menu type: ${menuType}`)
    }
}