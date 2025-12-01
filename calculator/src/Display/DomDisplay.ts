/** 
 * クラス　DomDisplay               ディスプレイ周りのDom
 * 【Private】
 * -historyEl                      計算履歴のプロパティ
 * -resultEl　　　　　　　　　　　　　　計算結果のプロパティ
 * 【Public】
 * +render(text: string)　　　　　     void　:途中式や入力時の数字の表示メソッド
 * +renderError(message: string) 　　 void　:エラー表示時のメソッド
 * +renderHistory(text: string)      void  :履歴エリアの表示メソッド
 * +clearHistory()               　　 void  :履歴エリアの削除メソッド
 */

// クラスのimport
import type{ IDisplay } from "./IDisplay";

export class DomDisplay implements IDisplay{
    // 【Private】
    private historyEl: HTMLDivElement;
    private resultEl: HTMLDivElement;


    constructor (){
    // HTML(ディスプレイ計算履歴・結果）のDom取得
    const historyEl = document.getElementById("history")as HTMLDivElement;
    const resultEl = document.getElementById("result-display") as HTMLDivElement;

    // 例外処理:null時エラーケース
    if(!resultEl || !historyEl){
        throw new Error("ディスプレイに表示できるものがありません");
    }
    // 通常処理
    else{
        this.historyEl = historyEl;
        this.resultEl = resultEl;
    }
    }

    // 【Public】
    /** 
     * render                途中式や入力時の数字の表示メソッド
     * @param {string}  text 画面に表示する文字列
     * @return {void}　　　　　
     */
    public render(text: string): void {
        this.resultEl.textContent = text;
    }

    /** 
     * renderError               エラー表示時のメソッド
     * @param {string} message 　エラー表示時ログ表示
     * @return {void}　　　　　　　
     */
    public renderError(message: string): void {
        this.resultEl.textContent = message;
        // ⭐️コンソールエラーがいるか確認
        console.error("入力にエラーがあります");
        
    }

    /** 
     * renderHistory          履歴エリアの表示メソッド 
     * @param {string}  text
     * @return {void}　　　　　　　
     */
    public renderHistory(text: string): void {
        this.historyEl.textContent = text;
    }

    /** 
     * renderHistory           履歴エリアの削除メソッド
     * @return {void}　　　　　　　
     */
        public clearHistory(): void {
            this.historyEl.textContent = "0";
        }
}