/** 
 * クラス　IDisplay:ディスプレイ表示
 * 【Public】
 * +render(text: string)　　　　　　：途中式や入力時の数字の表示メソッド
 * +renderError(message: string)　：エラー表示時のメソッド
 */

import type{ IDisplay } from "./IDisplay";

export class DomDisplay implements IDisplay{
    // HTMLDivタグ（ディスプレイ）のDom取得
    private el: HTMLDivElement;

    constructor (){
    const element = document.getElementById("display") as HTMLDivElement;
    // null時の例外処理（エラーケース）
    if(!element){
        throw new Error("ディスプレイに表示できるものがありません");
    }
    this.el = element;
    }

    /** 
     * @param {string}  text 画面に表示する文字列
     * @return {void}　　　　　画面への反映処理
     */
    public render(text: string): void {
        this.el.textContent = text;
    }
    /** 
     * @param {string} message 　エラー表示時ログ表示
     * @return {void}　　　　　　　コンソール出力処理
     */
    public renderError(message: string): void {
        this.el.textContent = message;
        // ⭐️コンソールエラーがいるか確認
        console.error("入力にエラーがあります");
        
    }
}