/** 
 * クラス：Calculator :アプリの制御（状態遷移と評価タイミング）
 * 【Private】
 * -state: CalcState              　　　　　 状態の取得
 * -left: number|null              　　　　　左辺の
 * -operator: Operation | null     　　　　　演算子
 * -buffer: InputBuffer            　　　　　バッファー
 * -evaluator: Evaluator           　　　　　計算
 * -formatter: NumberFormatter     　　　　　表示文字列の形成
 * -display: IDisplay              　　　　　描画
 * 
 * 【Public】
 * +handle (token: KeyToken).      void.    
 * +handleDigit(d: number)         void    　 数字ボタン押下時の処理のメソッド
 * +handleDecimalPoint()           void      小数点ボタン押下時の処理のメソッド
 * +handleOperator(op: Operation)  void　　　  演算子ボタン押下時の処理のメソッド
 * +handleEqual()                  void       イコールボタン押下時の処理のメソッド
 * +handleCalculationError(error: unknown)  void    エラー内容の判定のメソッド
 * +handleClear()                  void 　 　  クリアボタン押下時の処理のメソッド
 */

// クラスのimport
import type { IDisplay } from "../src/Display/IDisplay";
import { InputBuffer } from "./InputBuffer";
import { Evaluator } from "./Evaluator";
import { NumberFormatter } from "./NumberFormatter";
import { DivideByZero } from "./DivideByZero";
import { CalcState } from "./Enums/CalcState";
import { Operation } from "./Enums/Operation";
import type { KeyToken } from "./TypeAlias/KeyToken";


export class Calculator {
    // 【Private】
    // メンバー変数：状態の取得
    private state: CalcState = CalcState.ready;
    // メンバー変数：左辺の初期値（null）
    private left: number | null = null;
    // メンバー変数：演算子の初期値（null）
    private operatorType: Operation | null = null;
    // メンバー変数：履歴の初期設定（空欄）
    private history: string = "";

    constructor(
        // 初期値:各クラスで設定した内容を引っ張ってくる
        private readonly display: IDisplay,
        private readonly formatter = new NumberFormatter(),
        private readonly evaluator = new Evaluator(),
        private readonly buffer = new InputBuffer()
    ) {
        this.display.render(this.buffer.toString());
    }

    /** 
     * operator: KeyTokenにて入力された内容を対応するOperationのキーを返す
     * @param   {KeyToken}          token  入力されたキー
     * @returns {Operation | null}   　　   演算子がある・ないで返す
     */
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
     * handle: KeyTokenを適切なハンドラへ渡す
     * @param   {KeyToken}          token  入力されたキー
     * @returns {void}   　　               押下されたtokenに応じて各処理を返す
     */
    public handle(token: KeyToken): void {
        const bufferString = this.buffer.toString();
        // 『ready』状態の時
        if (this.state === CalcState.ready) {
            // 第一数前の『-』押下時
            if (token === "-") {
            if (bufferString === "-") return; // 二重マイナス無視
            this.buffer.clear();
            this.buffer.setNegative();
            this.display.render(this.buffer.toString());
            this.state = CalcState.InputtingFirst;
            return;
            }
            // 小数点押下時
            if (token === ".") {
                this.buffer.pushDigit(0);
                this.buffer.pushDecimal();
                this.display.render(this.buffer.toString());
                this.state = CalcState.InputtingFirst;
                return;
            }
            // ready状態で 『-』以外の演算子入力→『0(演算子)』と表示
            const opReady = this.operator(token);
            if (opReady) {
                this.left = 0;
                this.operatorType = opReady;
                this.state = CalcState.OperatorEntered;
                this.history = `0 ${opReady}`;
                this.display.renderHistory(this.history);
                this.display.render("0");
                return;
            }
        }
        // InputtingFirst 状態で 『-』を押下時
        if (this.state === CalcState.InputtingFirst && token === "-") {
            // マイナスの連続押下を無視
            if (bufferString === "-") {
                return; 
            }
        }
        // 数字押下時
        if (token >= "0" && token <= "9") {
            this.handleDigit(Number(token));
            return;
        }
        // 小数点押下時
        if (token === ".") {
            this.handleDecimalPoint();
            return;
        }
        // イコール押下時
        if (token === "=") {
            this.handleEqual();
            return;
        }
        // クリア押下時
        if (token === "C") {
            this.handleClear();
            return;
        }
        // 演算子押下時
        const op = this.operator(token);
        if (op) {
            this.handleOperator(op);
        }
    }

    // 各キーの入力後の処理
    /** 
     * handleDigit: 　　　　　　　　　数字ボタン押下時の処理
     * @param   {number}     d  　　入力された数値
     * @returns {void}   　　       押下時に返す処理  
     */
    public handleDigit(d: number): void {
        // 『Error』状態の場合は数字入力で復帰する
        if (this.state === CalcState.Error) {
            this.buffer.clear();
            this.state = CalcState.InputtingFirst;
        }
        // 『ResultShown』(結果表示)状態の場合は新規入力に切り替える
        if (this.state === CalcState.ResultShown) {
            this.buffer.clear();
            this.left = null;
            this.state = CalcState.InputtingFirst;
        }
        // バッファに数字を追加・表示する
        this.buffer.pushDigit(d);
        this.display.render(this.buffer.toString());
        // 『ready』の場合『InputtingFirst』に移動する
        if (this.state === CalcState.ready) {
            this.state = CalcState.InputtingFirst;
        }
    }

