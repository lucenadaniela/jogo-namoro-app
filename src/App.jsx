import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Heart, Target, RotateCcw, Lock, Sparkles } from "lucide-react";

const LEVELS = [
  {
    id: 1,
    name: "Desafio inicial",
    target: 5,
    time: 20,
    spawnEvery: 1000,
    maxOnScreen: 5,
    messages: [
      "Você faz meu coração sorrir 💖",
      "Meu lugar favorito é perto de você",
      "Tudo fica mais bonito contigo",
      "Te amar é leve e especial",
      "Você é meu carinho preferido",
    ],
  },
  {
    id: 2,
    name: "Perfurando meu coração",
    target: 8,
    time: 22,
    spawnEvery: 850,
    maxOnScreen: 6,
    messages: [
      "Cada momento contigo vale ouro ✨",
      "Você é minha paz e meu riso",
      "Com você até o comum vira memória",
      "Seu abraço mora em mim",
      "Nosso amor é meu acerto favorito",
    ],
  },
  {
    id: 3,
    name: "Vai explodir",
    target: 10,
    time: 24,
    spawnEvery: 700,
    maxOnScreen: 7,
    messages: [
      "Você é o meu melhor presente 🎁",
      "Te escolher é fácil todos os dias",
      "Nosso amor é lindo de viver",
      "Você é meu sonho em versão real",
      "Chegou a hora da surpresa final 💘",
    ],
  },
];

function makeBalloon(id, message) {
  const left = 8 + Math.random() * 78;
  const size = 54 + Math.random() * 24;
  const duration = 4.5 + Math.random() * 2.5;
  const icons = ["🎈", "💖", "💕", "💘", "🌷", "✨"];

  return {
    id,
    message,
    left,
    size,
    duration,
    icon: icons[Math.floor(Math.random() * icons.length)],
  };
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [levelIndex, setLevelIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].time);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [lastMessage, setLastMessage] = useState(
    "Prepara o dedo e vem acertar meus balõezinhos 💘"
  );

  const idRef = useRef(1);
  const currentLevel = LEVELS[levelIndex];

  const finalSpecialMessage = useMemo(
    () =>
      "Você passou por todas as fases e desbloqueou meu coração. A verdade é que, todos os dias, eu escolho você. Obrigada por ser meu amor, meu sorriso favorito e a parte mais linda da minha vida. Feliz aniversário de namoro, meu amor. Eu te amo muito. ❤️",
    []
  );

  useEffect(() => {
    if (screen !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setScreen("gameover");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, levelIndex]);

  useEffect(() => {
    if (screen !== "playing") return;

    const spawner = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= currentLevel.maxOnScreen) return prev;
        const message =
          currentLevel.messages[
            Math.floor(Math.random() * currentLevel.messages.length)
          ];
        return [...prev, makeBalloon(idRef.current++, message)];
      });
    }, currentLevel.spawnEvery);

    return () => clearInterval(spawner);
  }, [screen, currentLevel]);

  function startGame() {
    setLevelIndex(0);
    setTimeLeft(LEVELS[0].time);
    setScore(0);
    setBalloons([]);
    setRevealed([]);
    setLastMessage("Acerta os balões para desbloquear meu coração 💝");
    setScreen("playing");
    idRef.current = 1;
  }

  function goToNextLevel() {
    const nextIndex = levelIndex + 1;

    if (nextIndex >= LEVELS.length) {
      setScreen("win");
      setBalloons([]);
      return;
    }

    setLevelIndex(nextIndex);
    setTimeLeft(LEVELS[nextIndex].time);
    setScore(0);
    setBalloons([]);
    setLastMessage(`Você chegou em: ${LEVELS[nextIndex].name} 💞`);
  }

  function popBalloon(balloonId, message) {
    const nextScore = score + 1;

    setBalloons((prev) => prev.filter((b) => b.id !== balloonId));
    setScore(nextScore);
    setLastMessage(message);

    setRevealed((prev) => (prev.includes(message) ? prev : [...prev, message]));

    if (nextScore >= currentLevel.target) {
      setTimeout(() => {
        goToNextLevel();
      }, 350);
    }
  }

  return (
    <div className="app">
      <div className="game-card">
        <div className="header">
          <div>
            <p className="mini-title">Mini Game do Amor</p>
            <h1>Pixel de Amor 🧸💖</h1>
          </div>
          <Heart size={30} />
        </div>

        {screen === "start" && (
          <div className="content">
            <div className="info-box">
              Passe pelas 3 fases estourando balões especiais. Se tu vencer
              tudo, vai desbloquear meu coração.
            </div>

            <div className="levels-list">
              {LEVELS.map((level) => (
                <div className="level-item" key={level.id}>
                  <div>
                    <strong>{level.name}</strong>
                    <p>
                      Meta: {level.target} acertos · Tempo: {level.time}s
                    </p>
                  </div>
                  <Target size={18} />
                </div>
              ))}
            </div>

            <button className="primary-btn" onClick={startGame}>
              Começar jogo
            </button>
          </div>
        )}

        {screen === "playing" && (
          <div className="content">
            <div className="stats">
              <div className="stat">
                <span>Fase</span>
                <strong>{currentLevel.id}/3</strong>
              </div>
              <div className="stat">
                <span>Pontos</span>
                <strong>
                  {score}/{currentLevel.target}
                </strong>
              </div>
              <div className="stat">
                <span>Tempo</span>
                <strong>{timeLeft}s</strong>
              </div>
            </div>

            <div className="stage-title-box">
              <strong>{currentLevel.name}</strong>
              <p>Meta: acertar {currentLevel.target} balões</p>
            </div>

            <div className="game-area">
              <div className="message-box">{lastMessage}</div>

              <div className="cloud cloud-1">☁️</div>
              <div className="cloud cloud-2">☁️</div>
              <div className="grass" />

              {balloons.map((balloon) => (
                <button
                  key={balloon.id}
                  className="balloon"
                  onClick={() => popBalloon(balloon.id, balloon.message)}
                  style={{
                    left: `${balloon.left}%`,
                    fontSize: `${balloon.size}px`,
                    animationDuration: `${balloon.duration}s`,
                  }}
                  aria-label={balloon.message}
                >
                  {balloon.icon}
                </button>
              ))}

              <div className="bow">🏹</div>
            </div>
          </div>
        )}

        {screen === "gameover" && (
          <div className="content center">
            <div className="emoji">🥺</div>
            <h2>Quase, meu amor</h2>
            <p className="muted">
              Faltou só mais um pouquinho para desbloquear meu coração. Tenta de
              novo 💞
            </p>

            <div className="lock-box">
              <Lock size={18} />
              <span>Meu coração ainda está bloqueadinho esperando você.</span>
            </div>

            <button className="dark-btn" onClick={startGame}>
              <RotateCcw size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        {screen === "win" && (
          <div className="content">
            <div className="center">
              <div className="emoji">🎉💖</div>
              <h2>Você desbloqueou meu coração</h2>
              <p className="muted">
                Você venceu todas as fases e chegou na parte mais especial desse
                presente.
              </p>
            </div>

            <div className="final-message">
              <div className="final-title">
                <Sparkles size={18} />
                <span>Pra você</span>
              </div>
              <p>{finalSpecialMessage}</p>
            </div>

            <div className="revealed-box">
              <strong>Pedacinhos do meu amor no caminho</strong>
              <div className="revealed-list">
                {revealed.map((msg, index) => (
                  <div className="revealed-item" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            <button className="dark-btn" onClick={startGame}>
              <RotateCcw size={16} />
              Jogar de novo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}