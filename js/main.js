/**
 * By: Simon Perdrisat // gagarine // perdrisat@gmail.com
 */


/**
 *  Class Simon Game
 * @param btns
 * @param synthesizer
 * @constructor
 */
function SimonGame(btns, synthesizer) {
    this.btns = btns;
    this.synthesizer = synthesizer;
    this.numberOfLevel = 50;
    this.currentLevel = 0;
    this.sequence = '';
    this.playingStep = null;
    this.speed = 350;
}

SimonGame.prototype.play = function () {
    // this.btnGreen.lightUp();
    // this.synthesizer.play(this.btnGreen.soundFrequency);
    this.sequence = this.generateSequence();
    this.playSequence(0);

    var that = this;
    for (var key in this.btns) {
        (function (currentBtn, synthetiser) {
            currentBtn.element.addEventListener( 'mousedown', function () {
                currentBtn.lightUp();
                synthetiser.play(currentBtn.soundFrequency);
            }, false);
            currentBtn.element.addEventListener('mouseup', function () {
                currentBtn.lightDown();
                synthetiser.stop();
            }, false);
        })(this.btns[key],this.synthesizer);
    }
};

SimonGame.prototype.playSequence = function (step) {
    var that = this; // stupid JS
    this.btns[this.sequence[step]].lightUp();
    this.synthesizer.play(this.btns[this.sequence[step]].soundFrequency);
    setTimeout(function () {
        that.btns[that.sequence[step]].lightDown();
        that.synthesizer.stop(); //
        if (step < that.currentLevel) {
            that.playSequence(step + 1);
        }
    }, this.speed);
}

SimonGame.prototype.generateSequence = function () {
    var sequence = "";
    for (var i = 0; i < this.numberOfLevel; i++) {
        sequence += Math.floor((Math.random() * 4)); // add a random number from 0 to 3 (we can use btns.lenght...)
    }
    return sequence;
}


/**
 * Class Button
 *
 * @param element
 * @param soundFrequency
 * @constructor
 */
function Button(element, soundFrequency) {
    this.element = element;
    this.soundFrequency = soundFrequency;
}

Button.prototype.lightUp = function () {
    this.element.classList.add("lightUp");
};

Button.prototype.lightDown = function () {
    this.element.classList.remove("lightUp");
};

Button.prototype.pressed = function () {
    this.lightUp();
};

Button.prototype.release = function () {
    this.lightDown();
};

/**
 * Class Synthesizer
 *
 * @constructor
 */
function Synthesizer() {
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
    var btns, synthesizer, mySimonGame;

    btns = [];

    btns.push(new Button(document.getElementById('btnGreen'), 330));
    btns.push(new Button(document.getElementById('btnRed'), 261));
    btns.push(new Button(document.getElementById('btnYellow'), 392));
    btns.push(new Button(document.getElementById('btnBlue'), 523));

    synthesizer = new Synthesizer();

    mySimonGame = new SimonGame(btns, synthesizer);
    mySimonGame.play();
}


// Launch init on Document ready...
document.addEventListener('DOMContentLoaded', init());
