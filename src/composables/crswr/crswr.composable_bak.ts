// types.ts
export interface CrswrItem {
    crswrId: string;
    ltnLrnYn: string;
    parntsCrswr: string | null;
    dataTpCd: string | null;
    // 그 외 필요한 필드들 추가
  }
  
  export interface ApiResult {
    key: string;
    result: any;
  }
  
  export type UserType = 'T' | 'S';
  
  export type FetchMode = 'class' | 'exam' | 'both';
  
  // api-service.ts
  export class CrswrApiService {
    private stdCrswrSelectList: CrswrItem[] = [];
    private userType: UserType;
  
    constructor(userType: UserType) {
      this.userType = userType;
    }
  
    // 크로스워드 선택 목록 가져오기
    async fetchCrswrSelectList(txtbkUuid: string, clasUuid: string): Promise<CrswrItem[]> {
      const { data: { data } } = await getCrswrSelectList(txtbkUuid, clasUuid);
      console.log('fetchCrswrSelectList data', data);
      
      if (!data) return [];
      
      if (JSON.stringify(this.stdCrswrSelectList) !== JSON.stringify(data)) {
        this.stdCrswrSelectList = [...data];
      }
      
      return this.stdCrswrSelectList;
    }
  
    // 최근 수업 찾기
    findRecentClass(): CrswrItem | null {
      return this.stdCrswrSelectList.find(
        (item: CrswrItem) => item.ltnLrnYn === 'Y' && item.parntsCrswr === null
      ) || null;
    }
  
    // 최근 시험 찾기
    findRecentExam(): CrswrItem | null {
      return this.stdCrswrSelectList.find(
        (item: CrswrItem) => item.dataTpCd !== null
      ) || null;
    }
  
    // 크로스워드 ID 결정 - 수업용
    getClassCrswrId(): string {
      const recentClass = this.findRecentClass();
      return recentClass ? recentClass.crswrId : 'all';
    }
  
    // 크로스워드 ID 결정 - 시험용
    getExamCrswrId(): string | null {
      const recentExam = this.findRecentExam();
      return recentExam ? recentExam.crswrId : null;
    }
  
    // 교사용 API 호출 - 수업 데이터
    async fetchTeacherClassData(txtbkUuid: string, clasUuid: string, crswrId: string): Promise<ApiResult> {
      return {
        key: 'tch-objective-list',
        result: await getLearnObjctvChartAndList(txtbkUuid, clasUuid, 'list', crswrId)
      };
    }
  
    // 교사용 API 호출 - 시험 데이터
    async fetchTeacherExamData(txtbkUuid: string, clasUuid: string, crswrId: string | null): Promise<ApiResult | undefined> {
      if (!crswrId) return undefined;
      
      return {
        key: 'tch-exam-result',
        result: await getExamResult(txtbkUuid, clasUuid, crswrId)  // 가정: getExamResult API 함수가 있다고 가정
      };
    }
  
    // 학생용 API 호출 - 수업 데이터
    async fetchStudentClassData(txtbkUuid: string, clasUuid: string, userUuid: string | undefined, crswrId: string): Promise<ApiResult> {
      return {
        key: 'std-objective',
        result: await getLearnObjctv(txtbkUuid, clasUuid, userUuid, crswrId)
      };
    }
  
    // 학생용 API 호출 - 시험 데이터
    async fetchStudentExamData(txtbkUuid: string, clasUuid: string, userUuid: string | undefined, crswrId: string | null): Promise<ApiResult | undefined> {
      if (!crswrId || !userUuid) return undefined;
      
      return {
        key: 'std-exam-result',
        result: await getStudentExamResult(txtbkUuid, clasUuid, userUuid, crswrId)  // 가정: getStudentExamResult API 함수가 있다고 가정
      };
    }
  
    // 메인 API 호출 함수 - 확장된 버전
    async findCrswrApiCall(
      txtbkUuid: string, 
      clasUuid: string, 
      userUuid?: string, 
      mode: FetchMode = 'class'
    ): Promise<ApiResult | ApiResult[] | undefined> {
      // 1. 선택 목록 가져오기
      await this.fetchCrswrSelectList(txtbkUuid, clasUuid);
      
      // 2. 모드에 따른 데이터 조회
      if (mode === 'class') {
        // 수업 데이터만 조회
        const classCrswrId = this.getClassCrswrId();
        
        if (this.userType === 'T') {
          return this.fetchTeacherClassData(txtbkUuid, clasUuid, classCrswrId);
        }
        
        if (this.userType === 'S') {
          return this.fetchStudentClassData(txtbkUuid, clasUuid, userUuid, classCrswrId);
        }
      } 
      else if (mode === 'exam') {
        // 시험 데이터만 조회
        const examCrswrId = this.getExamCrswrId();
        
        if (this.userType === 'T') {
          return this.fetchTeacherExamData(txtbkUuid, clasUuid, examCrswrId);
        }
        
        if (this.userType === 'S') {
          return this.fetchStudentExamData(txtbkUuid, clasUuid, userUuid, examCrswrId);
        }
      }
      else if (mode === 'both') {
        // 수업 데이터와 시험 데이터 모두 조회
        const classCrswrId = this.getClassCrswrId();
        const examCrswrId = this.getExamCrswrId();
        
        const results: ApiResult[] = [];
        
        if (this.userType === 'T') {
          const classData = await this.fetchTeacherClassData(txtbkUuid, clasUuid, classCrswrId);
          results.push(classData);
          
          const examData = await this.fetchTeacherExamData(txtbkUuid, clasUuid, examCrswrId);
          if (examData) {
            results.push(examData);
          }
        }
        
        if (this.userType === 'S') {
          const classData = await this.fetchStudentClassData(txtbkUuid, clasUuid, userUuid, classCrswrId);
          results.push(classData);
          
          const examData = await this.fetchStudentExamData(txtbkUuid, clasUuid, userUuid, examCrswrId);
          if (examData) {
            results.push(examData);
          }
        }
        
        return results.length > 0 ? results : undefined;
      }
      
      return undefined;
    }
  }
  
  // factory.ts
  export class ApiServiceFactory {
    static createCrswrApiService(userType: UserType): CrswrApiService {
      return new CrswrApiService(userType);
    }
  }
  
  // useCrswrApi.ts
  export const useCrswrApi = (userType: UserType) => {
    const apiService = ApiServiceFactory.createCrswrApiService(userType);
    
    const findCrswrData = async (
      txtbkUuid: string, 
      clasUuid: string, 
      userUuid?: string, 
      mode: FetchMode = 'class'
    ) => {
      return apiService.findCrswrApiCall(txtbkUuid, clasUuid, userUuid, mode);
    };
    
    return {
      findCrswrData
    };
  };