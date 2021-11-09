var eves = new OmegaNum("0")
var evesps = new OmegaNum("0")
var elec = new OmegaNum("0")
var telec = new OmegaNum("0")

const evupgrades = {
    "upg1": new EvUpgrade(new OmegaNum("15"),
        level => new OmegaNum(new OmegaNum("0.3").mul(level)).add(1),
        level => new OmegaNum("1").mul(new OmegaNum("2").pow(level))),
    "upg2": new EvUpgrade(new OmegaNum("50"),
        level => new OmegaNum(new OmegaNum("0.35").mul(level)).add(1),
        level => eves.gte(1) ? new OmegaNum(eves.logBase("8").logBase("8").mul(level)).add(1) : new OmegaNum(1)),
    "upg3": new EvUpgrade(new OmegaNum("75e4"),
        level => new OmegaNum(new OmegaNum("1").mul(level)).add(1),
        level => tsbb >= 1 ? new OmegaNum(new OmegaNum(tsbb).add(1).logBase("4").mul(level)).add(1) : new OmegaNum(1)
    )
}
var bigbangs = 0
var tsbb = 0
const bbcosts = [[new OmegaNum("0"),"Electron I"],[new OmegaNum("1e6"),"Electron II"]]
var interval = null

function hardReset() {
    let confirmations = 0;
    do
    {
        if(!confirm("Are you " + "really ".repeat(confirmations) + "sure you want to lose all your progress? " +
            "Click " + (3 - confirmations) + " more " + (confirmations >= 2 ? "time" : "times") + " to reset."))
        {
            return;
        }
        confirmations++;
    } while(confirmations < 3)
    localStorage.setItem("EvolutionIncremental", "reset");
    loadGame("reset")
}

function bigBang(no) {
    if (bbcosts[bigbangs] !== undefined && eves.gte(bbcosts[bigbangs][0]) && no !== "no") {
        eves = new OmegaNum("0")
        bigbangs += 1
        for(const k of Object.getOwnPropertyNames(evupgrades))
    {
        if(evupgrades[k])
        {
            evupgrades[k].level = new OmegaNum("0");
        }
    }
    }
    if (eves.isNaN()) eves = new OmegaNum(0)
    bbcosts[bigbangs] === undefined ? document.getElementById("bigbangbutton").innerHTML = "No more Big Bangs available<br>More coming soon..." : document.getElementById("bigbangbutton").innerHTML = "Do a Big Bang.<br>" + bbcosts[bigbangs][0].toStringWithDecimalPlaces(4) + " Evolution Essence";
    document.getElementById("rank").innerHTML = bigbangs > 0 ? "Rank: " + bbcosts[bigbangs-1][1] : "Rank: Nothing"
    if (bigbangs > 0) {
        if (interval !== null) clearInterval(interval)
        document.getElementById("evrow1").innerHTML =
        "<a id='evbutton1' class='button' onclick='evupgrades.upg1.buy()'></a>" +
        "<a id='evbutton2' class='button' onclick='evupgrades.upg2.buy()'></a>"
        bigbangs === 2 ? document.getElementById("evrow1").innerHTML = document.getElementById("evrow1").innerHTML + "<a id='evbutton3' class='button' onclick='evupgrades.upg3.buy()'></a>" : ""
        interval = setInterval(() => {
            document.getElementById("evbutton1").innerHTML = "Multiply Evolution Essence gain.<br>Level "+evupgrades.upg1.level+"<br>Effect: x"+evupgrades.upg1.getEffect().toStringWithDecimalPlaces(4)+"<br>"+evupgrades.upg1.getDesc();
            document.getElementById("evbutton2").innerHTML = "Evolution Essence mutliplies itself.<br>Level "+evupgrades.upg2.level+"<br>Effect: x"+evupgrades.upg2.getEffect().toStringWithDecimalPlaces(4)+"<br>"+evupgrades.upg2.getDesc();
            bigbangs === 2 ? document.getElementById("evbutton3").innerHTML = "Time since Big Bang multiplies EE gain.<br>Level "+evupgrades.upg3.level+"<br>Effect: x"+evupgrades.upg3.getEffect().toStringWithDecimalPlaces(4)+"<br>"+evupgrades.upg3.getDesc() : null
        }, 1000/60);
    }
}

function saveGame(){
    try{
        localStorage.setItem("EvolutionIncremental", JSON.stringify({
            eves: eves.toString(),
            evesps: evesps.toString(),
            bigbangs: bigbangs,
            evupgrades: evupgrades
        }));
    }
    catch(e){
        console.warn("Could not save game.");
    }
}

function loadGame(str)
{
    let loadObj;
    str = str || localStorage.getItem("EvolutionIncremental") || "reset";
    if(str === "reset") return;
    try
    {
        loadObj = JSON.parse(str);
    }
    catch(e)
    {
        console.warn("hello your save broke :(");
        return false;
    }
    eves = new OmegaNum(loadObj.eves);
    evesps = new OmegaNum(loadObj.evesps);
    bigbangs = loadObj.bigbangs;
    for(const k of Object.getOwnPropertyNames(loadObj.evupgrades))
    {
        if(evupgrades[k])
        {
            evupgrades[k].level = new OmegaNum(loadObj.evupgrades[k].level);
        }
    }
    setInterval(() => {
        bigBang("no")
        clearInterval(1)
    }, 100);
}
loadGame()
setInterval(() => {
    saveGame()
}, 15000);
setInterval(() => {
    if (eves.isNaN()) eves = new OmegaNum(0)
    evesps = bigbangs < 1 ? new OmegaNum("0") : new OmegaNum("1").mul(evupgrades.upg1.getEffect()).mul(evupgrades.upg2.getEffect()).mul(evupgrades.upg3.getEffect())
    eves = eves.add(evesps.div(60))
    eves.gte(1/1000) ? document.getElementById("evescount").innerHTML = "You have " + eves.toStringWithDecimalPlaces(4) + " Evolution Essence (" + evesps.toStringWithDecimalPlaces(4) + "/s)" : null
    tsbb += 0.01
},1000/60);
