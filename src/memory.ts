import {  sampleSize } from "lodash"

export class Memory {

    /** 
     * @param {number} maxMemory
    */
   
   maxMemory: number = 0;
   samples: any[] = [];

    constructor(maxMemory: number){
        this.maxMemory = maxMemory
        this.samples = new Array()
    }

    /** 
     * @param {Array} sample
    */
   
    addSample(sample: any){
        this.samples.push(sample)
        if(this.samples.length > this.maxMemory){
            this.samples.shift()
        }
    }

    sample(nSamples: any) {
        return sampleSize(this.samples, nSamples)
    }

}