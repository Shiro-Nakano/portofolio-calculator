import {describe, it, expect}from "vitest";
import {NumberFormatter} from "../src/NumberFormatter"

describe("NumberFormatter", ()=>{
    const formatter = new NumberFormatter();
    describe("fits", () => {
        it("8桁以内の整数は true", () => {
        expect(formatter.fits(12345678)).toBe(true);
        });
    
        it("9桁の整数は false", () => {
        expect(formatter.fits(123456789)).toBe(false);
        });
    
        it("小数点を含んでも数字が8桁以内なら true", () => {
        expect(formatter.fits(1234.5678)).toBe(true);
        });
    
        it("小数部も含めて数字が9桁になると false", () => {
        expect(formatter.fits(123.456789)).toBe(false);
        });
    
        it("マイナス値でも桁数は数字のみで判定", () => {
        expect(formatter.fits(-12345678)).toBe(true);
        expect(formatter.fits(-123456789)).toBe(false);
        });
    });
});