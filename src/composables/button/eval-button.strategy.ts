import type { ButtonStrategy, ButtonContext } from "./button.composable";
import type { AgGridButton } from "../../type/ag-grid-button.type";
import { Action } from "../../enum/button.enum";

/* enum Action {
    PRVIW = 'P',
    START = 'S',
    GRDNG = 'G',
    RESLT = 'R'
} */

enum Label {
    PRVIW = '미리 보기',
    START = '평가 시작',
    GRDNG = '채점 하기',
    RESLT = '결과 보기'
}

enum BtnClass {
    TYPE_A = 'commonBtn buttonSizeM primaryBg',
    TYPE_B = 'commonBtn buttonSizeM secondLine'
}

export class EvalButtonStrategy implements ButtonStrategy {
    constructor ( 
        // TODO : params.rowData 타입
        private params: any, 
        private contxt: ButtonContext
    ) {}

    getButtons(): AgGridButton[] {
        const { params, contxt } = this;
        const { getUserType, moveToLink, teacherAndClass } = contxt;

        const buttons: AgGridButton[] = [];
        const test = true;
        // TODO : teacherAndClass 도 유틸로 만들어서 사용
        if (teacherAndClass) {
            buttons.push({
                label    : Label.PRVIW,
                onClick  : () => moveToLink(params, Action.PRVIW),
                className: BtnClass.TYPE_B
            })
        }
        if (test) {
            buttons.push({
                label: 'test-button',
                onClick: () => console.log('테스트 버튼'),
                className: BtnClass.TYPE_A
            })
        }

        return buttons
    }
}