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

// how to handle this when cameras have different preamp gains...
// should they just be treated as modes?
// or should pre-amp gain be broken out separately
// considering there's a huge matrix of preamp gain and readout rate



var cameras =  {
    
    "iXon888UltraBV" : {
        "displayName" : "iXon Ultra 897",
        "emccd" : true,
        "readModes" : {
            0 : {'displayName' : '17 MHz EM, 1x Preamp Gain', 'gain' : 15, 'noise' : 240, 'type' : 'EMCCD', 'bitDepth' : 16},
            1 : {'displayName' : '17 MHz EM, 2x Preamp Gain', 'gain' : 7.5, 'noise' : 120, 'type' : 'EMCCD', 'bitDepth' : 16},
            2 : {'displayName' : '17 MHz EM, 3x Preamp Gain', 'gain' : 5, 'noise' : 80, 'type' : 'EMCCD', 'bitDepth' : 16},

            3 : {'displayName' : '10 MHz EM, 1x Preamp Gain', 'gain' : 15, 'noise' : 130, 'type' : 'EMCCD', 'bitDepth' : 16},
            4 : {'displayName' : '10 MHz EM, 2x Preamp Gain', 'gain' : 7.5, 'noise' : 80, 'type' : 'EMCCD', 'bitDepth' : 16},
            5 : {'displayName' : '10 MHz EM, 3x Preamp Gain', 'gain' : 5, 'noise' : 60, 'type' : 'EMCCD', 'bitDepth' : 16},

            3 : {'displayName' : '5 MHz EM, 1x Preamp Gain', 'gain' : 15, 'noise' : 67, 'type' : 'EMCCD', 'bitDepth' : 16},
            4 : {'displayName' : '5 MHz EM, 2x Preamp Gain', 'gain' : 7.5, 'noise' : 44, 'type' : 'EMCCD', 'bitDepth' : 16},
            5 : {'displayName' : '5 MHz EM, 3x Preamp Gain', 'gain' : 5, 'noise' : 37, 'type' : 'EMCCD', 'bitDepth' : 16},

            3 : {'displayName' : '3 MHz Conventional, 1x Preamp Gain', 'gain' : 3.8, 'noise' : 13, 'type' : 'CCD', 'bitDepth' : 16},
            4 : {'displayName' : '3 MHz Conventional, 2x Preamp Gain', 'gain' : 3.0, 'noise' : 11, 'type' : 'CCD', 'bitDepth' : 16},
            5 : {'displayName' : '3 MHz Conventional, 3x Preamp Gain', 'gain' : 1.4, 'noise' : 9, 'type' : 'CCD', 'bitDepth' : 16},
        },
        "activeAreaWellDepth" : 180000,
        "gainRegisterWellDepth" : 800000, 
    },

    /** 
    "ikonL936BV" : {
        "displayName" : "iKon-L 936 BV/BU2/FI",
        "ccd" : true,
        "emccd" : false,
        "readModes" : {
            0 : {'displayName' : '17 MHz EM, 1x Preamp Gain', 'gain' : 15, 'noise' : 240, 'type' : 'CCD'},
            1 : {'displayName' : '17 MHz EM, 2x Preamp Gain', 'gain' : 7.5, 'noise' : 120, 'type' : 'CCD'},
            2 : {'displayName' : '17 MHz EM, 3x Preamp Gain', 'gain' : 5, 'noise' : 80, 'type' : 'CCD'},
        },
        "ccdReadOutRates" : {0.05:6, 0.1:3.5}, //readout rates in MHz and noises in e rms
        "activeAreaWellDepth" : 100000,
        
    },
    */

};

// create a select for available cameras

var camSelect = d3.select("#cameraSelect");
Object.keys(cameras).forEach(function(k){
    var newOption = camSelect.append("option");
    newOption.attr("value", k).text(cameras[k]["displayName"])
});

var modeSelect = d3.select("#modeSelect");

// add callback to select
camSelect.on("change", function(){
    console.log(this.value);
    app['activeCamera'] = this.value;
    modeSelect.selectAll("option").remove();
    Object.keys(cameras[app["activeCamera"]]["readModes"]).forEach(function(k){
        var displayString = cameras[app["activeCamera"]]["readModes"][k]["displayName"];
        var newModeOption = modeSelect.append("option").attr("value",k).text(displayString)
    })

    modeSelect.dispatch("change");

})
 

// callback for readout mode select
modeSelect.on("change", function(){
    console.log(this.value);
    app["activeMode"] = this.value;

    var paramObj = cameras[app.activeCamera].readModes[app.activeMode];
    console.log(paramObj)

    // update the radio buttons
    console.log("#"+paramObj.type+"Type")
    d3.select("#"+paramObj.type+"Type").property("checked", true).dispatch("change");

    //update all the parameters
    d3.select("#activeAreaWellDepthInput").property("value", cameras[app.activeCamera]["activeAreaWellDepth"]).dispatch("change");
    d3.select("#readOutNoiseInput").property("value", cameras[app.activeCamera]["readModes"][app.activeMode]['noise']).dispatch("change");
    d3.select("#sensitivityInput").property("value", cameras[app.activeCamera]["readModes"][app.activeMode]['gain']).dispatch("change");
    d3.select("#bitDepthInput").property("value", cameras[app.activeCamera]["readModes"][app.activeMode]['bitDepth']).dispatch("change");


    if(app.cameraType=="EMCCD"){
        d3.select("#EMGainInput").property("value", cameras[app.activeCamera]["readModes"][app.activeMode]['noise']).dispatch("change");
    }
 
    

})

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
var paramSetup = [
    { param: 'activeAreaWellDepth', displayName : "Active Area Well Depth, e<sup>-</sup>", default : 80000},
    { param: 'readOutNoise', displayName : "Read Out Noise, e<sup>-</sup>RMS", default : 1},
    { param: 'sensitivity', displayName : "Sensitivity, e<sup>-</sup>/Count", default : 1},
    { param: 'bitDepth', displayName : "Bit Depth", default : 16},
    { param: 'gainRegisterWellDepth', displayName : "EM Gain Register Well Depth, e<sup>-</sup>", default : 800000,  EMCCD : true},
    { param: 'EMGain', displayName : "EM Gain", default : 100, EMCCD : true},

]

