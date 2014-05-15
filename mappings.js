// File with various and sundry synth / mapping functions
var noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

function midiToNoteName(midiNumber) {
    var noteName = noteNames[midiNumber % 12];
    var octave = Math.floor(midiNumber / 12) - 2;
    return noteName + octave.toString();
}

// Mouse on / off functions:
function betterNoteClick(synth, note) {
    synth.playNote(note);
    mostRecentNote = note
}

function betterNoteStop(synth, note) {
    synth.stopNote(note);
}

function makeAndMap(theButton, noteFreq) {
        var mouseDownFunc = partial(betterNoteClick, synth, noteFreq);
        var mouseUpFunc = partial(betterNoteStop, synth, noteFreq);
        theButton.button.node.addEventListener('mousedown', mouseDownFunc);
        theButton.button.node.addEventListener('mouseup', mouseUpFunc);
        theButton.button.node.addEventListener('mouseout', mouseUpFunc);
}

// Takes a list of buttonData, with mapping info, and applies it.
// This data will, 9999/10000 times, come from the server
function applyKnownMapping(returnedButtonData) {
    for (var i = 0; i < buttonData.length; i++) {
        // find the match in returnedButtonData, and map it
        for (var j = 0; j < returnedButtonData.length; j++) {
            if (buttonData[i].location.x == returnedButtonData[j].location.x && buttonData[i].location.y == returnedButtonData[j].location.y) {
                makeAndMap(buttonData[i], returnedButtonData[j].noteFreq);
                break;
            }
        }
    }
}


// Legacy!
// we're going to do just distance, and just octaves, for now...
// There's got to be a way to connect this to buttonDifferences, but they're coming in different orders, o
function mapByRatio(buttons, baseNoteNumber) {
    var baseLocation = buttons[0].location;
    var baseFreq = midiNoteToFrequency(baseNoteNumber);

    var maxDistance = 0;
    for (var i = 0; i < buttons.length; i++) {
        var distance = Math.sqrt(Math.pow(buttons[i].location.x - baseLocation.x, 2) + Math.pow(buttons[i].location.y - baseLocation.y, 2));
        if (distance > maxDistance) {
            maxDistance = distance;
        }
    }

    for (var i = 0; i < buttons.length; i++) {
        var distance = Math.sqrt(Math.pow(buttons[i].location.x - baseLocation.x, 2) + Math.pow(buttons[i].location.y - baseLocation.y, 2));
        var ratio = (distance / maxDistance) + 1;
        var freq = ratio * baseFreq;

        var synth = new Synth({
            context: tsw.context(),
            speakersOn: true
        });

        var mouseDownFunc = partial(betterNoteClick, synth, freq);
        var mouseUpFunc = partial(betterNoteStop, synth, freq);
        buttons[i].button.node.addEventListener('mousedown', mouseDownFunc);
        buttons[i].button.node.addEventListener('mouseup', mouseUpFunc);
    }
}
