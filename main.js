var eves = new OmegaNum("0")
var evesps = new OmegaNum("0")
const evupgrades = {
    "upg1": new EvUpgrade(new OmegaNum("15"),
        level => new OmegaNum(new OmegaNum("0.25").mul(level)).add(1),
        level => new OmegaNum("1").mul(new OmegaNum("2").pow(level))),
    "upg2": new EvUpgrade(new OmegaNum("50"),
        level => new OmegaNum(new OmegaNum("0.3").mul(level)).add(1),
        level => new OmegaNum(eves.logBase("5").logBase("5").mul(level)).add(1),
    )
}
var bigbangs = 0
const bbcosts = [[new OmegaNum("0"),"Electron I"],[new OmegaNum("1e6"),"Electron II"]]
var interval = null

function bigBang(no) {
    if (bbcosts[bigbangs] !== undefined && eves.gte(bbcosts[bigbangs][0]) && no !== "no") {
        eves = new OmegaNum("0")
        bigbangs += 1
    }
    bbcosts[bigbangs] === undefined ? document.getElementById("bigbangbutton").innerHTML = "No more Big Bangs available<br>More coming soon..." : document.getElementById("bigbangbutton").innerHTML = "Do a Big Bang.<br>" + bbcosts[bigbangs][0].toStringWithDecimalPlaces(4) + " Evolution Essence";
    document.getElementById("rank").innerHTML = bigbangs > 0 ? "Rank: " + bbcosts[bigbangs-1][1] : "Rank: Nothing"
    if (bigbangs > 0) {
        if (interval !== null) clearInterval(interval)
        document.getElementById("evrow1").innerHTML =
        "<a id='evbutton1' class='button' onclick='evupgrades.upg1.buy()'></a>" +
        "<a id='evbutton2' class='button' onclick='evupgrades.upg2.buy()'></a>"
        interval = setInterval(() => {
            document.getElementById("evbutton1").innerHTML = "Multiply Evolution Essence gain.<br>Level "+evupgrades.upg1.level+"<br>Effect: x"+evupgrades.upg1.getEffect().toStringWithDecimalPlaces(4)+"<br>"+evupgrades.upg1.getDesc();
            document.getElementById("evbutton2").innerHTML = "Evolution Essence mutliplies itself.<br>Level "+evupgrades.upg2.level+"<br>Effect: x"+evupgrades.upg2.getEffect().toStringWithDecimalPlaces(4)+"<br>"+evupgrades.upg2.getDesc()
        }, 10);
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

function loadGame()
{
    let loadObj;
    str = localStorage.getItem("EvolutionIncremental") || null;
    if(str === null) return;
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
    evesps = bigbangs === 0 ? new OmegaNum("0") : new OmegaNum("1").mul(evupgrades.upg1.getEffect()).mul(evupgrades.upg2.getEffect())
    eves = eves.add(evesps.div("100"))
    eves.gte(1/1000) ? document.getElementById("evescount").innerHTML = "You have " + eves.toStringWithDecimalPlaces(4) + " Evolution Essence (" + evesps.toStringWithDecimalPlaces(4) + "/s)" : null
},10);
