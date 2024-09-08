import { ExpressionTemplate, Scope } from "@/interfaces/Expression";
import * as math from "mathjs";
import CommonHelper from "@/helpers/CommonHelper";
import { AdvancedOperations } from "@/constants/Operations";

class RootN extends ExpressionTemplate {
    private _radicand: string;
    private _index: string;

    constructor(latexString: string) {
        super(latexString);
        this._radicand = "☐";
        this._index = "☐";
    }

    getLatexString(): string {
        return CommonHelper.formatString(
            this.latexString,
            this._index,
            this._radicand
        );
    }

    get radicand(): string {
        return this._radicand;
    }

    get index(): string {
        return this._index;
    }

    insertExp(cursorIndex: number, exp: string): void {
        const isAdvancedOperator = (value: any): value is AdvancedOperations => {
            return Object.values(AdvancedOperations).includes(value);
        };

        if (isAdvancedOperator(exp)) {
            alert("Nesting of additional operators is not yet supported.");
            return;
        }

        if (cursorIndex === 0) {
            this._index = this._index.replace("☐", "") + exp;
        } else if (cursorIndex === 1) {
            // Limit radian if greater than can appear rendering issue
            if (this._radicand.length >= 2) {
                return;
            }
            this._radicand = this._radicand.replace("☐", "") + exp;
        }
        this.latexString = this.formatRootN(this._index, this._radicand);
    }

    calculate(scope: Scope = { x: 0 }): number | string {
        const exp = `(${this._radicand})^(1/${this._index})`.replace(/\\times|\\modulus/g, '*');
        return math.evaluate(exp, scope);
    }

    getLatexStringWithCursor(blink: boolean): string {
        const index = this.cursorIndex === 0 ? (blink ? `${this._index}|` : `${this._index}`) : this._index;
        const radicand = this.cursorIndex === 1 ? (blink ? `${this._radicand}|` : `${this._radicand}`) : this._radicand;
        return this.formatRootN(index, radicand);
    }

    deleteExp(): void {
        if (this.cursorIndex === 0) {
            if (this._index.length > 0) {
                this._index = this._index.slice(0, -1) || 'n';
            }
        } else if (this.cursorIndex === 1) {
            if (this._radicand.length > 0) {
                this._radicand = this._radicand.slice(0, -1) || '☐';
            }
        }
        this.latexString = this.formatRootN(this._index, this._radicand);
    }

    private formatRootN(index: string, radicand: string) {
        return `\\sqrt[${index}]{${radicand}}`;
    }
}

export default RootN;
