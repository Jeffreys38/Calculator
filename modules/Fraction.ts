import {ExpressionTemplate, Scope} from "@/interfaces/Expression";
import * as math from "mathjs";
import CommonHelper from "@/helpers/CommonHelper";
import {AdvancedOperations} from "@/constants/Operations";

class Fraction extends ExpressionTemplate {
    public _numerator: string;
    private _denominator: string;

    constructor(latexString: string) {
        super(latexString);
        this._numerator = "☐";
        this._denominator = "☐";
    }

    getLatexString(): string {
        return CommonHelper.formatString(
            this.latexString,
            this._numerator,
            this._denominator
        );
    }

    get numerator(): string {
        return this._numerator;
    }

    get denominator(): string {
        return this._denominator;
    }

    insertExp(cursorIndex: number, exp: string): void {
        const isAdvancedOperator = (value: any): value is AdvancedOperations => {
            return Object.values(AdvancedOperations).includes(value);
        };

        if (isAdvancedOperator(exp)) {
            alert("Nesting of additional operators is not yet supported.")
            return;
        }

        if (cursorIndex === 0) {
            this._numerator = this._numerator.replace("☐", "") + exp;
        } else if (cursorIndex === 1) {
            this._denominator = this._denominator.replace("☐", "") + exp;
        }
        this.latexString = this.formatFraction(this._numerator, this._denominator);
    };

    calculate(scope: Scope = { x: 0 }): number | string {
        const exp = (`${this._numerator}/${this._denominator}`)
            .replace(/\\times|\\modulus/g, '*');

        return math.evaluate(
            exp,
            scope
        );
    }

    getLatexStringWithCursor(blink: boolean): string {
        const numerator = this.cursorIndex === 0 ? (blink ? `${this._numerator}|` : `${this._numerator}`) : this._numerator;
        const denominator = this.cursorIndex === 1 ? (blink ? `${this._denominator}|` : `${this._denominator}`) : this._denominator;
        return this.formatFraction(numerator, denominator);
    }

    deleteExp(): void {
        if (this.cursorIndex === 0) {
            if (this._numerator.length > 0) {
                // Case: \\times, \\modulus, \sqrt{☐}, etc. not 1 character
                const lastChar = this._numerator[this._numerator.length - 1];
                if (lastChar.match(/[a-zA-Z]/)) {
                    this._numerator = this._numerator.replace(/(\\times|\\modulus)$/, '');
                } else {
                    this._numerator = this._numerator.slice(0, -1) || '☐'; // Remove the last character or reset to placeholder
                }
            }
        } else if (this.cursorIndex === 1) {
            if (this._denominator.length > 0) {
                this._denominator = this._denominator.slice(0, -1) || '☐'; // Remove the last character or reset to placeholder
            }
        }
        this.latexString = this.formatFraction(this._numerator, this._denominator);
    }

    private formatFraction(num: string, den: string) {
        return `\\frac{${num}}{${den}}`;
    }
}

export default Fraction;