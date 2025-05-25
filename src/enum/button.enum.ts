// params.menuType 

enum Menu {
    EVAL = 'doc',
    CODE = 'coding',
    ACTV = 'grpAct',
    MSTK = 'misNote'
}

/** 
 * 평가 status
 * 
 * 0 - 시작전 Before Starting
 * 1 - 완료   Complete
 * 2 - 채점중 Grading
 * 3 - 미응시 Not taking the test
 * 4 - 진행중 in progress
 */
enum EvalStts {
    BFSTAT = 0, 
    CMPLTE = 1, 
    GRADNG = 2, 
    NOTEST = 3, 
    PRGRES = 4, 
}

/** 
 * 코딩 status
 * 
 * BFTRT - 시작전 
 * PRGRS - 진행중
 * GRDNG_PRGRS - 채점중
 * GRDNG_CMPLT - 완료
 * 
 */
enum CodeStts {
    BFSTAT = 'BFTRT',
    PRGRES = 'PRGRS',
    GRADNG = 'GRDNG_PRGRS',
    CMPLTE = 'GRDNG_CMPLT'
}

/** 
 * 활동 status
 * 
 * BFTRT - 시작전 
 * PRGRS - 진행중
 * GRDNG - 채점중
 * CMPLTA - 완료 A
 * CMPLTB - 완료 B
 */
enum ActvStts {
    BFSTAT = 'BFTRT',
    PRGRES = 'PRGRS',
    GRADNG = 'GRDNG',
    CMPLT_A = 'CMPLTA',
    CMPLT_B = 'CMPLTB'
}
	
/** 
 * 활동 방식
 * 
 * CLSB - 수업 기반
 * ONES - 스스로 하기
 */
enum ActvMthd {
    CLSB = 'CLSB', 
    ONES = 'ONES'
}

/** 
 * Ag-grid 버튼 액션
 * 
 * P 미리보기 => Preview
 * E 시작하기 => Started
 * S 채점하기 => Grading
 * R 결과보기 => Results
 * 
 */
enum Action {
    PRVIW = 'P',
    START = 'S',
    GRDNG = 'G',
    RESLT = 'R'
}

export {
    Menu,
    Action,
    EvalStts,
    CodeStts,
    ActvStts,
    ActvMthd
}