    /** 
     * handleDecimalPoint: 　　　　　小数点ボタン押下時の処理
     * @returns {void}   　　       押下時に返す処理  
     */
    public handleDecimalPoint(): void {
        const bufferString = this.buffer.toString();
        // 現在入力が『-』のみの状態かつ小数点を押した場合の特別対応
        if (bufferString === "-") {
            this.buffer.pushDigit(0);
            this.buffer.pushDecimal();
            this.display.render(this.buffer.toString());
            return;
        }
        // 小数点の重複を防ぐ
        if (bufferString.includes(".")) {
            return;
        }
        // 通常の小数点入力
        this.buffer.pushDecimal();
        this.display.render(this.buffer.toString());
        // 『ready』状態の場合『InputtingFirst』へ
        if (this.state === CalcState.ready) {
            this.state = CalcState.InputtingFirst;
        }
    }

    /** 
     * handleOperator: 　　　　　　  　演算子ボタン押下時の処理
     * @param   {Operation}   op   　入力された数値
     * @returns {void}   　　        押下時に返す処理  
     */
    public handleOperator(op: Operation): void {
        // 現在のバッファの値を数値へ変換
        const bufferString = this.buffer.toString();

        let num: number;
        // 『-』『""』『0.』は『０』として扱う
        if (bufferString === "-" || bufferString === "" || bufferString === "0.") {
            num = 0;
        } 
        // それ以外
        else {
            num = Number(bufferString.replace(/\.$/, ""));
        }
        // 『ready』か『InputtingFirst』の状態の場合：今入力した数字を left に確定・演算子状態（OperatorEntered）へ遷移
        if (this.state === CalcState.InputtingFirst || this.state === CalcState.ready) {
            this.left = num;
            this.operatorType = op;
            this.state = CalcState.OperatorEntered;
            // 履歴更新
            this.history = `${num} ${op}`;
            this.display.renderHistory(this.history);
            this.display.render(this.formatter.formatForDisplay(num));
            this.buffer.clear();
            return;
        }

        // 『ResultShown』の状態のとき：直前の計算結果（left）に対して演算子入力を開始
        if (this.state === CalcState.ResultShown) {
            this.state = CalcState.OperatorEntered;
            this.operatorType = op;
            this.history = `${this.left ?? 0} ${op}`;
            this.display.renderHistory(this.history);
            this.buffer.clear();
            return;
        }

        // 『OperatorEntered』の状態の時：演算子連打・途中計算
        if (this.state === CalcState.OperatorEntered) {
            if (this.buffer.isEmpty()) {
                // buffer空の場合：単に演算子を切り替える
                this.operatorType = op;
                this.history = `${this.left ?? 0} ${op}`;
                this.display.renderHistory(this.history);
                this.display.render(this.formatter.formatForDisplay(this.left ?? 0));
                return;
            }

            // bufferに数字がある場合：計算を行い次へ
            const right = bufferString === "-" ? 0 : Number(bufferString.replace(/\.$/, ""));
            try {
                const result = this.evaluator.compute(this.left!, this.operatorType!, right);
                this.left = result;
                this.operatorType = op;
                this.display.render(this.formatter.formatForDisplay(result));
                this.history = `${result} ${op}`;
                this.display.renderHistory(this.history);
                this.buffer.clear();
            } catch (error) {
                this.handleCalculationError(error);
            }
        }
    }

    /** 
     * handleEqual: 　　　　　　イコールボタン押下時の処理
     * @returns {void}   　　  押下時に返す処理       
     */
    public handleEqual(): void {
        // すでに『ResultShown』の状態の場合は何もしない
        if (this.state === CalcState.ResultShown) {
            return;
        }
        // 演算可能な条件でない場合は何も行わない（数字だけで『=』押下しても計算不可）
        if (!this.operatorType || this.left === null) {
            return;
        }
        // 右辺の取り出し（『-』のみは「0」・末尾の小数点は削除し数値化）
        const right = this.buffer.toString() === "-" ? 0 : Number(this.buffer.toString().replace(/\.$/, ""));
        // 履歴を表示エリアに反映
        this.history = `${this.left}${this.operatorType}${right}=`;
        this.display.renderHistory(this.history);
        // エラーを含んだ計算実行処理
        try {
            const result = this.evaluator.compute(this.left, this.operatorType, right);
            this.display.render(this.formatter.formatForDisplay(result));
            this.left = result;
            this.state = CalcState.ResultShown;
            this.buffer.clear();
        } catch (error) {
            this.handleCalculationError(error);
        }
    }

    /** 
     * handleCalculationError: エラー内容の判別
     * @param   {unknown}       error  エラー内容
     * @returns {void}   　　           エラー内容応じ返す処理
     */
    private handleCalculationError(error: unknown):void {
        // 『DivideByZero』のエラーの場合
        if (error instanceof DivideByZero) {
            this.display.render("エラー");
        } 
        // それ以外のエラー
        else {
            this.display.render("Error");
            console.error(error);
        }
        // 状態を『Error』へ
        this.state = CalcState.Error;
        // 入力をクリア
        this.buffer.clear();
    }

    /** 
     * handleClear: 　　　　　　クリアボタン押下時の処理
     * @returns {void}   　　  押下時に返す処理       
     */
    public handleClear(): void {
        // 入力クリア
        this.buffer.clear();
        this.display.render("0");
        this.display.clearHistory();
        this.history = "";
        // 状態を『ready』へ
        this.state = CalcState.ready;
        this.left = null;
        this.operatorType = null;
    }
}
