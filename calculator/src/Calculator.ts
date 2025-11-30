/** 
 * クラス：Calculator :アプリの制御（状態遷移と評価タイミング）
 * 【Private】
 * -state: CalcState              　　　　　 状態
 * -left: number|null              　　　　　左辺の数字
 * -operator: Operation | null     　　　　　演算子
 * -buffer: InputBuffer            　　　　　バッファー
 * -evaluator: Evaluator           　　　　　計算
 * -formatter: NumberFormatter     　　　　　表示文字列の形成
 * -display: IDisplay              　　　　　描画
 * 
 * 【Public】
 * +handle 
 * +handleDigit(d: number):void    
 * +handleDecimalPoint(): void             小数点押下時の動作
 * +handleOperator(op: Operation): void
 * +handleEqual(): void
 * +handleClear: void
 */


// クラスのimport
// 各クラス
import type { IDisplay } from "../src/Display/IDisplay";
import { InputBuffer } from "./InputBuffer";
import { Evaluator } from "./Evaluator";
import { NumberFormatter } from "./NumberFormatter";

// イーナム
import { CalcState } from "./Enums/CalcState";
import { Operation } from "./Enums/Operation";
// 型エイリアス
import type { KeyToken } from "./TypeAlias/KeyToken";


export class Calculator {
    // 【Private】
    private state: CalcState = CalcState.ready;
    private left: number | null = null;
    private operatorType: Operation | null = null;

    constructor(
        private readonly display: IDisplay,
        private readonly formatter = new NumberFormatter(),
        private readonly evaluator = new Evaluator(),
        private readonly buffer = new InputBuffer()
    ) {    
            this.display.render(this.buffer.toString()
        );
}

  // KeyToken→Operatorに変更
    private operator(token: KeyToken): Operation | null {
        switch (token) {
            case "+": return Operation.add;
            case "-": return Operation.subtract;
            case "x": return Operation.multiply;
            case "÷": return Operation.divide;
            default: return null;
        }
    }

    // 【Public】
    /** 
     * KeyTokenを適切なハンドラへ渡す
    */
    public handle(token: KeyToken): void {
    // ⭐️FirstInputのマイナスを追加
        if (token >= "0" && token <= "9") {
            this.handleDigit(Number(token));
            return;
        }

        if (token === ".") {
            this.handleDecimalPoint();
            return;
        }

        if (token === "=") {
            this.handleEqual();
            return;
        }

        if (token === "C") {
            this.handleClear();
            return;
        }
        // 演算子
        const op = this.operator(token);
        if (op) {
            this.handleOperator(op);
        }
    }

    // 各ハンドラーの具体的な動作内容

    /** 
     * 数字キー 押下時の処理
     */
    public handleDigit(d: number): void {
        // 例外処理：『Error』表示後に数字ボタンを押下すると初期化される。
        if(this.state === CalcState.Error){
            this.buffer.clear();
            this.state = CalcState.InputtingFirst;
        }
        // 通常処理：
        if (this.state === CalcState.ResultShown) {
            this.buffer.clear();
            this.left = null;
            this.state = CalcState.InputtingFirst;
        }

        this.buffer.pushDigit(d);
        this.display.render(this.buffer.toString());

        if (this.state === CalcState.ready) {
            this.state = CalcState.InputtingFirst;
        }
    }

    /** 
     * 小数点キー押下時
     */
    public handleDecimalPoint(): void {
        this.buffer.pushDecimal();
        this.display.render(this.buffer.toString());
    }

    /** 
     * 演算子キー押下時
     */
    public handleOperator(op: Operation): void {
        if (this.state === CalcState.InputtingFirst) {
            this.left = this.buffer.toNumber();
            this.buffer.clear();
            this.state = CalcState.OperatorEntered;
        } else if (this.state === CalcState.OperatorEntered) {
            // 2回目の演算子押下時
            const right = this.buffer.toNumber();
            const result = this.evaluator.compute(this.left!, this.operatorType!, right);
            this.left = result;
            this.display.render(this.formatter.formatForDisplay(result));
            this.buffer.clear();
        }
        this.operatorType = op;
    }
    

    /** 
     * イコールキー押下時の処理
     */
    public handleEqual(): void {
        // すでに結果が表示されている場合は計算しない
        if(this.state === CalcState.ResultShown){
            return;
        }

        // 
        if (!this.operatorType || this.left === null) {
            return;
        }

        const right = this.buffer.toNumber();
        // 例外処理：割り算0除算時のエラー
        try{
            const result = this.evaluator.compute(this.left, this.operatorType, right);

            this.display.render(this.formatter.formatForDisplay(result));
            this.left = result;
            this.state = CalcState.ResultShown;
        }
        catch(error){
            // エラー時の表示
            this.display.render("Error");
            this.state = CalcState.Error;
            // バッファのリセット
            this.buffer.clear();
        }
    }

    /** 
     * クリアーキー押下時の処理
     */
    public handleClear(): void {
        // バッファの初期化
        this.buffer.clear();
        // 『０』を表示
        this.display.render("0");
        // ready状態に移行
        this.state = CalcState.ready;
    }
}
