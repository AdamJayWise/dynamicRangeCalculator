console.log('Dynamic Range Calculator - 2020 Adam Wise');

/**  ok so this will be a dynamic range calculator
 there will be input fields for:
 - active area well depth
 - em gain register well depth
 - pre-amp gain
 - readout rate / noise


 there will also be pre-defined cameras and measurement modes
 so one camera object will have different readout rates available with different pairs of 
 readout rate : noise
 as well as pre-defined gains

 structured like this:

 "iXon888UltraBV" : {
    "displayName" : "iXon Ultra 888 BV",
    "emccd" : true,
    "ccdReadOutRates" : {1:6, 0.1:3.5} //readout rates in MHz and noises in e rms
    "emccdReadOutRates" : {30:130, 20:80, 10:40, 1:12},
    "activeAreaWellDepth" : ,
    "gainRegisterWellDepth" : 730000, 
 }

    "sCMOSReadOutModes" : {'16-Bit High Dynamic Range':1.6}


*/

// camera definitions

var cameras =  {
    "iXon888UltraBV" : {
        "displayName" : "iXon Ultra 888 BV",
        "emccd" : true,
        "ccdReadOutRates" : {1:6, 0.1:3.5}, //readout rates in MHz and noises in e rms
        "emccdReadOutRates" : {30:130, 20:80, 10:40, 1:12},
        "activeAreaWellDepth" : 80000,
        "gainRegisterWellDepth" : 730000, 
    },

};

// callback for radio button group that selects camera type... do something when changed
d3.selectAll('input[name="cameraTypeValue"]').on("change", function(){
    console.log("toot")
})

// create parameter inputs from objects
var paramDiv = d3.select("#parameterInputs");
[
    { param: 'activeAreaWellDepth', displayName : "Active Area Well Depth, e<sup>-</sup>", default : 0},
    { param: 'readOutNoise', displayName : "Read Out Noise, e<sup>-</sup>RMS", default : 1},
    { param: 'gainRegisterWellDepth', displayName : "EM Gain Register Well Depth, e<sup>-</sup>", default : 0},
    { param: 'EMGain', displayName : "EM Gain", default : 1},

].forEach(function(p){
    var newDiv = paramDiv.append('div');
    var labelDiv = newDiv.append('div').html(p['displayName'])
    var inputDiv = newDiv.append('div')
    var newInput = inputDiv.append('input').attr('type','text').property('value', p['default']).attr("id", p['param'] + "Input")

})