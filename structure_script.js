

// ストラクチャーデータ（ブラインドと時間の設定）
let levels = [];  // グローバルにlevelsを宣言
let currentLevelIndex = 0;
let timer;
  
// ストラクチャー情報の更新
function updateStructure() {
  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[currentLevelIndex + 1] || levels[0]; // 次のレベルがない場合は最初のレベルに戻る

  document.getElementById('current-level').textContent = `BLINDS ${currentLevel.blinds.sb}/${currentLevel.blinds.bb}`;
  document.getElementById('next-level').textContent = `next ${nextLevel.blinds.sb}/${nextLevel.blinds.bb}`;
  
  startTimer(currentLevel.time);
}
  
// タイマーの開始
function startTimer(time) {
  let remainingTime = time * 60; // 秒に変換

  function updateTime() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('remaining-time').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (remainingTime <= 0) {
      clearInterval(timer);
      currentLevelIndex = (currentLevelIndex + 1) % levels.length; // 次のレベルに進む
      updateStructure();
    } else {
      remainingTime--;
    }
  }

  updateTime(); // 初期表示
  timer = setInterval(updateTime, 1000); // 1秒ごとに更新
}
  
// 自動生成する関数
function generateBlindLevels(playerCount, playTime) {
  const levels = [];

  // 設定: 初期値とレベル数
  const initialSB = 5;
  const initialBB = 10;
  const totalLevels = 10;
  const levelDuration = playTime / totalLevels; // 1レベルの時間（分）
  const growthRate = 1.5; // ブラインドの増加率

  // レベルを計算
  for (let i = 0; i < totalLevels; i++) {
      const sb_temp = Math.round(initialSB * Math.pow(growthRate, i));
      const bb = Math.round(sb_temp * 2 / 10) * 10;
      const sb = bb / 2

      levels.push({
          blinds: { sb, bb },
          time: levelDuration,
      });
  }

  return levels;
}

function initializeStructure() {
  do {
    playerCount = parseInt(prompt("Enter the number of players (2-6):"), 10);
  } while (isNaN(playerCount) || playerCount < 2 || playerCount > 6);
  do {
    playTime = parseInt(prompt("Enter the time to play (min):"));
  } while (isNaN(playTime));
  levels = generateBlindLevels(playerCount, playTime);
  updateStructure();
}
// 初期表示
initializeStructure();
  