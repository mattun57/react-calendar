import { useState, useEffect } from 'react';
import './App.css';

// 表示するシンボルの配列 (空白、◯、△、✕)
const symbols = [' ', '◯', '△', '✕'];

function App() {
  // 現在表示している月を管理する状態
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // 各日付ごとのシンボル選択状態を保持
  const [selectedDays, setSelectedDays] = useState<Record<string, number>>({});
  // インポート用ポップアップの表示状態
  const [showImportPopup, setShowImportPopup] = useState(false);
  // インポートテキストエリアの内容を保持
  const [importText, setImportText] = useState('');

  // 初回レンダー時に現在の月を設定
  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  // カレンダーの日付クリック時の処理
  const handleDayClick = (day: number) => {
    setSelectedDays((prev) => {
      const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`;
      const nextIndex = (prev[key] ?? 0) + 1;
      return { ...prev, [key]: nextIndex % symbols.length };
    });
  };

  // 前月・次月への移動
  const changeMonth = (offset: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  // データをJSON形式でエクスポート
  const handleExport = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const result = Array.from({ length: daysInMonth }, (_, i) => {
      const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${i + 1}`;
      return selectedDays[key] ?? 0;
    });
    alert(JSON.stringify(result));
  };

  // JSONデータをインポートし、カレンダーに反映
  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (Array.isArray(data)) {
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const newSelectedDays: Record<string, number> = {};
        data.slice(0, daysInMonth).forEach((value, index) => {
          const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${index + 1}`;
          if (typeof value === 'number' && value >= 0 && value < symbols.length) {
            newSelectedDays[key] = value;
          }
        });
        setSelectedDays(newSelectedDays);
        setShowImportPopup(false);
        setImportText('');
      }
    } catch (e) {
      alert('入力が正しくありません。');
    }
  };

  // カレンダーのUIを生成
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // 月初の空白埋め
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="empty" />);
    }

    // 日付セルの生成
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${month}-${day}`;
      const dayOfWeek = new Date(year, month, day).getDay();
      const dayClass = dayOfWeek === 0 ? 'day red' : dayOfWeek === 6 ? 'day blue' : 'day';

      days.push(
        <div key={day} className={dayClass} onClick={() => handleDayClick(day)}>
          <span className="day-number">{day}</span>
          <div className="symbol">{symbols[selectedDays[key] ?? 0]}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-wrapper">
      <div className="top-buttons">
        <button onClick={handleExport}>出力</button>
        <button onClick={() => setShowImportPopup(true)}>取込</button>
      </div>
      {showImportPopup && (
        <div className="popup">
          <textarea value={importText} onChange={(e) => setImportText(e.target.value)} />
          <div className="popup-buttons">
            <button onClick={() => setShowImportPopup(false)}>閉じる</button>
            <button onClick={handleImport}>反映</button>
          </div>
        </div>
      )}
      <button className="nav-button left" onClick={() => changeMonth(-1)}>&lt;</button>
      <div className="calendar-container pop-style">
        <h1 className="calendar-title">
          {currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h1>
        <div className="calendar-grid">
          <div className="day-header">日</div>
          <div className="day-header">月</div>
          <div className="day-header">火</div>
          <div className="day-header">水</div>
          <div className="day-header">木</div>
          <div className="day-header">金</div>
          <div className="day-header">土</div>
          {renderCalendar()}
        </div>
      </div>
      <button className="nav-button right" onClick={() => changeMonth(1)}>&gt;</button>
    </div>
  );
}

export default App;
