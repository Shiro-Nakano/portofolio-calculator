/** 
 * クラス：KeyMapper          : ユーザーの押下したボタンをKeyTokenへ変換
 * 【Private】
 * -keyMap: Map    string    :
 * 【Public】
 * +resolve (target EventTarget)   KeyToken | null  
 */
import type { KeyToken } from "./TypeAlias/KeyToken"

export class KeyMapper{
    // 
    private keyMap: Map<string, KeyToken>;

    constructor(){
        // 入力値をボタン（string）→keyTokenに変換
        this.keyMap = new Map<string, KeyToken>([
            // 左が UIの文字（key）右:KeyToken
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            [".", "."],
            ["+", "+"],
            ["-", "-"],
            ["x", "x"],
            ["÷", "÷"],
            ["=", "="],
            ["C", "C"]
        ]);
    }
    /** 
     * @param   {EventTarget}       target　
     * @returns {KeyToken | null}           
     */
    public resolve(target: EventTarget): KeyToken | null{
        // 電卓のボタン以外の要素が押された時にnullで返す（instanceofの反転）
        if (!(target instanceof HTMLElement)){
            return null;
        }
        // クリックされた要素（key）の「表示テキスト」を取り出す(.!→nullでもエラーにしない)
        const dataKey = target.textContent?.trim();
        // keyでない場合：nullを返す
        if (!dataKey){
            return null;
        }
        // keyの場合：keyMapperから対応するKeyTokenを取り出す
        else{
            return this.keyMap.get(dataKey)?? null;
        }
    }
}