import { ref } from "vue";

/*-----------------------------------*\
              25.04.08 생성
\*-----------------------------------*/

enum FindType {
    RCNT = 'RCNT',
    EXAM = 'EXAM'
}

type UseFindCrswrParams<TKeys extends string = string, TValue = any> = {
    [K in TKeys]: TValue;
};

type CrswrItem = any;

function useFindCrswr (params: UseFindCrswrParams) {
    const crswrItems = ref<CrswrItem[]>([]);
    const { txtbkId, clasId, findType } = params;
    const { data: { data } } = crswrList(txtbkId, clasId);

    if (data) crswrItems.value = [ ...data ];
    // 리스트도 전달하고 최근 값도 찾아서 리턴?
    switch (findType) {
        case FindType.RCNT:
            return crswrItems.value.find(
                item => item.ltnLrnYn === 'Y'
                && item.parntsCrswr === null
            )?.crswrId ?? 'all';
        case FindType.EXAM:
            return crswrItems.value.find(
                item => item.ltnLrnYn === 'Y'
                && item.parntsCrswr === null
            )?.crswrId ?? 'all';
    }
}

export {
    useFindCrswr
}

// how to use

/* const params = {
    textbkId: '123',
    clasId: '123',
    findType: FindType.RCNT
} */

/* const rcntCrswr = useFindCrswr(params); */