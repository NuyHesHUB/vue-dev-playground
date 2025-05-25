import type { AgGridButton } from "../../type/ag-grid-button.type";

interface ButtonContext {
    moveToLink:  (params: any, type: string) => void;
    getUserType: () => string;
    teacherAndClass: boolean;
}

interface ButtonStrategy {
    getButtons(): AgGridButton[];
}

export type {
    ButtonContext,
    ButtonStrategy
}