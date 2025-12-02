/** 
 * クラス　Evaluator　　:計算処理
 * 【Public】
 * +compute(a: number, op:Operation, b:number)   number  数値a→演算子→数値bを行い、計算結果を返す     
 */

// クラスのimport
// ↓演算子の引用のため
import { Operation } from "./Enums/Operation";
// ↓エラーの引用のため
import { DivideByZero } from "./DivideByZero";


export class Evaluator{
    public compute(a: number, op:Operation, b:number):number{
        switch(op){
            case Operation.add:
                return a + b ;
            case Operation.subtract:
                return a - b;
            case Operation.multiply:
                return a * b;
            case Operation.divide:
                if(b === 0){
                    throw new DivideByZero("０除算は不可")
                }
                return a / b;
        }
    }
}