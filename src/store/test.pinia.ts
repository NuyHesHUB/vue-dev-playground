import { defineStore } from "pinia";

export const useTestStore = defineStore('test', {
    state: () => ({
       teacher: {
            member_info: [] as any[],
       },
       student: {
            member_info: [] as any[],
       }
    }),
    getters: {
        getTeacherMember: (state: any) => {
            return state.teacher.member_info;
        },
        getStudentMember: (state: any) => {
            return state.student.member_info;
        },
    },
    actions: {
        setTeacherMember(member: any[]) {
            this.teacher.member_info = member;
        },
        setStudentMember(member: any[]) {
            this.student.member_info = member;
        }
    }
})