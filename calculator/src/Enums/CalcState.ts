/** 
 * イーナム　CalcState  　電卓の状態
 * ready                初期状態（入力待ち）
 * InputtingFirst　　　　１回目の入力（数字）
 * OperatorEntered　　 　演算子入力
 * InputtingSecond　　　 2回目の入力
 * ResultShown　　　　　　計算結果表示
 * Error　　　　　　　　　 エラー
 */

export enum CalcState{
    ready = "ready",
    InputtingFirst = "InputtingFirst",
    OperatorEntered = "OperatorEntered",
    InputtingSecond = "InputtingSecond",
    ResultShown = "ResultShown",
    Error = "Error"
}