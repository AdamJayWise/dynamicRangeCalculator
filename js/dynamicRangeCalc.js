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

// globals 
var app = {
    cameraType : 'CCD',
};

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
    console.log(this.value);
    app["cameraType"] = this.value;
    if (this.value == "EMCCD"){
        //d3.selectAll("input.EMCCD").property("disabled",false)
        d3.selectAll(".EMCCD").style("display","block")
        
    }
    else {
        console.log(this.value)
        //d3.selectAll("input.EMCCD").attr("disabled",true);
        d3.selectAll(".EMCCD").style("display","none")
    }

    calculateDynamicRange();
})

// create parameter inputs from objects
var paramDiv = d3.select("#parameterInputs");
[
    { param: 'activeAreaWellDepth', displayName : "Active Area Well Depth, e<sup>-</sup>", default : 80000},
    { param: 'readOutNoise', displayName : "Read Out Noise, e<sup>-</sup>RMS", default : 1},
    { param: 'sensitivity', displayName : "Sensitivity, e<sup>-</sup>/Count", default : 1},
    { param: 'bitDepth', displayName : "Bit Depth", default : 16},
    { param: 'gainRegisterWellDepth', displayName : "EM Gain Register Well Depth, e<sup>-</sup>", default : 800000,  EMCCD : true},
    { param: 'EMGain', displayName : "EM Gain", default : 100, EMCCD : true},

].forEach(function(p){
    var newDiv = paramDiv.append('div');
    var labelDiv = newDiv.append('div').html(p['displayName']);
    var inputDiv = newDiv.append('div');
    var newInput = inputDiv.append('input').attr('type','text').property('value', p['default']).attr("id", p['param'] + "Input");
    
    // set as intially disabled if emccd-related
    if (p['EMCCD']){
        //newInput.attr('disabled', true);
        newDiv.classed("EMCCD", true);
        newDiv.style("display", "none")
    }

    // validate and update parameter when input is changed
    newInput.on('change', function(){
        console.log(this.value);
        if (Number(this.value) && (this.value>0) ){
            app[p["param"]] = this.value;
            calculateDynamicRange();
        }
    })


    app[p["param"]] = p["default"];
})

function calculateDynamicRange(){

    var noteHTML = ''

    if ( (app["cameraType"] == 'CCD') || (app["cameraType"] == 'sCMOS') ){
        // in this case, dynamic range = min( (well depth / pre-amp gain) / readnoise, 2^bitdepth)
        var dynamicRangeInitial =  ( app["activeAreaWellDepth"] ) / app['readOutNoise'];
        app['dynamicRangeBeforeDigitization'] = dynamicRangeInitial;

        var dynamicRangeWithSensitivity = app["activeAreaWellDepth"] / app['readOutNoise'] / app['sensitivity'] ;
        if ( dynamicRangeWithSensitivity > 2**app['bitDepth']){
            noteHTML += 'Dynamic range is limited by bit depth <br>';
        }

        // find post-digitization dynamic range
         app['dynamicRangeAfterDigitization'] =  Math.min(2**app['bitDepth'], dynamicRangeWithSensitivity);
    }

    if ( app["cameraType"] == 'EMCCD'  ){
        // in this case, dynamic range = min( (well depth / pre-amp gain) / readnoise, 2^bitdepth)
        var effectiveReadNoise = Math.max(1, app['readOutNoise'] / app['EMGain']);
        var effectiveWellDepth = app['gainRegisterWellDepth'] / app['EMGain'];
        
        var dynamicRangeInitial =  effectiveWellDepth / effectiveReadNoise;
        app['dynamicRangeBeforeDigitization'] = dynamicRangeInitial;

        if (dynamicRangeInitial > 2**app['bitDepth']){
            noteHTML += 'Dynamic range is limited by bit depth <br>';
        }

        // find post-digitization dynamic range
         app['dynamicRangeAfterDigitization'] =  Math.min(2**app['bitDepth'], dynamicRangeInitial);
    }

    d3.select("#dynamicRangeAfterDigitization").text(Math.round(app["dynamicRangeAfterDigitization"]));
    d3.select("#dynamicRangeBeforeDigitization").text(Math.round(app["dynamicRangeBeforeDigitization"]));
    d3.select("#resultNotes").html(noteHTML)
}

calculateDynamicRange();