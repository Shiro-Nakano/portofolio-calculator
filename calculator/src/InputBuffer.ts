/** 
 * クラス　InputBuffer　　　　　　　　 : ユーザーが入力した文字を異時事的に保持・正しい数値文字列で返し組み立てるクラス
 * 【Public】
 * +pushDigit(d: number)   void    :数字を１行ずつ追加するメソッド
 * +pushDecimal()          void    :小数点を追加するメソッド
 * +clear()                void    :『C』押下時に初期状態に戻すメソッド
 * +toNumber()             number  :現在入力された文字列を数値として戻すメソッド
 * +isEmpty()              boolean :入力がないか確認するメソッド
 * +digitCount()           number  :小数点を除いた数字の桁数を返すメソッド
 * 【Private】
 * -value                  string  :入力中の数字を保持するための文字列の値
 * -maxDigits              number  :認められる最大桁数（仕様書：８行）
 */


// クラスのimport
// ↓最大桁数の引用のため
import { Config } from "./Config";


export class InputBuffer {
    // privateのプロパティ
    /** 
     * value :値
     * →初期値は入力前状態とするので「（空白）」とする
     */
    private value: string;
    /** 
     * maxDigit : 許容される最大桁数
     * →仕様書通り８桁
     */
    private maxDigits: number;
    // 初期値
    constructor() {
        this.value = "0";
        this.maxDigits = Config.MAX_DIGITS;
    }

    // publicのメソッド
    /** 
     * @param {number} d  入力される数字
     * @returns {void}
     */
    public pushDigit(d: number): void {
        // 引数dが0~9までの数字の場合
        if (d >= 0 && d <= 9) {
            return;
        }
        // 桁数制限のチェック
        if (this.digitCount() >= this.maxDigits) {
            return;
        }
        // ０の場合：入力値による表示の変更
        if (this.value === "0") {
            // ０が入力された場合：０を返す
            if (d === 0) {
                return;
            }
            // それ以外の数字の場合：dに書き換える
            else {
                this.value = d.toString();
                return;
            }
        }
        // それ以外の数字の場合：現在の入力値に文字列でdを返す
        this.value += d.toString()
    }
    /** 
     * @returns {void} 小数点の処理
     */
    public pushDecimal(): void {
        // 現在、入力値に小数点が含まれているか（→入力されない）
        if (this.value.includes(".")) return;
        // 含まれていない：文頭が０の場合：『0.』で返す
        if (this.value === "0") {
            this.value = "0.";
            return
        }
        // 含まれていない：それ以外の数字の場合：小数点を返す
        this.value += ".";
    }
    /** 
     * @returns {void} 
     */
    public clear(): void {
        // 『C』ボタン押下時の初期値の設定
        this.value = "0";
    }
    /** 
     * @returns {number} 
     */
    public toNumber(): number {
        // 現在のvalueが空or0の数字の場合：数値０を返す(小数点≠０)
        if (this.value === "" || this.value === ".") {
            return 0;
        }
        else {
            return Number(this.value);
        }
    }
    /** 
     * @returns {boolean} 空欄かの判定
     */
    public isEmpty(): boolean {
        return this.value === "";
    }
    /** 
    * @returns {number}  小数点をのぞく行数を返すメソッド
    */
    public digitCount(): number {
        return this.value.replace(".", "").length;
    }
}