        const SoundEngine = {
            ctx: null,
            muted: false,
            init() {
                if (!this.ctx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) this.ctx = new AudioCtx();
                }
            },
            playClick() {
                if (this.muted) return;
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(450, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            },
            playCorrect() {
                if (this.muted) return;
                this.init();
                if (!this.ctx) return;
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const now = this.ctx.currentTime + (idx * 0.08);
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.2);
                });
            },
            playWrong() {
                if (this.muted) return;
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(110, now + 0.25);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.28);
            },
            playFanfare() {
                if (this.muted) return;
                this.init();
                if (!this.ctx) return;
                const chord = [523.25, 659.25, 783.99, 1046.50];
                chord.forEach(freq => {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.8);
                });
            }
        };

        const MathGenerator = {
            getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            generate(type, difficulty) {
                if (type === 'mixed') {
                    const types = ['addition', 'subtraction', 'multiplication', 'division', 'missing'];
                    type = types[this.getRandomInt(0, types.length - 1)];
                }

                const isEasy = (difficulty === 'easy');

                switch (type) {
                    case 'addition': {
                        if (isEasy) {
                            // EASY: Friendly 2-digit sums
                            const a = this.getRandomInt(12, 55);
                            const b = this.getRandomInt(11, 44);
                            return {
                                text: `${a} + ${b} = ?`,
                                ans: a + b,
                                hint: `Add ones: ${a % 10} + ${b % 10}, then add tens!`
                            };
                        } else {
                            // NORMAL: 3-digit carrying
                            const a = this.getRandomInt(125, 499);
                            const b = this.getRandomInt(148, 489);
                            return {
                                text: `${a} + ${b} = ?`,
                                ans: a + b,
                                hint: `Add ones place first: ${a % 10} + ${b % 10}.`
                            };
                        }
                    }
                    case 'subtraction': {
                        if (isEasy) {
                            // EASY: Clean 2-digit subtraction
                            const a = this.getRandomInt(25, 89);
                            const b = this.getRandomInt(10, a - 5);
                            return {
                                text: `${a} - ${b} = ?`,
                                ans: a - b,
                                hint: `Subtract ones place, then subtract tens place!`
                            };
                        } else {
                            // NORMAL: 3-digit borrowing
                            const a = this.getRandomInt(412, 985);
                            const b = this.getRandomInt(145, a - 50);
                            return {
                                text: `${a} - ${b} = ?`,
                                ans: a - b,
                                hint: `Remember to borrow if top digit is smaller!`
                            };
                        }
                    }
                    case 'multiplication': {
                        if (isEasy) {
                            // EASY: Tables 2x2 to 9x9
                            const a = this.getRandomInt(2, 9);
                            const b = this.getRandomInt(2, 9);
                            return {
                                text: `${a} × ${b} = ?`,
                                ans: a * b,
                                hint: `Think of ${a} groups of ${b}!`
                            };
                        } else {
                            // NORMAL: Tables 3x3 to 12x12
                            const a = this.getRandomInt(3, 12);
                            const b = this.getRandomInt(4, 12);
                            return {
                                text: `${a} × ${b} = ?`,
                                ans: a * b,
                                hint: `Double check your multiplication tables!`
                            };
                        }
                    }
                    case 'division': {
                        if (isEasy) {
                            // EASY: Facts up to 81 / 9
                            const b = this.getRandomInt(2, 9);
                            const ans = this.getRandomInt(2, 9);
                            const a = b * ans;
                            return {
                                text: `${a} ÷ ${b} = ?`,
                                ans: ans,
                                hint: `What number times ${b} equals ${a}?`
                            };
                        } else {
                            // NORMAL: Facts up to 144 / 12
                            const b = this.getRandomInt(3, 12);
                            const ans = this.getRandomInt(3, 12);
                            const a = b * ans;
                            return {
                                text: `${a} ÷ ${b} = ?`,
                                ans: ans,
                                hint: `What number multiplied by ${b} makes ${a}?`
                            };
                        }
                    }
                    case 'missing': {
                        if (isEasy) {
                            const a = this.getRandomInt(2, 9);
                            const ans = this.getRandomInt(2, 9);
                            const c = a * ans;
                            return {
                                text: `${a} × ? = ${c}`,
                                ans: ans,
                                hint: `Divide ${c} by ${a} to find the missing factor!`
                            };
                        } else {
                            const a = this.getRandomInt(25, 85);
                            const ans = this.getRandomInt(20, 75);
                            const c = a + ans;
                            return {
                                text: `${a} + ? = ${c}`,
                                ans: ans,
                                hint: `Subtract ${a} from ${c} to find ?!`
                            };
                        }
                    }
                }
            }
        };

        let currentDifficulty = 'easy';
        let currentMode = 'addition';
        let currentQuestion = null;
        let typedInput = '';
        let score = 0;
        let stars = 0;
        let streak = 0;
        let speedTimer = null;
        let speedTimeLeft = 60;
        let speedScore = 0;

        function setDifficulty(diff) {
            SoundEngine.playClick();
            currentDifficulty = diff;

            const easyBtn = document.getElementById('diff-easy-btn');
            const normalBtn = document.getElementById('diff-normal-btn');
            const subtitle = document.getElementById('diff-mode-subtitle');

            if (diff === 'easy') {
                easyBtn.className = "px-2.5 py-1 text-xs font-black rounded-lg transition-all bg-amber-500 text-white shadow-sm";
                normalBtn.className = "px-2.5 py-1 text-xs font-black rounded-lg transition-all text-slate-600 hover:text-slate-800";
                subtitle.innerText = "Current Mode: 🌱 Easy (Friendly 2-digit & facts up to 9×9)";
                document.getElementById('add-desc').innerText = "2-Digit Friendly Sums";
                document.getElementById('sub-desc').innerText = "Clean 2-Digit Subtract";
                document.getElementById('mul-desc').innerText = "Tables 2×2 to 9×9";
                document.getElementById('div-desc').innerText = "Facts up to 81 ÷ 9";
            } else {
                normalBtn.className = "px-2.5 py-1 text-xs font-black rounded-lg transition-all bg-purple-600 text-white shadow-sm";
                easyBtn.className = "px-2.5 py-1 text-xs font-black rounded-lg transition-all text-slate-600 hover:text-slate-800";
                subtitle.innerText = "Current Mode: ⚡ Normal (3-digit regrouping & facts up to 12×12)";
                document.getElementById('add-desc').innerText = "3-Digit Carrying";
                document.getElementById('sub-desc').innerText = "3-Digit Borrowing";
                document.getElementById('mul-desc').innerText = "Tables up to 12×12";
                document.getElementById('div-desc').innerText = "Facts up to 144 ÷ 12";
            }

            // Regenerate question if in game screen
            const gameScreen = document.getElementById('game-play-screen');
            if (!gameScreen.classList.contains('hidden')) {
                nextQuestion();
            }
        }

        function loadSavedStats() {
            const savedStars = localStorage.getItem('gw_math_stars');
            const savedScore = localStorage.getItem('gw_math_score');
            const savedSpeedBest = localStorage.getItem('gw_math_speed_best');

            if (savedStars) stars = parseInt(savedStars, 10) || 0;
            if (savedScore) score = parseInt(savedScore, 10) || 0;
            const speedBest = savedSpeedBest ? parseInt(savedSpeedBest, 10) : 0;

            document.getElementById('stars-display').innerText = stars;
            document.getElementById('score-display').innerText = score;
            document.getElementById('speed-high-score').innerText = `Best: ${speedBest}`;
        }

        function saveStats() {
            localStorage.setItem('gw_math_stars', stars);
            localStorage.setItem('gw_math_score', score);
            document.getElementById('stars-display').innerText = stars;
            document.getElementById('score-display').innerText = score;
        }

        function pressNum(digit) {
            SoundEngine.playClick();
            if (typedInput.length < 5) {
                typedInput += digit;
                updateAnswerDisplay();
            }
        }

        function pressClear() {
            SoundEngine.playClick();
            typedInput = '';
            updateAnswerDisplay();
        }

        function pressBackspace() {
            SoundEngine.playClick();
            typedInput = typedInput.slice(0, -1);
            updateAnswerDisplay();
        }

        function updateAnswerDisplay() {
            document.getElementById('answer-text').innerText = typedInput;
        }

        window.addEventListener('keydown', (e) => {
            const gameScreen = document.getElementById('game-play-screen');
            if (gameScreen.classList.contains('hidden')) return;

            if (e.key >= '0' && e.key <= '9') {
                pressNum(e.key);
            } else if (e.key === 'Backspace') {
                pressBackspace();
            } else if (e.key === 'Escape') {
                pressClear();
            } else if (e.key === 'Enter') {
                submitAnswer();
            }
        });

        function submitAnswer() {
            if (!typedInput) return;
            const userAns = parseInt(typedInput, 10);

            if (userAns === currentQuestion.ans) {
                // Correct
                SoundEngine.playCorrect();
                score += (currentDifficulty === 'normal' ? 15 : 10);
                streak++;

                if (currentMode === 'speed') {
                    speedScore++;
                }

                updateCatState('happy', "Awesome job! You solved it! Keep going! ⭐");
                spawnHeartParticles();

                if (streak >= 5) {
                    stars += 3;
                    score += 50;
                    saveStats();
                    triggerChestUnlock();
                    streak = 0;
                }

                saveStats();
                updateStreakUI();

                typedInput = '';
                updateAnswerDisplay();
                setTimeout(() => {
                    nextQuestion();
                }, 750);

            } else {
                // Wrong
                SoundEngine.playWrong();
                streak = 0;
                updateStreakUI();
                updateCatState('sad', `Nice try! ${currentQuestion.hint}`);
                typedInput = '';
                updateAnswerDisplay();
            }
        }

        function updateStreakUI() {
            document.getElementById('streak-count').innerText = streak;
            const bar = document.getElementById('streak-progress-bar');
            bar.style.width = `${(streak / 5) * 100}%`;
        }

        function updateCatState(mood, text) {
            const speech = document.getElementById('cat-speech');
            const svg = document.getElementById('cat-svg');
            const tear = document.getElementById('cat-tear');
            const mouth = document.getElementById('cat-mouth');

            speech.innerText = text;
            svg.classList.remove('cat-anim-happy', 'cat-anim-sad');

            document.getElementById('eye-happy-left').classList.add('hidden');
            document.getElementById('eye-happy-right').classList.add('hidden');
            document.getElementById('eye-sad-left').classList.add('hidden');
            document.getElementById('eye-sad-right').classList.add('hidden');
            document.getElementById('eye-normal-left').classList.remove('hidden');
            document.getElementById('eye-normal-right').classList.remove('hidden');
            tear.classList.add('hidden');

            if (mood === 'happy') {
                svg.classList.add('cat-anim-happy');
                document.getElementById('eye-normal-left').classList.add('hidden');
                document.getElementById('eye-normal-right').classList.add('hidden');
                document.getElementById('eye-happy-left').classList.remove('hidden');
                document.getElementById('eye-happy-right').classList.remove('hidden');
                mouth.setAttribute('d', 'M 40 60 Q 50 72 60 60');
            } else if (mood === 'sad') {
                svg.classList.add('cat-anim-sad');
                document.getElementById('eye-normal-left').classList.add('hidden');
                document.getElementById('eye-normal-right').classList.add('hidden');
                document.getElementById('eye-sad-left').classList.remove('hidden');
                document.getElementById('eye-sad-right').classList.remove('hidden');
                tear.classList.remove('hidden');
                mouth.setAttribute('d', 'M 40 68 Q 50 58 60 68');
            } else {
                mouth.setAttribute('d', 'M 44 63 Q 50 68 56 63');
            }
        }

        function spawnHeartParticles() {
            const wrapper = document.getElementById('cat-wrapper');
            for (let i = 0; i < 3; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart-particle text-red-500 text-sm font-black';
                heart.innerText = '❤️';
                heart.style.left = `${20 + Math.random() * 50}%`;
                heart.style.top = '10%';
                wrapper.appendChild(heart);
                setTimeout(() => heart.remove(), 900);
            }
        }

        function startTopicQuest(mode) {
            SoundEngine.playClick();
            currentMode = mode;
            streak = 0;
            updateStreakUI();

            document.getElementById('mode-select-screen').classList.add('hidden');
            document.getElementById('game-play-screen').classList.remove('hidden');
            document.getElementById('game-play-screen').classList.add('flex');
            document.getElementById('timer-badge').classList.add('hidden');

            const labels = {
                addition: 'Addition Quest',
                subtraction: 'Subtraction Quest',
                multiplication: 'Multiplication Quest',
                division: 'Division Quest',
                mixed: 'Mixed & Missing Numbers'
            };
            document.getElementById('mode-indicator').innerText = labels[mode] || 'Math Quest';

            updateCatState('normal', `Let's practice ${labels[mode]} in ${currentDifficulty.toUpperCase()} mode!`);
            nextQuestion();
        }

        function startSpeedRun() {
            SoundEngine.playClick();
            currentMode = 'speed';
            speedScore = 0;
            speedTimeLeft = 60;
            streak = 0;
            updateStreakUI();

            document.getElementById('mode-select-screen').classList.add('hidden');
            document.getElementById('game-play-screen').classList.remove('hidden');
            document.getElementById('game-play-screen').classList.add('flex');
            document.getElementById('timer-badge').classList.remove('hidden');
            document.getElementById('mode-indicator').innerText = '60s Speed Run';
            document.getElementById('time-left').innerText = speedTimeLeft;

            updateCatState('normal', "Speed Run starting! Quick, solve as many as possible!");
            nextQuestion();

            clearInterval(speedTimer);
            speedTimer = setInterval(() => {
                speedTimeLeft--;
                document.getElementById('time-left').innerText = speedTimeLeft;
                if (speedTimeLeft <= 0) {
                    clearInterval(speedTimer);
                    endSpeedRun();
                }
            }, 1000);
        }

        function nextQuestion() {
            typedInput = '';
            updateAnswerDisplay();
            currentQuestion = MathGenerator.generate(currentMode === 'speed' ? 'mixed' : currentMode, currentDifficulty);
            document.getElementById('question-text').innerText = currentQuestion.text;
        }

        function returnToMenu() {
            SoundEngine.playClick();
            clearInterval(speedTimer);
            document.getElementById('game-play-screen').classList.add('hidden');
            document.getElementById('game-play-screen').classList.remove('flex');
            document.getElementById('mode-select-screen').classList.remove('hidden');
            updateCatState('normal', "Welcome back! Choose a difficulty and topic to start!");
        }

        function triggerChestUnlock() {
            SoundEngine.playFanfare();
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            document.getElementById('chest-modal').classList.remove('hidden');
            document.getElementById('chest-modal').classList.add('flex');
        }

        function closeChestModal() {
            SoundEngine.playClick();
            document.getElementById('chest-modal').classList.add('hidden');
            document.getElementById('chest-modal').classList.remove('flex');
        }

        function endSpeedRun() {
            SoundEngine.playFanfare();
            const currentBest = parseInt(localStorage.getItem('gw_math_speed_best') || '0', 10);
            if (speedScore > currentBest) {
                localStorage.setItem('gw_math_speed_best', speedScore);
                document.getElementById('speed-high-score').innerText = `Best: ${speedScore}`;
            }

            document.getElementById('res-speed-score').innerText = speedScore;
            document.getElementById('res-speed-best').innerText = Math.max(speedScore, currentBest);

            document.getElementById('speed-results-modal').classList.remove('hidden');
            document.getElementById('speed-results-modal').classList.add('flex');
        }

        function closeSpeedResultsModal() {
            SoundEngine.playClick();
            document.getElementById('speed-results-modal').classList.add('hidden');
            document.getElementById('speed-results-modal').classList.remove('flex');
            returnToMenu();
        }

        function toggleAudio() {
            SoundEngine.muted = !SoundEngine.muted;
            const icon = document.getElementById('mute-icon');
            if (SoundEngine.muted) {
                icon.className = 'fa-solid fa-volume-xmark text-rose-500';
            } else {
                icon.className = 'fa-solid fa-volume-high text-slate-700';
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            loadSavedStats();
        });
