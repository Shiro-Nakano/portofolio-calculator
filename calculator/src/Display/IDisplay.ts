/** 
 * インターフェース　IDisplay:ディスプレイ表示
 * 【Private】
 * +render(text: string)　　　　　　：途中式や入力時の数字の表示メソッド
 * +renderError(message: string)　：エラー表示時のメソッド
 */

export interface IDisplay{
    render(text: string):void;
    renderError(message: string):void;
    renderHistory(text: string):void;
}