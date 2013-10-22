/**
 * By: Simon Perdrisat // gagarine // perdrisat@gmail.com
 */



// Launch init on Document ready...
document.addEventListener('DOMContentLoaded', init );

/**
 *  Class Simon Game
 * @param btns
 * @param synthesizer
 * @constructor
 */
function SimonGame(btns) {
    this.btns = btns;
    this.numberOfLevel = 50;
    this.currentLevel = 0;
    this.sequence = '';
    this.playerStep = 0;
    this.speed = 300;

    document.addEventListener('buttonPress', this.buttonClickHandler.bind(this), false);
}

SimonGame.prototype.play = function () {
    this.sequence = this.generateSequence();
    this.playSequence(0);
};

SimonGame.prototype.buttonClickHandler = function (event) {

    if (this.isValidKey(this.playerStep, event.detail.key)) {
        if (this.playerStep == this.currentLevel) {
            this.nextLevel();
        } else {
            this.nextStep()
        }
    } else {
        this.gameOver();
    }
};

SimonGame.prototype.nextLevel = function () {
    var that = this;
    this.currentLevel = this.currentLevel + 1;
    this.playerStep = 0;
    setTimeout(function () {
        that.playSequence(0)
    }, 500);
};

SimonGame.prototype.nextStep = function () {
    this.playerStep = this.playerStep + 1;
};

SimonGame.prototype.isValidKey = function (step, key) {
    return this.sequence[step] == key;
};

SimonGame.prototype.gameOver = function() {
    console.log('game over!');
    var that = this;
    that.currentLevel = 0;
    setTimeout(function() { that.play(); }, 2000)
};



SimonGame.prototype.playSequence = function (step) {
    var that = this;
    this.btns[this.sequence[step]].down();
    setTimeout(function () {
        that.btns[that.sequence[step]].up();
        if (step < that.currentLevel) {
            setTimeout(function(){ that.playSequence(step + 1) },200);
        }
    }, this.speed);
};

SimonGame.prototype.generateSequence = function () {
    var sequence = "";
    for (var i = 0; i < this.numberOfLevel; i++) {
        sequence += Math.floor((Math.random() * 4)); // add a random number from 0 to 3 (we can use btns.lenght...)
    }
    return sequence;
};


/**
 * Class Button
 *
 * @param element
 * @param soundFrequency
 * @constructor
 * @param key
 * @param synthesizer
 */
function Button(key, element, soundFrequency, synthesizer) {
    this.key = key;
    this.element = element;
    this.synthesizer = synthesizer;
    this.soundFrequency = soundFrequency;

    this.pressEvent = new CustomEvent('buttonPress', { 'detail': { 'key': this.key }});
    this.releaseEvent = new CustomEvent('buttonRelease', { 'detail': { 'key': this.key }});

    // See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener#The_value_of_this_within_the_handler
    this.element.addEventListener('mousedown', this.press.bind(this), false);
    this.element.addEventListener('mouseup', this.release.bind(this), false);

}

Button.prototype.lightUp = function () {
    this.element.classList.add("lightUp");
};

Button.prototype.lightDown = function () {
    this.element.classList.remove("lightUp");
};

Button.prototype.press = function () {
    document.dispatchEvent(this.pressEvent);
    this.down();
};

Button.prototype.release = function () {
    document.dispatchEvent(this.releaseEvent);
    this.up();
};

Button.prototype.down = function () {
    this.lightUp();
    this.synthesizer.play(this.soundFrequency);

};

Button.prototype.up = function () {
    this.lightDown();
    this.synthesizer.stop();
};

/**
 * Class Synthesizer
 *
 * @constructor
 */
function Synthesizer() {
    this.oscillator = null;
    try {
        this.audio_context = new (window.AudioContext || window.webkitAudioContext);
    } catch (e) {
        alert('No web audio oscillator support in this browser');
    }
}

Synthesizer.prototype.play = function (freq) {
    this.oscillator = this.audio_context.createOscillator();
    this.oscillator.frequency.value = freq;
    this.oscillator.connect(this.audio_context.destination);
    this.oscillator.start(0);
};


Synthesizer.prototype.stop = function () {
    this.oscillator.stop(0);
};


/////// INIT
function init() {
    var btns, mySimonGame;

    btns = [];

    btns.push(new Button(0, document.getElementById('btnGreen'), 330, new Synthesizer()));
    btns.push(new Button(1, document.getElementById('btnRed'), 261, new Synthesizer()));
    btns.push(new Button(2, document.getElementById('btnYellow'), 392, new Synthesizer()));
    btns.push(new Button(3, document.getElementById('btnBlue'), 523, new Synthesizer()));

    mySimonGame = new SimonGame(btns);
    mySimonGame.play();
}


