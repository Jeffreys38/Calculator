import {IExpressionMethods} from "@/interfaces/IExpressionMethods";

export interface Cursor {
    index: number,
    positionInLength: number
}

export interface Scope {
    [key: string]: number
}

export abstract class ExpressionTemplate implements IExpressionMethods {
    protected latexString: string;
    cursorIndex: number = 0;

    constructor(latexString: string) {
        this.latexString = latexString;
    }

    abstract calculate(scope?: Scope): number | string;

    abstract insertExp(cursorIndex: number, exp: string): void;

    abstract getLatexString(): string;

    abstract deleteExp(): void;

    abstract getLatexStringWithCursor(blink: boolean): string;
}