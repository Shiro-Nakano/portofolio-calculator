// クラスのimport
// ↓画面表示の反映のため
import { DomDisplay } from "./Display/DomDisplay";
// ↓計算・状態管理を行うため
import { Calculator } from "./Calculator";
// ↓押下せれた内容をToken化するため
import { KeyMapper } from "./KeyMapper";

// importクラスからインスタンス生成
const display = new DomDisplay();
const calculator = new Calculator(display);
const mapper = new KeyMapper();

// ボタンイベント登録（電卓内の全button要素を取得）
document.querySelectorAll(".buttons > button").forEach(btn => {
    btn.addEventListener("click", e => {
        // 押下時にDom要素からKeyTokenを取得
    const token = mapper.resolve(e.target as HTMLElement);
    // TekTokenが取得できた場合Calculatorに渡す
    if (token) {
        calculator.handle(token);
    }
    });
});