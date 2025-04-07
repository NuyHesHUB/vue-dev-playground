export interface CrswrItem {
    crswrId: string;
    ltnLrnYn: 'Y' | 'N';
    parntsCrswr: string | null;
    dataTpCd: 'DEP' | 'FEP' | 'GEP' | 'SEP' | null ;
}

export interface ApiResult {
    key: string;
    result: any;
}

export type UserType = 'T' | 'S';

export type FetchNode = 'class' | 'exam' | 'both';

