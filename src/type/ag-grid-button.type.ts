interface AgGridButton {
    show?     : boolean;
    label     : string;
    className?: string;
    tabindex? : number;
    onClick: () => void;
}

export type {
    AgGridButton
}