paramSetup.forEach(function(p){
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
            app[p["param"]] = Number(this.value);
            calculateDynamicRange();
        }
    })


    app[p["param"]] = p["default"];
})

function calculateDynamicRange(){

    // let's re-do this to generate some important stats regardless of type, and then print out the results at the end


    // string of notes/comments to output with results, starts empty
    var noteHTML = '';
    app['wellDepthLimitation'] = '';

    if ( (app["cameraType"] == 'CCD') || (app["cameraType"] == 'sCMOS') ){
        // in this case, dynamic range = min( (well depth / pre-amp gain) / readnoise, 2^bitdepth)
        app["naiveWellDepth"] = app["activeAreaWellDepth"];
        app["naiveDynamicRange"] =  ( app["activeAreaWellDepth"] ) / app['readOutNoise'];

        // find post-digitization dynamic range
        
        app["effectiveWellDepth"] = Math.min( app["activeAreaWellDepth"], 2**app["bitDepth"] * app['sensitivity']) ;
        
        if (app["activeAreaWellDepth"] > app["effectiveWellDepth"]){
            console.log('ding');
            app["wellDepthLimitation"] = "digitization of the active area <br> pixel well depth at this pre-amp gain";
        }

        app["effectiveReadNoise"] = app["readOutNoise"];
        app['dynamicRangeAfterDigitization'] =  app["effectiveWellDepth"] / app['readOutNoise'];
    } // END calculations if CCD or SCMOS... may break out scmos later but act the same for now

    if ( app["cameraType"] == 'EMCCD'  ){
        // in this case, dynamic range = min( (well depth / pre-amp gain) / readnoise, 2^bitdepth)
        app["effectiveReadNoise"] = Math.max(1, app['readOutNoise'] / app['EMGain']);
        // for an EMCCD, the naive well depth is either the active area or gain register well depth depending on the em gain
        app["naiveWellDepth"] = Math.min( app['gainRegisterWellDepth'] / app['EMGain'], app["activeAreaWellDepth"]);

        // if em gain is low, note that active area limits this
        if (app['gainRegisterWellDepth'] / app['EMGain'] > app["activeAreaWellDepth"]){
            noteHTML += "<span class = 'warning'> At low EM gains like this, active area pixels <br> saturate before the gain registers!</span><br><br>"
        }

        // the effective well depth is the min of 2^16, real well depth / em gain, and 
        var possibleLimits = [ app['gainRegisterWellDepth'] / app['EMGain'], app["activeAreaWellDepth"], (2**app["bitDepth"] * app["sensitivity"] / app["EMGain"])];
        app["effectiveWellDepth"] = d3.min(possibleLimits);
        var limitIndex = possibleLimits.indexOf(app['effectiveWellDepth']);
        app["wellDepthLimitation"] = {0:"effective EM gain register depth", 1:"active area pixel well depth", 2:"digitization of the EM gain register at this pre-amp and EM gain"}[limitIndex];
        
        app["naiveDynamicRange"] =  app["naiveWellDepth"] / app["effectiveReadNoise"];

        // find post-digitization dynamic range
        app['dynamicRangeAfterDigitization'] =  Math.min(app["effectiveWellDepth"] / app["effectiveReadNoise"]);

    } // END EMCCD calculations

    // update the notes with some info on the results of the calculation
    noteHTML += "The largest signal possible is " + Math.round(app["naiveWellDepth"]) + "e<sup>-</sup> <br>";
    noteHTML += "The smallest signal measureable at SNR=1 is " + Math.round(app["effectiveReadNoise"]) + "e<sup>-</sup> <br>";
    noteHTML += "An estimate of the Dynamic Range is " + Math.round(app["naiveDynamicRange"]) + "<br>";
    noteHTML += "<br>";

    if (app['naiveDynamicRange'] > app["dynamicRangeAfterDigitization"]){

        if (app['effectiveWellDepth'] < app['naiveWellDepth']){
            noteHTML += "<span class = 'warning'>Effectively, the largest signal measureable is " + Math.round(app["effectiveWellDepth"]) + ",<br> limited by "  + app["wellDepthLimitation"] + "</span><br>";
        }
    
        noteHTML += "<span class = 'warning'>In practice, Dynamic Range will be closer to " + Math.round(app["dynamicRangeAfterDigitization"]) + "</span><br>";
        
        
    }

    noteHTML += "<br>";

    noteHTML += "Questions about any of this? <br> <a href = 'https://andor.oxinst.com/contact'>Contact us!</a>"
    
    d3.select("#resultNotes").html(noteHTML)
}

calculateDynamicRange();

// start the gui chain
camSelect.dispatch("change");
modeSelect.dispatch("change");