class EvUpgrade {
    constructor(cost,costgain,effect) {
        this.level = new OmegaNum("0")
        this.costgain = costgain
        this.basecost = cost
        this.effect = effect
    }
    getEffect() {
        return this.effect(this.level)
    }
    getDesc() {
        return this.basecost.pow(this.costgain(this.level)).toStringWithDecimalPlaces(4) + " Evolution Essence"
    }
    buy()
    {
        if(eves.gte(this.basecost.pow(this.costgain(this.level))))
        {
            eves = eves.sub(this.basecost.pow(this.costgain(this.level)));
            this.level = this.level.add(1);
        }
    }
}